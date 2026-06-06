import type { Server, Socket } from 'socket.io'
import { EVENTS } from '@shelter/shared'
import { roomRegistry } from '../../rooms/RoomRegistry'

function findRoomBySocket(socketId: string) {
  return roomRegistry.all().find(r => r.players.has(socketId)) ?? null
}

export function registerVoteHandlers(io: Server, socket: Socket): void {
  socket.on(EVENTS.VOTE_CAST, ({ targetPlayerId }: { targetPlayerId: string }) => {
    const room = findRoomBySocket(socket.id)
    if (!room) return
    if (room.phase !== 'ROUND_VOTING') return
    if (socket.id === targetPlayerId) return

    const summary = room.castVote(socket.id, targetPlayerId)
    if (!summary) return

    io.to(room.code).emit(EVENTS.VOTE_UPDATED, summary)

    if (room.isVoteComplete()) {
      resolveVote(io, room)
    }
  })
}

function resolveVote(
  io: Server,
  room: ReturnType<typeof roomRegistry.all>[number]
): void {
  const result = room.resolveVote()
  if (!result) return

  io.to(room.code).emit(EVENTS.VOTE_RESULT, {
    exiledPlayerId: result.exiledPlayerId,
    finalCards: result.finalCards,
  })
  io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, { phase: 'EXILE_REVEAL' })
  io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
}
