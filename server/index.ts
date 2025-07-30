import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// مسیر فایل دیتا
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_PATH = path.join(__dirname, 'data.json')

// ایجاد اپ
const app = express()

// فعال‌سازی CORS برای دامنه اصلی
app.use(cors({
  origin: ['https://finalclick.xyz'], // یا مثلاً ['*'] برای باز بودن به همه
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  credentials: false, // اگر از کوکی استفاده نمی‌کنی
}))

// مسیر API
app.get('/api/rounds', async (_req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(data)
  } catch (err) {
    console.error('❌ Failed to read data.json:', err)
    res.status(500).json({ error: 'Failed to fetch rounds.' })
  }
})

// راه‌اندازی سرور
const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`📡 API Server running at http://localhost:${PORT}`)
})
