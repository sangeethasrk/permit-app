import cors from 'cors'
import express from 'express'
import { initDb } from './db.js'
import permitsRouter from './routes/permits.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/permits', permitsRouter)

async function startServer() {
  await initDb()
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server', error)
  process.exit(1)
})
