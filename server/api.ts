import express from 'express'
import fs from 'fs/promises'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.get('/api/rounds', async (req, res) => {
  try {
    const data = await fs.readFile('server/data.json', 'utf8')
    res.json(JSON.parse(data))
  } catch (e) {
    res.status(500).json({ error: 'Could not read round cache' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})
