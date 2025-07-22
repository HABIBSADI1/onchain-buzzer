import 'dotenv/config'
import { createWalletClient, createPublicClient, http, getContract, parseAbi } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import fs from 'fs/promises'

// ✅ تنظیمات ENV
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
  console.error('❌ Missing env vars')
  process.exit(1)
}

const BLOCK_STEP = 500n
const MAX_ROUNDS = 25

// ✅ ABI → `as const` for typing
const abi = parseAbi([
  'function getGameState() view returns (uint256 roundId, address lastPlayer, uint256 pot, uint256 timeRemaining, uint256 clicks, bool payoutDone)',
  'function forcePayout()',
  'event RoundSettled(uint256 roundId, address winner, uint256 reward, uint256 timestamp)'
]) as const

// 🧠 اتصال به کلاینت‌ها
const account = privateKeyToAccount(PRIVATE_KEY)

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
})

const walletClient = createWalletClient({
  chain: base,
  transport: http(RPC_URL),
  account,
})

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: { public: publicClient, wallet: walletClient },
})

// ✅ اجرای cron logic
async function runPayoutWatcher() {
  console.log(`\n🚀 Job started at ${new Date().toISOString()}`)

  try {
    const [roundId, , , timeRemaining, , payoutDone] = await contract.read.getGameState()

    console.log(`🕐 Round #${roundId} → timeRemaining: ${timeRemaining}, payoutDone: ${payoutDone}`)

    if (timeRemaining === 0n && !payoutDone) {
      console.log('⏱ Round ended. Forcing payout...')
      const { request } = await contract.simulate.forcePayout()
      const txHash = await walletClient.writeContract(request)
      console.log(`✅ Payout tx sent → https://basescan.org/tx/${txHash}`)
    } else {
      console.log('⏳ No payout needed.')
    }

    await fetchRecentRounds()
    console.log(`✅ Job completed at ${new Date().toISOString()}`)
  } catch (err) {
    console.error('❌ Error in runPayoutWatcher():', err)
  }
}

// ✅ جمع‌آوری راندها
async function fetchRecentRounds() {
  try {
    const latestBlock = await publicClient.getBlockNumber()
    console.log(`📦 Scanning logs up to block ${latestBlock}`)

    let rounds: any[] = []

    for (let fromBlock = 0n; fromBlock <= latestBlock && rounds.length < MAX_ROUNDS; fromBlock += BLOCK_STEP) {
      const toBlock = fromBlock + BLOCK_STEP < latestBlock ? fromBlock + BLOCK_STEP : latestBlock

      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        abi,
        eventName: 'RoundSettled',
        fromBlock,
        toBlock,
      })

      const parsed = logs.map(log => ({
        roundId: log.args.roundId,
        winner: log.args.winner,
        reward: log.args.reward,
        timestamp: log.args.timestamp,
      }))

      rounds = [...parsed, ...rounds]
    }

    rounds.sort((a, b) => Number(b.roundId - a.roundId))

    const outPath = 'server/data.json'
    await fs.writeFile(outPath, JSON.stringify(rounds.slice(0, MAX_ROUNDS), null, 2))
    console.log(`📥 Cached ${rounds.length} rounds → ${outPath}`)
  } catch (e) {
    console.error('❌ Error in fetchRecentRounds():', e)
  }
}

runPayoutWatcher()
