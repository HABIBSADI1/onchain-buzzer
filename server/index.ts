import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// مسیر فایل
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_PATH = path.join(__dirname, 'data.json')

const app = express()

// حل مشکل CORS
app.use(cors({
  origin: '*', // یا دقیق‌تر: ['https://finalclick.xyz']
}))

// API endpoint
app.get('/api/rounds', async (_req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    console.error('❌ Error reading data.json:', err)
    res.status(500).json({ error: 'Failed to read rounds' })
  }
})

// پورت برای Railway
const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`📡 API Server running at http://localhost:${PORT}`)
})
