import { roomRegistry } from './RoomRegistry'

const LOBBY_TTL = 30 * 60 * 1000    // 30 min
const GAME_TTL = 2 * 60 * 60 * 1000 // 2 hours

export function startCleanup(io: { to: (room: string) => { emit: (event: string, data: unknown) => void } }): void {
  setInterval(() => {
    const now = Date.now()
    for (const room of roomRegistry.all()) {
      const ttl = room.phase === 'LOBBY' ? LOBBY_TTL : GAME_TTL
      if (now - room.lastActivity > ttl) {
        io.to(room.code).emit('room:expired', { reason: 'inactivity' })
        roomRegistry.delete(room.code)
      }
    }
  }, 5 * 60 * 1000)
}
