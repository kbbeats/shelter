export interface BilingualText {
  en: string
  ru: string
}

export type SpecialAbilityEffectType =
  | 'reveal_card'
  | 'immunity'
  | 'inspect'
  | 'silence'
  | 'double_vote'

export interface SpecialAbilityCard {
  id: string
  name: BilingualText
  description: BilingualText
  effectType: SpecialAbilityEffectType
  targetType: 'self' | 'other' | 'none'
}

export interface AbilityAnnouncement {
  playerName: string
  abilityName: BilingualText
  targetName: string | null
  timestamp: number
}

export type GamePhase =
  | 'LOBBY'
  | 'CATASTROPHE_REVEAL'
  | 'BUNKER_REVEAL'
  | 'DEALING'
  | 'ROUND_ARGUMENT'
  | 'ROUND_VOTING'
  | 'EXILE_REVEAL'
  | 'BUNKER_EVENT'
  | 'ABILITY_INTERRUPT'
  | 'GAME_ENDED'

export interface AbilityInterrupt {
  usedBySocketId: string
  usedByName: string
  abilityName: BilingualText
  abilityIcon: string
  effectType: SpecialAbilityEffectType
  targetSocketId: string | null
  targetName: string | null
  revealedCard: { categoryId: string; card: Card } | null
  previousPhase: GamePhase
  expiresAt: number
}

export interface CardCategory {
  id: string
  name: BilingualText
  icon: string
}

export interface Card {
  id: string
  categoryId: string
  label: BilingualText
  description: BilingualText
  effectType?: SpecialAbilityEffectType
  targetType?: 'self' | 'other' | 'none'
}

export type PlayerCards = Record<string, Card>

export interface MaskedCard {
  categoryId: string
  isRevealed: boolean
  card: Card | null
}

export interface ScenarioTheme {
  primaryColor: string
  accentColor: string
  bgColor: string
  surfaceColor: string
  textColor: string
  glowColor: string
  icon: string
  backgroundFx: string
}

export interface ScenarioPublic {
  id: string
  title: BilingualText
  catastropheDescription: BilingualText
  story: BilingualText
  bunkerEvent: BilingualText
  theme: ScenarioTheme
  cardCategories: CardCategory[]
  isPremium: boolean
  minPlayers: number
  maxPlayers: number
}

export interface BunkerConfig {
  capacity: number
  size: BilingualText
  foodSupply: BilingualText
  waterSupply: BilingualText
  specialFeature: BilingualText
}

export interface PublicPlayer {
  id: string
  name: string
  isHost: boolean
  isAlive: boolean
  isConnected: boolean
  revealedCategoryIds: string[]
  hasRevealedThisRound: boolean
  maskedCards: Record<string, MaskedCard>
  specialAbilityCount: number
}

export interface VoteSummary {
  votes: Record<string, number>
  totalVotes: number
  totalVoters: number
}

export type ScenarioMode = 'host' | 'vote' | 'random'

export interface RoomState {
  code: string
  phase: GamePhase
  players: PublicPlayer[]
  scenario: ScenarioPublic | null
  bunker: BunkerConfig | null
  currentRound: number
  currentArgumentIndex: number
  argumentOrder: string[]
  currentArgumentPlayerId: string | null
  voteStatus: VoteSummary | null
  survivors: string[]
  selectedScenarioId: string | null
  lastAbilityAnnouncement: AbilityAnnouncement | null
  activeInterrupt: AbilityInterrupt | null
  scenarioMode: ScenarioMode
  scenarioVotes: Record<string, string[]>
}
