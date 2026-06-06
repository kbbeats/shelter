import express from 'express'
import cors from 'cors'
import { roomRegistry } from './rooms/RoomRegistry'
import { getScenarioPublicList } from './data/scenarios/index'

export const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rooms: roomRegistry.all().length })
})

app.get('/api/room/:code/exists', (req, res) => {
  const exists = roomRegistry.has(req.params.code)
  res.json({ exists })
})

app.get('/api/scenarios', (_req, res) => {
  res.json(getScenarioPublicList())
})
