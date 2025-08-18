import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { createPublicClient, createWalletClient, getContract, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
// ✅ ENV Variables
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.VITE_RPC_URL;
if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL) {
    console.error('❌ لطفاً متغیرهای محیطی VITE_CONTRACT_ADDRESS، PRIVATE_KEY و VITE_RPC_URL را تنظیم کنید.');
    process.exit(1);
}
const MAX_ROUNDS = 25;
// ✅ ABI قرارداد
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
];
// ✅ Clients
const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({
    chain: base,
    transport: http(RPC_URL)
});
const walletClient = createWalletClient({
    chain: base,
    transport: http(RPC_URL),
    account
});
const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi,
    client: {
        public: publicClient,
        wallet: walletClient
    }
});
// ✅ File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data.json');
// ✅ Watcher: run payout if needed
async function runPayoutWatcher() {
    console.log(`\n🚀 Job started at ${new Date().toISOString()}`);
    try {
        const [roundId, , , timeRemaining] = await contract.read.getGameState();
        const payoutDone = await contract.read.payoutDone();
        console.log(`🕐 Round #${roundId} → timeRemaining: ${timeRemaining}, payoutDone: ${payoutDone}`);
        if (timeRemaining === 0n && !payoutDone) {
            console.log('⏱ Round ended. Forcing payout...');
            const { request } = await contract.simulate.forcePayout();
            const txHash = await walletClient.writeContract(request);
            console.log(`✅ Payout tx sent → https://basescan.org/tx/${txHash}`);
        }
        else {
            console.log('⏳ No payout needed.');
        }
        await fetchRecentRounds();
        console.log(`✅ Job finished at ${new Date().toISOString()}`);
    }
    catch (err) {
        console.error('❌ Error in runPayoutWatcher():', err);
    }
}
// ✅ Get latest rounds
async function fetchRecentRounds() {
    try {
        const totalRounds = await contract.read.totalRounds();
        const rounds = [];
        const from = totalRounds > BigInt(MAX_ROUNDS) ? totalRounds - BigInt(MAX_ROUNDS) : 0n;
        for (let i = totalRounds - 1n; i >= from; i--) {
            try {
                const [roundId, winner, reward, timestamp] = await contract.read.getRound([i]);
                if (timestamp !== 0n) {
                    rounds.push({
                        roundId: roundId.toString(),
                        winner,
                        reward: reward.toString(),
                        timestamp: timestamp.toString()
                    });
                }
            }
            catch (err) {
                console.warn(`⚠️ Could not fetch round ${i}:`, err);
            }
        }
        await fs.writeFile(DATA_PATH, JSON.stringify(rounds, null, 2), 'utf-8');
        console.log(`📥 Cached ${rounds.length} rounds → ${DATA_PATH}`);
    }
    catch (e) {
        console.error('❌ Error in fetchRecentRounds():', e);
    }
}
// ✅ API Server
const app = express();
app.use(cors());
// ⚠️ مهم: این مسیر قبل از express.static بیاد
app.get('/api/rounds', async (_req, res) => {
    console.log('📥 GET /api/rounds called');
    try {
        const data = await fs.readFile(DATA_PATH, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }
    catch {
        console.warn('⚠️ data.json not found, sending empty array');
        res.status(200).json([]);
    }
});
// ✅ Serve frontend from dist
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});
// ✅ Start Server
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`📡 Server ready at http://${HOST}:${PORT}`);
});
// ✅ Start jobs
runPayoutWatcher();
fetchRecentRounds()
    .then(() => console.log('✅ Round data fetched manually.'))
    .catch(console.error);
