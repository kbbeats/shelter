import type {
  GamePhase,
  ScenarioMode,
  PlayerCards,
  PublicPlayer,
  MaskedCard,
  RoomState,
  ScenarioPublic,
  BunkerConfig,
  VoteSummary,
  Card,
  SpecialAbilityEffectType,
  AbilityAnnouncement,
  AbilityInterrupt,
} from '@shelter/shared'
import { CardDealer } from './CardDealer'
import { VoteManager } from './VoteManager'
import { generateBunker } from './bunkerGenerator'
import { scenarioMap } from '../data/scenarios/index'

interface Player {
  id: string
  name: string
  isHost: boolean
  isAlive: boolean
  isConnected: boolean
  revealedCategoryIds: string[]
  cards: PlayerCards
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
  exiledCount = 0
  bunkerEventShown = false
  lastActivity = Date.now()

  abilityUsed = new Set<string>()
  immunePlayers = new Set<string>()
  silencedPlayers = new Set<string>()
  doubleVoters = new Set<string>()
  lastAbilityAnnouncement: AbilityAnnouncement | null = null
  activeInterrupt: AbilityInterrupt | null = null
  scenarioMode: ScenarioMode = 'host'
  scenarioVotes: Map<string, Set<string>> = new Map()

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
    if (this.abilityUsed.has(oldSocketId)) {
      this.abilityUsed.delete(oldSocketId)
      this.abilityUsed.add(socketId)
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

  setScenarioMode(mode: ScenarioMode): void {
    this.scenarioMode = mode
    this.scenarioVotes.clear()
    this.selectedScenarioId = null
    if (mode === 'random') {
      const ids = [...scenarioMap.keys()]
      this.selectedScenarioId = ids[Math.floor(Math.random() * ids.length)]
    }
    this.touch()
  }

  castScenarioVote(socketId: string, scenarioId: string): boolean {
    if (this.scenarioMode !== 'vote') return false
    const player = this.players.get(socketId)
    if (!player || !player.isAlive) return false
    if (!scenarioMap.has(scenarioId)) return false

    // Remove player's previous vote from any scenario
    for (const voters of this.scenarioVotes.values()) {
      voters.delete(player.name)
    }

    // Record new vote
    if (!this.scenarioVotes.has(scenarioId)) {
      this.scenarioVotes.set(scenarioId, new Set())
    }
    this.scenarioVotes.get(scenarioId)!.add(player.name)

    // Auto-select when all alive players have voted
    const totalVotes = [...this.scenarioVotes.values()].reduce((sum, s) => sum + s.size, 0)
    if (totalVotes >= this.getAlivePlayers().length) {
      let maxVotes = 0
      let winners: string[] = []
      for (const [id, voters] of this.scenarioVotes) {
        if (voters.size > maxVotes) { maxVotes = voters.size; winners = [id] }
        else if (voters.size === maxVotes) winners.push(id)
      }
      this.selectedScenarioId = winners[Math.floor(Math.random() * winners.length)]
    }

    this.touch()
    return true
  }

  startGame(): { scenario: ScenarioPublic; bunker: BunkerConfig; dealtCards: Map<string, PlayerCards> } {
    const scenarioId = this.selectedScenarioId || 'nuclear-war'
    const fullScenario = scenarioMap.get(scenarioId)!
    const { cardPool, ...publicScenario } = fullScenario
    this.scenario = publicScenario
    this.abilityUsed = new Set()

    const alivePlayers = this.getAlivePlayers()
    this.bunker = generateBunker(alivePlayers.length)
    this.phase = 'CATASTROPHE_REVEAL'

    const playerIds = alivePlayers.map(p => p.id)
    const dealtCards = CardDealer.deal(fullScenario, playerIds)

    // Patch special_action cards with effectType/targetType from scenario pool
    const specialPool = cardPool['special_action'] ?? []
    for (const cards of dealtCards.values()) {
      const specialCard = cards['special_action']
      if (specialCard && specialPool.length > 0) {
        const template = specialPool.find(t => t.label.en === specialCard.label.en)
        if (template?.effectType) {
          specialCard.effectType = template.effectType
          specialCard.targetType = template.targetType ?? 'none'
        }
      }
    }

    for (const player of alivePlayers) {
      player.cards = dealtCards.get(player.id) || {}
    }

    this.touch()
    return { scenario: this.scenario, bunker: this.bunker, dealtCards }
  }

  advanceToDealing(): void {
    this.phase = 'DEALING'
    this.touch()
  }

  startRound(): void {
    this.currentRound++
    const alive = this.getAlivePlayers().filter(p => !this.silencedPlayers.has(p.id))
    this.silencedPlayers.clear()

    const allIds = [...this.players.keys()]
    const hostId = [...this.players.values()].find(p => p.isHost)?.id
    const hostIndex = hostId ? Math.max(allIds.indexOf(hostId), 0) : 0
    const hostFirstOrder = [...allIds.slice(hostIndex), ...allIds.slice(0, hostIndex)]
    const aliveIds = new Set(alive.map(p => p.id))
    this.argumentOrder = hostFirstOrder.filter(id => aliveIds.has(id))

    this.currentArgumentIndex = 0
    this.phase = 'ROUND_ARGUMENT'
    this.maybeAutoRevealOccupation()
    this.touch()
  }

  advanceArgument(): boolean {
    this.currentArgumentIndex++
    this.touch()
    return this.currentArgumentIndex >= this.argumentOrder.length
  }

  maybeAutoRevealOccupation(): void {
    if (this.currentRound !== 1) return
    const playerId = this.getCurrentArgumentPlayerId()
    if (!playerId) return
    this.revealCard(playerId, 'occupation')
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
    this.exiledCount++
    this.phase = 'EXILE_REVEAL'
    this.touch()
    return { exiledPlayerId: exiledId, finalCards }
  }

  shouldTriggerBunkerEvent(): boolean {
    return this.exiledCount === 2 && !this.bunkerEventShown
  }

  triggerBunkerEvent(): void {
    this.bunkerEventShown = true
    this.phase = 'BUNKER_EVENT'
    this.touch()
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

  resetGame(): void {
    this.phase = 'LOBBY'
    this.scenario = null
    this.selectedScenarioId = null
    this.bunker = null
    this.currentRound = 0
    this.argumentOrder = []
    this.currentArgumentIndex = 0
    this.voteManager = null
    this.survivors = []
    this.exiledCount = 0
    this.bunkerEventShown = false
    this.scenarioVotes = new Map()
    this.abilityUsed = new Set()
    this.immunePlayers = new Set()
    this.silencedPlayers = new Set()
    this.doubleVoters = new Set()
    this.lastAbilityAnnouncement = null
    this.activeInterrupt = null
    for (const player of this.players.values()) {
      player.isAlive = true
      player.revealedCategoryIds = []
      player.cards = {}
    }
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
    targetPlayerId?: string,
  ): {
    success: boolean
    effect: SpecialAbilityEffectType | null
    announcement: AbilityAnnouncement | null
    revealedCard?: { categoryId: string; card: Card }
    inspectedCards?: PlayerCards
    interrupt?: AbilityInterrupt
  } {
    const player = this.players.get(playerId)
    if (!player) return { success: false, effect: null, announcement: null }

    if (this.abilityUsed.has(playerId)) return { success: false, effect: null, announcement: null }

    const specialCard = player.cards['special_action']
    if (!specialCard) return { success: false, effect: null, announcement: null }

    const effectType = specialCard.effectType
    if (!effectType) return { success: false, effect: null, announcement: null }

    this.abilityUsed.add(playerId)
    this.revealCard(playerId, 'special_action')

    const targetPlayer = targetPlayerId ? this.players.get(targetPlayerId) : null
    const targetName = targetPlayer?.name ?? null

    const announcement: AbilityAnnouncement = {
      playerName: player.name,
      abilityName: specialCard.label,
      targetName,
      timestamp: Date.now(),
    }
    this.lastAbilityAnnouncement = announcement

    let revealedCard: { categoryId: string; card: Card } | undefined
    let inspectedCards: PlayerCards | undefined

    switch (effectType) {
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
      abilityName: specialCard.label,
      abilityIcon: GameRoom.ABILITY_ICONS[effectType] ?? '✨',
      effectType,
      targetSocketId: targetPlayerId ?? null,
      targetName,
      revealedCard: revealedCard ?? null,
      previousPhase: this.phase,
      expiresAt: Date.now() + 4000,
    }

    this.activeInterrupt = interrupt
    this.phase = 'ABILITY_INTERRUPT'
    this.touch()

    return { success: true, effect: effectType, announcement, revealedCard, inspectedCards, interrupt }
  }

  resolveInterrupt(): void {
    if (this.phase !== 'ABILITY_INTERRUPT' || !this.activeInterrupt) return
    this.phase = this.activeInterrupt.previousPhase
    this.activeInterrupt = null
    this.touch()
  }

  getPublicState(viewerSocketId?: string): RoomState {
    const players = [...this.players.values()].map(p => this.toPublicPlayer(p, viewerSocketId))
    const scenarioVotes: Record<string, string[]> = {}
    for (const [id, voters] of this.scenarioVotes) {
      scenarioVotes[id] = [...voters]
    }
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
      scenarioMode: this.scenarioMode,
      scenarioVotes,
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
      specialAbilityCount: player.cards['special_action'] && !this.abilityUsed.has(player.id) ? 1 : 0,
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
