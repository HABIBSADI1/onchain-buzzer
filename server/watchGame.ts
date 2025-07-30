import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import abi from './abi.json'
import { storeRound } from './utils/storeRound'

const client = createPublicClient({
  chain: base,
  transport: http(),
})

const CONTRACT_ADDRESS = '0xYourContractAddressHere'

async function checkGameState() {
  const [roundId, lastPlayer, pot, timeRemaining, clickCount] = await client.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getGameState',
  })

  if (Number(timeRemaining) === 0 && Number(clickCount) > 0) {
    console.log(`🕹 Round ${roundId} ended.`)
    await storeRound({
      roundId,
      winner: lastPlayer,
      reward: pot,
      timestamp: Math.floor(Date.now() / 1000),
    })
  }
}

export function startWatcher() {
  console.log('🚀 Game watcher started...')
  setInterval(checkGameState, 10_000)
}
