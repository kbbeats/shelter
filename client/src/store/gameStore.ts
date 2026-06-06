import { create } from 'zustand'
import { EVENTS } from '@shelter/shared'
import type { RoomState, PlayerCards, ScenarioPublic, SpecialAbilityCard, AbilityAnnouncement } from '@shelter/shared'
import { getSocket } from '../socket/socket'

interface GameStore {
  connected: boolean
  roomState: RoomState | null
  myCards: PlayerCards | null
  myAbilities: SpecialAbilityCard[]
  mySocketId: string | null
  language: 'en' | 'ru'
  pendingReveal: string | null
  lastExile: { exiledPlayerId: string; finalCards: PlayerCards } | null
  scenarioList: ScenarioPublic[]
  error: string | null
  abilityAnnouncement: AbilityAnnouncement | null
  inspectedCards: Record<string, PlayerCards>

  connect: () => void
  createRoom: (playerName: string) => void
  joinRoom: (code: string, playerName: string) => void
  leaveRoom: () => void
  startGame: () => void
  nextPhase: () => void
  selectScenario: (scenarioId: string) => void
  revealCard: (categoryId: string) => void
  castVote: (targetPlayerId: string) => void
  argumentDone: () => void
  getScenarios: () => void
  setLanguage: (lang: 'en' | 'ru') => void
  setPendingReveal: (categoryId: string | null) => void
  clearError: () => void
  useAbility: (abilityId: string, targetPlayerId?: string) => void
  clearAbilityAnnouncement: () => void
  skipInterrupt: () => void
  setScenarioMode: (mode: 'host' | 'vote' | 'random') => void
  castScenarioVote: (scenarioId: string) => void
}

export const useGameStore = create<GameStore>((set, get) => {
  const socket = getSocket()

  socket.on('connect', () => {
    set({ connected: true, mySocketId: socket.id ?? null })
  })
  socket.on('disconnect', () => {
    set({ connected: false })
  })

  socket.on(EVENTS.ROOM_STATE, (state: RoomState) => {
    set({ roomState: state })
  })

  socket.on(EVENTS.ROOM_ERROR, ({ message }: { message: string }) => {
    set({ error: message })
  })

  socket.on(EVENTS.GAME_DEALT_CARDS, ({ cards, abilities }: { cards: PlayerCards; abilities?: SpecialAbilityCard[] }) => {
    set({ myCards: cards, myAbilities: abilities ?? [] })
  })

  socket.on(EVENTS.ROOM_EXPIRED, () => {
    set({ roomState: null, myCards: null, myAbilities: [] })
    window.location.href = '/'
  })

  socket.on(
    EVENTS.VOTE_RESULT,
    (data: { exiledPlayerId: string; finalCards: PlayerCards }) => {
      set({ lastExile: data })
    }
  )

  socket.on(EVENTS.SCENARIOS_LIST, (list: ScenarioPublic[]) => {
    set({ scenarioList: list })
  })

  socket.on(EVENTS.GAME_ENDED, (_data: { survivors: string[] }) => {
    // Navigation handled by Game.tsx watching roomState.phase === 'GAME_ENDED'
  })

  socket.on(EVENTS.ABILITY_USED, ({ announcement }: { announcement: AbilityAnnouncement }) => {
    set({ abilityAnnouncement: announcement })
    // Also remove used ability from local list if it was mine
    const mySocketId = get().mySocketId
    const myAbilities = get().myAbilities
    if (announcement.playerName && mySocketId) {
      const roomState = get().roomState
      const me = roomState?.players.find(p => p.id === mySocketId)
      if (me && me.name === announcement.playerName) {
        // The server's ROOM_STATE will reflect the updated count, but we also
        // optimistically remove from local array so UI updates immediately
        const updatedAbilities = myAbilities.filter((_, i) => i !== 0)
        void updatedAbilities // server ROOM_STATE is authoritative; local myAbilities updated via GAME_DEALT_CARDS
      }
    }
  })

  socket.on(
    EVENTS.ABILITY_INSPECT_RESULT,
    ({ targetPlayerId, cards }: { targetPlayerId: string; cards: PlayerCards }) => {
      set(s => ({
        inspectedCards: { ...s.inspectedCards, [targetPlayerId]: cards },
      }))
    }
  )

  return {
    connected: false,
    roomState: null,
    myCards: null,
    myAbilities: [],
    mySocketId: null,
    language: 'en',
    pendingReveal: null,
    lastExile: null,
    scenarioList: [],
    error: null,
    abilityAnnouncement: null,
    inspectedCards: {},

    connect: () => {
      if (!socket.connected) socket.connect()
    },

    createRoom: (playerName) => {
      socket.emit(EVENTS.ROOM_CREATE, { playerName })
    },

    joinRoom: (code, playerName) => {
      socket.emit(EVENTS.ROOM_JOIN, { code, playerName })
    },

    leaveRoom: () => {
      socket.emit(EVENTS.ROOM_LEAVE)
      set({ roomState: null, myCards: null, lastExile: null, myAbilities: [], inspectedCards: {} })
    },

    startGame: () => {
      socket.emit(EVENTS.HOST_START_GAME)
    },

    nextPhase: () => {
      socket.emit(EVENTS.HOST_NEXT_PHASE)
    },

    selectScenario: (scenarioId) => {
      socket.emit(EVENTS.HOST_SELECT_SCENARIO, { scenarioId })
    },

    revealCard: (categoryId) => {
      socket.emit(EVENTS.CARD_REVEAL, { categoryId })
      set({ pendingReveal: null })
    },

    castVote: (targetPlayerId) => {
      socket.emit(EVENTS.VOTE_CAST, { targetPlayerId })
    },

    argumentDone: () => {
      socket.emit(EVENTS.ARGUMENT_DONE)
    },

    getScenarios: () => {
      socket.emit(EVENTS.GET_SCENARIOS)
    },

    useAbility: (abilityId, targetPlayerId) => {
      socket.emit(EVENTS.ABILITY_USE, { abilityId, targetPlayerId })
      // Optimistically remove used ability from local list
      set(s => ({
        myAbilities: s.myAbilities.filter(a => {
          if (a.id === abilityId) {
            // Remove the first occurrence only
            abilityId = ''
            return false
          }
          return true
        }),
      }))
    },

    setScenarioMode: (mode) => { socket.emit(EVENTS.SET_SCENARIO_MODE, { mode }) },
    castScenarioVote: (scenarioId) => { socket.emit(EVENTS.SCENARIO_VOTE, { scenarioId }) },

    setLanguage: (lang) => set({ language: lang }),
    setPendingReveal: (categoryId) => set({ pendingReveal: categoryId }),
    clearError: () => set({ error: null }),
    clearAbilityAnnouncement: () => set({ abilityAnnouncement: null }),
    skipInterrupt: () => { socket.emit(EVENTS.ABILITY_INTERRUPT_SKIP) },
  }
})
