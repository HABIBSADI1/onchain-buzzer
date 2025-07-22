import 'dotenv/config'
import fs from 'fs/promises'
import express from 'express'
import cors from 'cors'
import {
  createWalletClient,
  createPublicClient,
  http,
  getContract,
  type Abi
} from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// ✅ ENV config
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
  console.error('❌ Missing env vars')
  process.exit(1)
}

const BLOCK_STEP = 500n
const MAX_ROUNDS = 25

// ✅ ABI
const abi = [
  {
    type: 'function',
    name: 'getGameState',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'roundId', type: 'uint256' },
      { name: 'lastPlayer', type: 'address' },
      { name: 'pot', type: 'uint256' },
      { name: 'timeRemaining', type: 'uint256' },
      { name: 'clicks', type: 'uint256' },
      { name: 'payoutDone', type: 'bool' }
    ]
  },
  {
    type: 'function',
    name: 'forcePayout',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    type: 'event',
    name: 'RoundSettled',
    inputs: [
      { name: 'roundId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: true },
      { name: 'reward', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ],
    anonymous: false
  }
] as const

const eventAbi: Abi = [abi[2]]

// ✅ viem clients
const account = privateKeyToAccount(PRIVATE_KEY)

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL)
})

const walletClient = createWalletClient({
  chain: base,
  transport: http(RPC_URL),
  account
})

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: { public: publicClient, wallet: walletClient }
})

// ✅ MAIN logic for cron
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

// ✅ fetch RoundSettled events
async function fetchRecentRounds() {
  try {
    const latestBlock = await publicClient.getBlockNumber()
    console.log(`📦 Scanning logs up to block ${latestBlock}`)

    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS,
      abi: eventAbi,
      eventName: 'RoundSettled',
      fromBlock: latestBlock - 2000n,
      toBlock: latestBlock
    } as any)

    const parsed = logs.map((log: any) => ({
      roundId: log.args.roundId,
      winner: log.args.winner,
      reward: log.args.reward,
      timestamp: log.args.timestamp
    }))

    const sorted = parsed.sort((a, b) => Number(b.roundId - a.roundId))
    await fs.writeFile('server/data.json', JSON.stringify(sorted.slice(0, MAX_ROUNDS), null, 2))
    console.log(`📥 Cached ${sorted.length} rounds → server/data.json`)
  } catch (e) {
    console.error('❌ Error in fetchRecentRounds():', e)
  }
}

runPayoutWatcher()

// ✅ EXPRESS API to expose /data.json
const app = express()
app.use(cors())

app.get('/rounds', async (req, res) => {
  try {
    const data = await fs.readFile('server/data.json', 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: 'Could not read data.json' })
  }
})

// ✅ Start API server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}`)
})
