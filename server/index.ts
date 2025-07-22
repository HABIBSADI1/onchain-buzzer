import 'dotenv/config'
import fs from 'fs/promises'
import express, { Request, Response } from 'express'
import cors from 'cors'
import {
  createWalletClient,
  createPublicClient,
  http,
  getContract
} from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

// ✅ ENV config
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
  console.error('❌ Missing environment variables.')
  process.exit(1)
}

const MAX_ROUNDS = 25

// ✅ ABI از storage
const abi = [
  {
    type: 'function',
    name: 'getGameState',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_roundId', type: 'uint256' },
      { name: '_lastPlayer', type: 'address' },
      { name: '_pot', type: 'uint256' },
      { name: '_timeRemaining', type: 'uint256' },
      { name: '_clicks', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'payoutDone',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'forcePayout',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    type: 'function',
    name: 'totalRounds',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getRound',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [
      { name: 'roundId', type: 'uint256' },
      { name: 'winner', type: 'address' },
      { name: 'reward', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' }
    ]
  }
] as const

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

// ✅ Cron Job Main Function
async function runPayoutWatcher() {
  console.log(`\n🚀 Job started at ${new Date().toISOString()}`)

  try {
    const [roundId, , , timeRemaining] = await contract.read.getGameState()
    const payoutDone = await contract.read.payoutDone()

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

// ✅ خواندن مستقیم راندهای قبلی از storage کانترکت
async function fetchRecentRounds() {
  try {
    await fs.mkdir('server', { recursive: true })

    const totalRounds: bigint = await contract.read.totalRounds()
    const rounds: any[] = []

    const from = totalRounds > BigInt(MAX_ROUNDS)
      ? totalRounds - BigInt(MAX_ROUNDS)
      : 0n

    for (let i = totalRounds - 1n; i >= from; i--) {
      try {
        const [roundId, winner, reward, timestamp] = await contract.read.getRound([i])
        if (timestamp !== 0n) {
          rounds.push({ roundId, winner, reward, timestamp })
        }
      } catch (e) {
        console.warn(`⚠️ Could not fetch round ${i}:`, e)
      }
    }

    await fs.writeFile('server/data.json', JSON.stringify(rounds, null, 2))
    console.log(`📥 Cached ${rounds.length} rounds → server/data.json`)
  } catch (e) {
    console.error('❌ Error in fetchRecentRounds():', e)
  }
}


// ✅ Express API server
const app = express()
app.use(cors())

app.get('/rounds', async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile('server/data.json', 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data.json' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`📡 Server running at http://localhost:${PORT}`)
})

// ✅ Start cron job
runPayoutWatcher()
