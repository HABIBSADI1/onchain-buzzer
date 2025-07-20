import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import abi from '../abi.json'
import fs from 'fs/promises'

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const RPC_URL = process.env.VITE_RPC_URL!

const BLOCK_STEP = 500n
const MAX_ROUNDS = 25

export async function fetchRecentRounds() {
  const client = createPublicClient({
    chain: base,
    transport: http(RPC_URL),
  })

  const latestBlock = await client.getBlockNumber()
  let rounds: any[] = []

  for (
    let fromBlock = 0n;
    fromBlock <= latestBlock && rounds.length < MAX_ROUNDS;
    fromBlock += BLOCK_STEP
  ) {
    const toBlock = fromBlock + BLOCK_STEP < latestBlock ? fromBlock + BLOCK_STEP : latestBlock

    const logs = await client.getLogs({
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
  console.log(`✅ Cached ${rounds.length} rounds`)
}
