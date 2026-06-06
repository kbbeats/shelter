import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from './handlers/roomHandlers'
import { registerGameHandlers } from './handlers/gameHandlers'
import { registerVoteHandlers } from './handlers/voteHandlers'

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  io.on('connection', socket => {
    registerRoomHandlers(io, socket)
    registerGameHandlers(io, socket)
    registerVoteHandlers(io, socket)
  })

  return io
}
