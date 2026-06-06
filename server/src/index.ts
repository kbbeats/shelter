import http from 'http'
import { app } from './app'
import { initSocketServer } from './socket/index'
import { startCleanup } from './rooms/cleanup'

const PORT = Number(process.env.PORT) || 3001
const server = http.createServer(app)
const io = initSocketServer(server)

startCleanup(io)

server.listen(PORT, () => {
  console.log(`Shelter server running on http://localhost:${PORT}`)
})
