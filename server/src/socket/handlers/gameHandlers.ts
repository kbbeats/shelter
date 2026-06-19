import type { Server, Socket } from 'socket.io'
import { EVENTS } from '@shelter/shared'
import { roomRegistry } from '../../rooms/RoomRegistry'
import type { GameRoom } from '../../game/GameRoom'

const interruptTimers = new Map<string, ReturnType<typeof setTimeout>>()

function findRoomBySocket(socketId: string) {
  return roomRegistry.all().find(r => r.players.has(socketId)) ?? null
}

function emitArgumentTurn(io: Server, room: GameRoom) {
  io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, {
    phase: 'ROUND_ARGUMENT',
    round: room.currentRound,
    currentArgumentPlayerId: room.getCurrentArgumentPlayerId(),
  })
  io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
}

function scheduleInterruptResolve(io: Server, roomCode: string) {
  const existing = interruptTimers.get(roomCode)
  if (existing) clearTimeout(existing)

  const timer = setTimeout(() => {
    interruptTimers.delete(roomCode)
    const room = roomRegistry.all().find(r => r.code === roomCode)
    if (!room) return
    room.resolveInterrupt()
    io.to(roomCode).emit(EVENTS.ROOM_STATE, room.getPublicState())
  }, 4000)

  interruptTimers.set(roomCode, timer)
}

export function registerGameHandlers(io: Server, socket: Socket): void {
  socket.on(EVENTS.HOST_START_GAME, () => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return
    if (room.phase !== 'LOBBY') return
    if (room.players.size < 6) {
      socket.emit(EVENTS.ROOM_ERROR, { message: 'Need at least 6 players to start' })
      return
    }

    const { scenario, bunker, dealtCards } = room.startGame()

    // Broadcast scenario and bunker to all
    io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, { phase: 'CATASTROPHE_REVEAL' })
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())

    // Send private cards to each player
    for (const [playerId, cards] of dealtCards.entries()) {
      const playerSocket = io.sockets.sockets.get(playerId)
      if (playerSocket) {
        playerSocket.emit(EVENTS.GAME_DEALT_CARDS, { cards })
      }
    }

    void scenario
    void bunker
  })

  socket.on(EVENTS.HOST_NEXT_PHASE, () => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return

    if (room.phase === 'CATASTROPHE_REVEAL') {
      room.phase = 'BUNKER_REVEAL'
      io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, { phase: 'BUNKER_REVEAL' })
      io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
    } else if (room.phase === 'BUNKER_REVEAL') {
      room.advanceToDealing()
      io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, { phase: 'DEALING' })
      io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())

      // Auto-start first round after brief delay
      setTimeout(() => {
        room.startRound()
        emitArgumentTurn(io, room)
      }, 2000)
    } else if (room.phase === 'EXILE_REVEAL') {
      if (room.checkWin()) {
        room.endGame()
        io.to(room.code).emit(EVENTS.GAME_ENDED, { survivors: room.survivors })
        io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
      } else if (room.shouldTriggerBunkerEvent()) {
        room.triggerBunkerEvent()
        io.to(room.code).emit(EVENTS.GAME_PHASE_CHANGED, { phase: 'BUNKER_EVENT' })
        io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
      } else {
        room.startRound()
        emitArgumentTurn(io, room)
      }
    } else if (room.phase === 'BUNKER_EVENT') {
      room.startRound()
      emitArgumentTurn(io, room)
    }
  })

  socket.on(EVENTS.CARD_REVEAL, ({ categoryId }: { categoryId: string }) => {
    const room = findRoomBySocket(socket.id)
    if (!room) return
    if (room.phase !== 'ROUND_ARGUMENT') return
    if (room.getCurrentArgumentPlayerId() !== socket.id) return
    if (room.currentRound === 1) return // round 1 is forced occupation reveal only

    const card = room.revealCard(socket.id, categoryId)
    if (!card) return

    io.to(room.code).emit(EVENTS.CARD_REVEALED, {
      playerId: socket.id,
      categoryId,
      card,
    })
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on(EVENTS.ARGUMENT_DONE, () => {
    const room = findRoomBySocket(socket.id)
    if (!room) return
    if (room.phase !== 'ROUND_ARGUMENT') return
    if (room.getCurrentArgumentPlayerId() !== socket.id) return

    const allDone = room.advanceArgument()

    if (allDone) {
      // If alive count already fits in bunker (e.g. solo test), skip voting and end
      if (room.checkWin()) {
        room.endGame()
        io.to(room.code).emit(EVENTS.GAME_ENDED, { survivors: room.survivors })
        io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
        return
      }

      if (room.currentRound === 1) {
        // Round 1 has no voting — go straight into round 2
        room.startRound()
        emitArgumentTurn(io, room)
        return
      }

      const { summary, eligibleVoterIds } = room.openVoting()
      io.to(room.code).emit(EVENTS.VOTE_OPENED, { eligibleVoterIds })
      io.to(room.code).emit(EVENTS.VOTE_UPDATED, summary)
      io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
    } else {
      if (room.currentRound === 1) room.maybeAutoRevealOccupation()
      emitArgumentTurn(io, room)
    }
  })

  socket.on(
    EVENTS.ABILITY_USE,
    ({ targetPlayerId }: { targetPlayerId?: string }) => {
      const room = findRoomBySocket(socket.id)
      if (!room) return

      const result = room.useAbility(socket.id, targetPlayerId)
      if (!result.success) return

      io.to(room.code).emit(EVENTS.ABILITY_USED, { announcement: result.announcement })

      if (result.effect === 'inspect' && result.inspectedCards) {
        socket.emit(EVENTS.ABILITY_INSPECT_RESULT, {
          targetPlayerId,
          cards: result.inspectedCards,
        })
      }

      if (result.effect === 'reveal_card' && result.revealedCard) {
        io.to(room.code).emit(EVENTS.CARD_REVEALED, {
          playerId: targetPlayerId,
          categoryId: result.revealedCard.categoryId,
          card: result.revealedCard.card,
        })
      }

      io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
      scheduleInterruptResolve(io, room.code)
    },
  )

  socket.on(EVENTS.SET_SCENARIO_MODE, ({ mode }: { mode: 'host' | 'vote' | 'random' }) => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return
    if (room.phase !== 'LOBBY') return
    room.setScenarioMode(mode)
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on(EVENTS.SCENARIO_VOTE, ({ scenarioId }: { scenarioId: string }) => {
    const room = findRoomBySocket(socket.id)
    if (!room || room.phase !== 'LOBBY') return
    const voted = room.castScenarioVote(socket.id, scenarioId)
    if (voted) {
      io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
    }
  })

  socket.on(EVENTS.HOST_RESET_GAME, () => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return
    if (room.phase !== 'GAME_ENDED') return
    room.resetGame()
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on(EVENTS.ABILITY_INTERRUPT_SKIP, () => {
    const room = findRoomBySocket(socket.id)
    if (!room) return
    if (room.phase !== 'ABILITY_INTERRUPT') return
    if (room.activeInterrupt?.usedBySocketId !== socket.id && !room.isHost(socket.id)) return

    const timer = interruptTimers.get(room.code)
    if (timer) {
      clearTimeout(timer)
      interruptTimers.delete(room.code)
    }

    room.resolveInterrupt()
    io.to(room.code).emit(EVENTS.ROOM_STATE, room.getPublicState())
  })

  socket.on(EVENTS.HOST_CLOSE_STORY, () => {
    const room = findRoomBySocket(socket.id)
    if (!room || !room.isHost(socket.id)) return
    io.to(room.code).emit(EVENTS.STORY_CLOSED)
  })
}
