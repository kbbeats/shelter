import { create } from 'zustand'
import { EVENTS } from '@shelter/shared'
import type { RoomState, PlayerCards, ScenarioPublic, AbilityAnnouncement } from '@shelter/shared'
import { getSocket } from '../socket/socket'

// Remember the active room + own name so a silently-reconnecting socket (network blip,
// server hiccup — anything that drops the socket without reloading the page) can
// auto-rejoin. socket.io issues a NEW socket id on every reconnect; without an automatic
// re-join the server never remaps this player to the new id, so the client's mySocketId
// permanently stops matching its own player entry (own card vanishes from the hand and
// leaks into the opponent carousel).
const ROOM_CODE_KEY = 'shelter_room_code'
const PLAYER_NAME_KEY = 'shelter_player_name'

function rememberSession(name?: string, code?: string): void {
  try {
    if (name != null) sessionStorage.setItem(PLAYER_NAME_KEY, name)
    if (code != null) sessionStorage.setItem(ROOM_CODE_KEY, code)
  } catch { /* sessionStorage unavailable — auto-rejoin simply won't fire */ }
}

function forgetSession(): void {
  try {
    sessionStorage.removeItem(ROOM_CODE_KEY)
    sessionStorage.removeItem(PLAYER_NAME_KEY)
  } catch { /* ignore */ }
}

interface GameStore {
  connected: boolean
  roomState: RoomState | null
  myCards: PlayerCards | null
  mySocketId: string | null
  language: 'en' | 'ru'
  pendingReveal: string | null
  lastExile: { exiledPlayerId: string; finalCards: PlayerCards } | null
  scenarioList: ScenarioPublic[]
  error: string | null
  abilityAnnouncement: AbilityAnnouncement | null
  inspectedCards: Record<string, PlayerCards>
  storyClosed: boolean

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
  useAbility: (targetPlayerId?: string) => void
  clearAbilityAnnouncement: () => void
  skipInterrupt: () => void
  setScenarioMode: (mode: 'host' | 'vote' | 'random') => void
  castScenarioVote: (scenarioId: string) => void
  resetGame: () => void
  closeStory: () => void
}

export const useGameStore = create<GameStore>((set, get) => {
  const socket = getSocket()

  socket.on('connect', () => {
    const prev = get().mySocketId
    set({ connected: true, mySocketId: socket.id ?? null })
    // On a genuine reconnect (we already had a socket id) auto-rejoin the persisted room,
    // which routes into the server's reconnectPlayer path and remaps this player to the
    // new socket id. Without this, mySocketId would no longer match our own player entry.
    if (prev) {
      try {
        const code = sessionStorage.getItem(ROOM_CODE_KEY)
        const name = sessionStorage.getItem(PLAYER_NAME_KEY)
        if (code && name) socket.emit(EVENTS.ROOM_JOIN, { code, playerName: name })
      } catch { /* ignore */ }
    }
  })
  socket.on('disconnect', () => {
    set({ connected: false })
  })

  socket.on(EVENTS.ROOM_STATE, (state: RoomState) => {
    // Capture the room code as soon as the server assigns it (createRoom doesn't know it
    // up-front) so a later reconnect can auto-rejoin.
    if (state.code) rememberSession(undefined, state.code)
    set(state.phase === 'CATASTROPHE_REVEAL'
      ? { roomState: state, storyClosed: false }
      : { roomState: state })
  })

  socket.on(EVENTS.STORY_CLOSED, () => {
    set({ storyClosed: true })
  })

  socket.on(EVENTS.ROOM_ERROR, ({ message }: { message: string }) => {
    set({ error: message })
  })

  socket.on(EVENTS.GAME_DEALT_CARDS, ({ cards }: { cards: PlayerCards }) => {
    set({ myCards: cards })
  })

  socket.on(EVENTS.ROOM_EXPIRED, () => {
    forgetSession()
    set({ roomState: null, myCards: null })
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
    mySocketId: null,
    language: 'en',
    pendingReveal: null,
    lastExile: null,
    scenarioList: [],
    error: null,
    abilityAnnouncement: null,
    inspectedCards: {},
    storyClosed: false,

    connect: () => {
      if (!socket.connected) socket.connect()
    },

    createRoom: (playerName) => {
      rememberSession(playerName)
      socket.emit(EVENTS.ROOM_CREATE, { playerName })
    },

    joinRoom: (code, playerName) => {
      rememberSession(playerName, code)
      socket.emit(EVENTS.ROOM_JOIN, { code, playerName })
    },

    leaveRoom: () => {
      forgetSession()
      socket.emit(EVENTS.ROOM_LEAVE)
      set({ roomState: null, myCards: null, lastExile: null, inspectedCards: {} })
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

    useAbility: (targetPlayerId) => {
      socket.emit(EVENTS.ABILITY_USE, { targetPlayerId })
    },

    setScenarioMode: (mode) => { socket.emit(EVENTS.SET_SCENARIO_MODE, { mode }) },
    castScenarioVote: (scenarioId) => { socket.emit(EVENTS.SCENARIO_VOTE, { scenarioId }) },
    resetGame: () => { socket.emit(EVENTS.HOST_RESET_GAME) },
    closeStory: () => { socket.emit(EVENTS.HOST_CLOSE_STORY) },

    setLanguage: (lang) => set({ language: lang }),
    setPendingReveal: (categoryId) => set({ pendingReveal: categoryId }),
    clearError: () => set({ error: null }),
    clearAbilityAnnouncement: () => set({ abilityAnnouncement: null }),
    skipInterrupt: () => { socket.emit(EVENTS.ABILITY_INTERRUPT_SKIP) },
  }
})
