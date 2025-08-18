import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs/promises'
import path from 'path'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'

import { createPublicClient, getContract, http } from 'viem'
import { base } from 'viem/chains'

// Env vars
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!

if (!CONTRACT_ADDRESS || !RPC_URL) {
  console.error('❌ Missing required env variables.')
  process.exit(1)
}

const MAX_ROUNDS = 25

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
      { name: '_clicks', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'payoutDone',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'totalRounds',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
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
      { name: 'timestamp', type: 'uint256' },
    ],
  },
] as const

// viem public client
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
})

const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi,
  client: publicClient,
})

// Paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_PATH = path.join(__dirname, 'data.json')

// Watcher
async function runWatcher() {
  console.log(`🚀 Job started at ${new Date().toISOString()}`)

  try {
    const [roundId, , , timeRemaining] = await contract.read.getGameState()
    const payoutDone = await contract.read.payoutDone()

    console.log(`🕐 Round #${roundId} → timeRemaining: ${timeRemaining}, payoutDone: ${payoutDone}`)

    if (timeRemaining === 0n && !payoutDone) {
      console.log('⚠️ Payout needed, but backend is read-only.')
    } else {
      console.log('⏳ No payout needed.')
    }

    await fetchRecentRounds()
  } catch (err) {
    console.error('❌ Error in runWatcher():', err)
  }
}

// Fetch latest rounds
async function fetchRecentRounds() {
  try {
    const totalRounds: bigint = await contract.read.totalRounds()
    const rounds: any[] = []

    const from = totalRounds > BigInt(MAX_ROUNDS) ? totalRounds - BigInt(MAX_ROUNDS) : 0n

    for (let i = totalRounds - 1n; i >= from; i--) {
      try {
        const [roundId, winner, reward, timestamp] = await contract.read.getRound([i])
        rounds.push({
          roundId: roundId.toString(),
          winner,
          reward: reward.toString(),
          timestamp: timestamp.toString(),
          pending: timestamp === 0n
        })
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

// Express API
const app = express()
app.use(cors())

app.get('/api/rounds', async (_req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch {
    res.status(200).json([])
  }
})

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`📡 Server ready at http://localhost:${PORT}`)
})

// Start
runWatcher()
fetchRecentRounds()
