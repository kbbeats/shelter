import type { Server, Socket } from 'socket.io'
import { EVENTS } from '@shelter/shared'
import { roomRegistry } from '../../rooms/RoomRegistry'
import { getScenarioPublicList } from '../../data/scenarios/index'

export function registerRoomHandlers(io: Server, socket: Socket): void {
  socket.on(EVENTS.ROOM_CREATE, ({ playerName }: { playerName: string }) => {
    if (!playerName?.trim()) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Name is required' })
      return
    }

    const room = roomRegistry.create(socket.id, playerName.trim())
    socket.join(room.code)
    socket.emit(EVENTS.ROOM_STATE, room.getPublicState(socket.id))
  })

  socket.on(EVENTS.ROOM_JOIN, ({ code, playerName }: { code: string; playerName: string }) => {
    if (!playerName?.trim() || !code?.trim()) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Name and room code are required' })
      return
    }

    const room = roomRegistry.get(code.trim())
    if (!room) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Room not found' })
      return
    }

    if (room.phase !== 'LOBBY') {
      // Check if this is a reconnect
      const existingPlayer = room.getPlayerByName(playerName.trim())
      if (existingPlayer) {
        const player = room.reconnectPlayer(socket.id, existingPlayer.id)
        if (player) {
          socket.join(room.code)
          socket.emit(EVENTS.ROOM_STATE, room.getPublicState(socket.id))
          // Re-send private cards if game is in progress
          if (player.cards && Object.keys(player.cards).length > 0) {
            socket.emit(EVENTS.GAME_DEALT_CARDS, { cards: player.cards })
          }
          io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
          return
        }
      }
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Game already in progress' })
      return
    }

    if (room.players.size >= 16) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Room is full (max 16 players)' })
      return
    }

    room.addPlayer(socket.id, playerName.trim())
    socket.join(room.code)
    socket.emit(EVENTS.ROOM_STATE, room.getPublicState(socket.id))
    socket.to(room.code).emit(EVENTS.ROOM_PLAYER_JOINED, {
      player: room.getPublicState(socket.id).players.find(p => p.id === socket.id),
    })
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on(EVENTS.ROOM_LEAVE, () => {
    handleDisconnect(io, socket)
  })

  socket.on(EVENTS.GET_SCENARIOS, () => {
    socket.emit(EVENTS.SCENARIOS_LIST, getScenarioPublicList())
  })

  socket.on(EVENTS.HOST_SELECT_SCENARIO, ({ scenarioId }: { scenarioId: string }) => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return
    if (room.phase !== 'LOBBY') return

    const success = room.selectScenario(scenarioId)
    if (!success) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Unknown scenario' })
      return
    }
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on('disconnect', () => {
    handleDisconnect(io, socket)
  })
}

function handleDisconnect(io: Server, socket: Socket): void {
  const room = findRoomBySocket(socket.id)
  if (!room) return

  if (room.phase === 'LOBBY') {
    room.removePlayer(socket.id)
    if (room.players.size === 0) {
      roomRegistry.delete(room.code)
      return
    }
    io.to(room.code).emit(EVENTS.ROOM_PLAYER_LEFT, { playerId: socket.id })
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  } else {
    room.disconnectPlayer(socket.id)
    io.to(room.code).emit(EVENTS.ROOM_PLAYER_LEFT, { playerId: socket.id })
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  }
}

function findRoomBySocket(socketId: string) {
  return roomRegistry.all().find(r => r.players.has(socketId)) ?? null
}
