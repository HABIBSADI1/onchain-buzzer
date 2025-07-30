import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_PATH = path.join(__dirname, 'data.json')

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
