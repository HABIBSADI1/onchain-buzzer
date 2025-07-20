import 'dotenv/config'
import { createWalletClient, createPublicClient, http, getContract } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import abi from './abi.json'
import fs from 'fs/promises'

// ✅ تنظیمات
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

const BLOCK_STEP = 500n
const MAX_ROUNDS = 25

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

// ✅ تسویه خودکار
async function runPayoutWatcher() {
  try {
    const game = await contract.read.getGameState()
    const timeRemaining = game.timeRemaining as bigint
    const payoutDone = game.payoutDone as boolean
    const roundId = game.roundId as bigint

    console.log(`🕐 Round #${roundId} → timeRemaining: ${timeRemaining}, payoutDone: ${payoutDone}`)

    if (timeRemaining === 0n && !payoutDone) {
      console.log('⏱ Round ended. Forcing payout...')
      const { request } = await contract.simulate.forcePayout()
      const txHash = await walletClient.writeContract(request)
      console.log(`✅ Payout tx sent: ${txHash}`)
    } else {
      console.log('⏳ No payout needed.')
    }

    await fetchRecentRounds()
  } catch (err) {
    console.error('❌ Payout watcher error:', err)
  }
}

// ✅ ذخیره event های RoundSettled
async function fetchRecentRounds() {
  try {
    const latestBlock = await publicClient.getBlockNumber()
    let rounds: any[] = []

    for (
      let fromBlock = 0n;
      fromBlock <= latestBlock && rounds.length < MAX_ROUNDS;
      fromBlock += BLOCK_STEP
    ) {
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
      if (rounds.length >= MAX_ROUNDS) break
    }

    rounds.sort((a, b) => Number(b.roundId - a.roundId))

    await fs.writeFile('server/data.json', JSON.stringify(rounds.slice(0, MAX_ROUNDS), null, 2))
    console.log(`📦 Cached ${rounds.length} rounds to server/data.json`)
  } catch (e) {
    console.error('❌ Error caching rounds:', e)
  }
}

// 🏁 اجرای اولیه
runPayoutWatcher()
