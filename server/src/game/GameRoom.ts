import type {
  GamePhase,
  PlayerCards,
  PublicPlayer,
  MaskedCard,
  RoomState,
  ScenarioPublic,
  BunkerConfig,
  VoteSummary,
  Card,
  SpecialAbilityCard,
  AbilityAnnouncement,
  AbilityInterrupt,
} from '@shelter/shared'
import { CardDealer } from './CardDealer'
import { VoteManager } from './VoteManager'
import { generateBunker } from './bunkerGenerator'
import { scenarioMap } from '../data/scenarios/index'
import { dealAbilities } from '../data/abilities'

interface Player {
  id: string
  name: string
  isHost: boolean
  isAlive: boolean
  isConnected: boolean
  revealedCategoryIds: string[]
  cards: PlayerCards
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export class GameRoom {
  code: string
  phase: GamePhase = 'LOBBY'
  players = new Map<string, Player>()
  scenario: ScenarioPublic | null = null
  selectedScenarioId: string | null = null
  bunker: BunkerConfig | null = null
  currentRound = 0
  argumentOrder: string[] = []
  currentArgumentIndex = 0
  voteManager: VoteManager | null = null
  survivors: string[] = []
  lastActivity = Date.now()

  playerAbilities = new Map<string, SpecialAbilityCard[]>()
  immunePlayers = new Set<string>()
  silencedPlayers = new Set<string>()
  doubleVoters = new Set<string>()
  lastAbilityAnnouncement: AbilityAnnouncement | null = null
  activeInterrupt: AbilityInterrupt | null = null

  constructor(code: string, hostId: string, hostName: string) {
    this.code = code
    this.players.set(hostId, {
      id: hostId,
      name: hostName,
      isHost: true,
      isAlive: true,
      isConnected: true,
      revealedCategoryIds: [],
      cards: {},
    })
  }

  addPlayer(socketId: string, name: string): Player {
    this.touch()
    const player: Player = {
      id: socketId,
      name,
      isHost: false,
      isAlive: true,
      isConnected: true,
      revealedCategoryIds: [],
      cards: {},
    }
    this.players.set(socketId, player)
    return player
  }

  reconnectPlayer(socketId: string, oldSocketId: string): Player | null {
    const player = this.players.get(oldSocketId)
    if (!player) return null
    this.players.delete(oldSocketId)
    player.id = socketId
    player.isConnected = true
    this.players.set(socketId, player)
    if (this.argumentOrder.includes(oldSocketId)) {
      this.argumentOrder = this.argumentOrder.map(id => (id === oldSocketId ? socketId : id))
    }
    this.survivors = this.survivors.map(id => (id === oldSocketId ? socketId : id))
    const abilities = this.playerAbilities.get(oldSocketId)
    if (abilities) {
      this.playerAbilities.delete(oldSocketId)
      this.playerAbilities.set(socketId, abilities)
    }
    this.touch()
    return player
  }

  disconnectPlayer(socketId: string): void {
    const player = this.players.get(socketId)
    if (player) {
      player.isConnected = false
      this.touch()
    }
  }

  removePlayer(socketId: string): void {
    this.players.delete(socketId)
    if (this.phase === 'LOBBY') {
      const remaining = [...this.players.values()]
      if (remaining.length > 0 && !remaining.some(p => p.isHost)) {
        remaining[0].isHost = true
      }
    }
    this.touch()
  }

  selectScenario(scenarioId: string): boolean {
    if (!scenarioMap.has(scenarioId)) return false
    this.selectedScenarioId = scenarioId
    this.touch()
    return true
  }

  startGame(): { scenario: ScenarioPublic; bunker: BunkerConfig; dealtCards: Map<string, PlayerCards>; dealtAbilities: Map<string, SpecialAbilityCard[]> } {
    const scenarioId = this.selectedScenarioId || 'nuclear-war'
    const fullScenario = scenarioMap.get(scenarioId)!
    const { cardPool, ...publicScenario } = fullScenario
    void cardPool
    this.scenario = publicScenario

    const alivePlayers = this.getAlivePlayers()
    this.bunker = generateBunker(alivePlayers.length)
    this.phase = 'CATASTROPHE_REVEAL'

    const playerIds = alivePlayers.map(p => p.id)
    const dealtCards = CardDealer.deal(fullScenario, playerIds)
    for (const player of alivePlayers) {
      player.cards = dealtCards.get(player.id) || {}
    }

    const dealtAbilities = dealAbilities(playerIds)
    for (const [id, abilities] of dealtAbilities) {
      this.playerAbilities.set(id, abilities)
    }

    this.touch()
    return { scenario: this.scenario, bunker: this.bunker, dealtCards, dealtAbilities }
  }

  advanceToDealing(): void {
    this.phase = 'DEALING'
    this.touch()
  }

  startRound(): void {
    this.currentRound++
    const alive = this.getAlivePlayers().filter(p => !this.silencedPlayers.has(p.id))
    this.silencedPlayers.clear()
    this.argumentOrder = shuffle(alive.map(p => p.id))
    this.currentArgumentIndex = 0
    this.phase = 'ROUND_ARGUMENT'
    this.touch()
  }

  advanceArgument(): boolean {
    this.currentArgumentIndex++
    this.touch()
    return this.currentArgumentIndex >= this.argumentOrder.length
  }

  openVoting(): { summary: VoteSummary; eligibleVoterIds: string[] } {
    const aliveIds = this.getAlivePlayers().map(p => p.id)
    this.voteManager = new VoteManager(aliveIds, [...this.doubleVoters])
    this.doubleVoters.clear()
    this.phase = 'ROUND_VOTING'
    this.touch()
    return { summary: this.voteManager.getSummary(), eligibleVoterIds: aliveIds }
  }

  castVote(voterId: string, targetId: string): VoteSummary | null {
    if (!this.voteManager) return null
    const success = this.voteManager.castVote(voterId, targetId)
    if (!success) return null
    this.touch()
    return this.voteManager.getSummary()
  }

  resolveVote(): { exiledPlayerId: string; finalCards: PlayerCards } | null {
    if (!this.voteManager) return null
    const exiledId = this.voteManager.getExiledPlayerId(this.immunePlayers)
    this.immunePlayers.clear()
    if (!exiledId) return null
    const exiledPlayer = this.players.get(exiledId)
    if (!exiledPlayer) return null

    exiledPlayer.isAlive = false
    const finalCards = exiledPlayer.cards
    this.phase = 'EXILE_REVEAL'
    this.touch()
    return { exiledPlayerId: exiledId, finalCards }
  }

  checkWin(): boolean {
    const alive = this.getAlivePlayers()
    return this.bunker !== null && alive.length <= this.bunker.capacity
  }

  endGame(): void {
    this.survivors = this.getAlivePlayers().map(p => p.id)
    this.phase = 'GAME_ENDED'
    this.touch()
  }

  revealCard(socketId: string, categoryId: string): Card | null {
    const player = this.players.get(socketId)
    if (!player) return null
    if (player.revealedCategoryIds.includes(categoryId)) return null
    const card = player.cards[categoryId]
    if (!card) return null
    player.revealedCategoryIds.push(categoryId)
    this.touch()
    return card
  }

  private static readonly ABILITY_ICONS: Record<string, string> = {
    reveal_card: '👁',
    immunity: '🛡',
    inspect: '🔍',
    silence: '🤫',
    double_vote: '⚡',
  }

  useAbility(
    playerId: string,
    abilityId: string,
    targetPlayerId?: string,
  ): {
    success: boolean
    effect: string | null
    announcement: AbilityAnnouncement | null
    revealedCard?: { categoryId: string; card: Card }
    inspectedCards?: PlayerCards
    interrupt?: AbilityInterrupt
  } {
    if (this.phase !== 'ROUND_ARGUMENT') return { success: false, effect: null, announcement: null }

    const player = this.players.get(playerId)
    if (!player) return { success: false, effect: null, announcement: null }

    const abilities = this.playerAbilities.get(playerId) ?? []
    const abilityIndex = abilities.findIndex(a => a.id === abilityId)
    if (abilityIndex === -1) return { success: false, effect: null, announcement: null }

    const ability = abilities[abilityIndex]
    const remaining = [...abilities]
    remaining.splice(abilityIndex, 1)
    this.playerAbilities.set(playerId, remaining)

    const targetPlayer = targetPlayerId ? this.players.get(targetPlayerId) : null
    const targetName = targetPlayer?.name ?? null

    const announcement: AbilityAnnouncement = {
      playerName: player.name,
      abilityName: ability.name,
      targetName,
      timestamp: Date.now(),
    }
    this.lastAbilityAnnouncement = announcement

    let revealedCard: { categoryId: string; card: Card } | undefined
    let inspectedCards: PlayerCards | undefined

    switch (ability.effectType) {
      case 'reveal_card': {
        if (targetPlayer && this.scenario) {
          const hidden = this.scenario.cardCategories.filter(
            c => !targetPlayer.revealedCategoryIds.includes(c.id),
          )
          if (hidden.length > 0) {
            const cat = hidden[Math.floor(Math.random() * hidden.length)]
            const card = targetPlayer.cards[cat.id]
            if (card) {
              targetPlayer.revealedCategoryIds.push(cat.id)
              revealedCard = { categoryId: cat.id, card }
            }
          }
        }
        break
      }
      case 'immunity':
        this.immunePlayers.add(playerId)
        break
      case 'inspect':
        if (targetPlayer) inspectedCards = { ...targetPlayer.cards }
        break
      case 'silence':
        if (targetPlayerId) this.silencedPlayers.add(targetPlayerId)
        break
      case 'double_vote':
        this.doubleVoters.add(playerId)
        break
    }

    const interrupt: AbilityInterrupt = {
      usedBySocketId: playerId,
      usedByName: player.name,
      abilityName: ability.name,
      abilityIcon: GameRoom.ABILITY_ICONS[ability.effectType] ?? '✨',
      effectType: ability.effectType,
      targetSocketId: targetPlayerId ?? null,
      targetName,
      revealedCard: revealedCard ?? null,
      previousPhase: this.phase,
      expiresAt: Date.now() + 4000,
    }

    this.activeInterrupt = interrupt
    this.phase = 'ABILITY_INTERRUPT'
    this.touch()

    return { success: true, effect: ability.effectType, announcement, revealedCard, inspectedCards, interrupt }
  }

  resolveInterrupt(): void {
    if (this.phase !== 'ABILITY_INTERRUPT' || !this.activeInterrupt) return
    this.phase = this.activeInterrupt.previousPhase
    this.activeInterrupt = null
    this.touch()
  }

  getPublicState(viewerSocketId?: string): RoomState {
    const players = [...this.players.values()].map(p => this.toPublicPlayer(p, viewerSocketId))
    return {
      code: this.code,
      phase: this.phase,
      players,
      scenario: this.scenario,
      bunker: this.bunker,
      currentRound: this.currentRound,
      currentArgumentIndex: this.currentArgumentIndex,
      argumentOrder: this.argumentOrder,
      currentArgumentPlayerId: this.argumentOrder[this.currentArgumentIndex] ?? null,
      voteStatus: this.voteManager?.getSummary() ?? null,
      survivors: this.survivors,
      selectedScenarioId: this.selectedScenarioId,
      lastAbilityAnnouncement: this.lastAbilityAnnouncement,
      activeInterrupt: this.activeInterrupt,
    }
  }

  private toPublicPlayer(player: Player, viewerSocketId?: string): PublicPlayer {
    const isViewer = player.id === viewerSocketId
    const maskedCards: Record<string, MaskedCard> = {}

    if (this.scenario) {
      for (const cat of this.scenario.cardCategories) {
        const isRevealed = player.revealedCategoryIds.includes(cat.id)
        maskedCards[cat.id] = {
          categoryId: cat.id,
          isRevealed,
          card: isRevealed || isViewer ? (player.cards[cat.id] ?? null) : null,
        }
      }
    }

    return {
      id: player.id,
      name: player.name,
      isHost: player.isHost,
      isAlive: player.isAlive,
      isConnected: player.isConnected,
      revealedCategoryIds: player.revealedCategoryIds,
      maskedCards,
      specialAbilityCount: (this.playerAbilities.get(player.id) ?? []).length,
    }
  }

  isHost(socketId: string): boolean {
    return this.players.get(socketId)?.isHost === true
  }

  getPlayerByName(name: string): Player | undefined {
    return [...this.players.values()].find(p => p.name === name)
  }

  getAlivePlayers(): Player[] {
    return [...this.players.values()].filter(p => p.isAlive)
  }

  getCurrentArgumentPlayerId(): string | null {
    return this.argumentOrder[this.currentArgumentIndex] ?? null
  }

  isVoteComplete(): boolean {
    return this.voteManager?.isComplete() ?? false
  }

  private touch(): void {
    this.lastActivity = Date.now()
  }
}
