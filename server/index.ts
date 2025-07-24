import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import express, { Request, Response } from 'express'
import cors from 'cors'
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

// ✅ ENV config
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!

if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
  console.error('❌ Missing environment variables.')
  process.exit(1)
}

const MAX_ROUNDS = 25
const DATA_PATH = path.join(__dirname, 'data.json')

// ✅ Contract ABI
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

// ✅ Setup clients
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
  client: {
    public: publicClient,
    wallet: walletClient
  }
})

// ✅ Payout logic
async function runPayoutWatcher() {
  console.log(`🚀 Job started at ${new Date().toISOString()}`)

  try {
    const [roundId, , , timeRemaining] = await contract.read.getGameState()
    const payoutDone = await contract.read.payoutDone()

    console.log(`🕐 Round #${roundId} → timeRemaining: ${timeRemaining}, payoutDone: ${payoutDone}`)

    if (timeRemaining === 0n && !payoutDone) {
      console.log('⏱ Forcing payout...')
      const { request } = await contract.simulate.forcePayout()
      const txHash = await walletClient.writeContract(request)
      console.log(`✅ Payout tx → https://basescan.org/tx/${txHash}`)
    } else {
      console.log('⏳ No payout needed.')
    }

    await fetchRecentRounds()
    console.log(`✅ Job finished at ${new Date().toISOString()}`)
  } catch (err) {
    console.error('❌ Error in payout watcher:', err)
  }
}

// ✅ Round fetcher
async function fetchRecentRounds() {
  try {
    const totalRounds: bigint = await contract.read.totalRounds()
    const rounds: any[] = []

    const from = totalRounds > BigInt(MAX_ROUNDS) ? totalRounds - BigInt(MAX_ROUNDS) : 0n

    for (let i = totalRounds - 1n; i >= from; i--) {
      try {
        const [roundId, winner, reward, timestamp] = await contract.read.getRound([i])
        if (timestamp !== 0n) {
          rounds.push({
            roundId: roundId.toString(),
            winner,
            reward: reward.toString(),
            timestamp: timestamp.toString()
          })
        }
      } catch (err) {
        console.warn(`⚠️ Could not fetch round ${i}:`, err)
      }
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(rounds, null, 2), 'utf-8')
    console.log(`📥 Cached ${rounds.length} rounds → ${DATA_PATH}`)
  } catch (e) {
    console.error('❌ Error in fetchRecentRounds():', e)
  }
}

// ✅ Express API
const app = express()
app.use(cors())

app.get('/rounds', async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data.json' })
  }
})

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0' // ✅ مهم برای deploy شدن

app.listen(PORT, HOST, () => {
  console.log(`📡 API available at http://${HOST}:${PORT}`)
})

// ✅ Start services
runPayoutWatcher()

fetchRecentRounds()
  .then(() => console.log('✅ Round data fetched manually.'))
  .catch(console.error)
