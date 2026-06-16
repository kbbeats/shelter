export const EVENTS = {
  // Client → Server
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  HOST_START_GAME: 'host:startGame',
  HOST_NEXT_PHASE: 'host:nextPhase',
  HOST_SELECT_SCENARIO: 'host:selectScenario',
  CARD_REVEAL: 'card:reveal',
  VOTE_CAST: 'vote:cast',
  ARGUMENT_DONE: 'argument:done',
  GET_SCENARIOS: 'scenarios:get',
  ABILITY_USE: 'ability:use',
  SET_SCENARIO_MODE: 'scenario:setMode',
  SCENARIO_VOTE: 'scenario:vote',
  HOST_RESET_GAME: 'host:reset_game',

  // Server → Client
  ROOM_STATE: 'room:state',
  ROOM_PLAYER_JOINED: 'room:playerJoined',
  ROOM_PLAYER_LEFT: 'room:playerLeft',
  ROOM_ERROR: 'room:error',
  ROOM_EXPIRED: 'room:expired',
  GAME_PHASE_CHANGED: 'game:phaseChanged',
  GAME_DEALT_CARDS: 'game:dealtCards',
  CARD_REVEALED: 'card:revealed',
  VOTE_OPENED: 'vote:opened',
  VOTE_UPDATED: 'vote:updated',
  VOTE_RESULT: 'vote:result',
  GAME_ENDED: 'game:ended',
  SCENARIOS_LIST: 'scenarios:list',
  ABILITY_USED: 'ability:used',
  ABILITY_INSPECT_RESULT: 'ability:inspectResult',
  ABILITY_INTERRUPT_SKIP: 'ability:interruptSkip',
} as const

export type EventKey = keyof typeof EVENTS
export type EventValue = (typeof EVENTS)[EventKey]
