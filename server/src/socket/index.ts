import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from './handlers/roomHandlers'
import { registerGameHandlers } from './handlers/gameHandlers'
import { registerVoteHandlers } from './handlers/voteHandlers'
import { ALLOWED_ORIGINS } from '../config/corsOrigins'

export function initSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: ALLOWED_ORIGINS,
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
