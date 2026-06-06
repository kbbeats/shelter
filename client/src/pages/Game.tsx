import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { CatastropheReveal } from '../components/game/CatastropheReveal'
import { BunkerReveal } from '../components/game/BunkerReveal'
import { ArgumentPhase } from '../components/game/ArgumentPhase'
import { VotingPanel } from '../components/game/VotingPanel'
import { ExileReveal } from '../components/game/ExileReveal'
import { PlayerHand } from '../components/game/PlayerHand'
import { SurvivorBoard } from '../components/game/SurvivorBoard'
import { PlayerCard } from '../components/game/PlayerCard'
import { AbilityTray } from '../components/game/AbilityTray'
import { AbilityAnnouncement } from '../components/game/AbilityAnnouncement'
import { AbilityInterruptScreen } from '../components/game/AbilityInterruptScreen'
import { useT } from '../i18n'

export default function Game() {
  const t = useT()
  const navigate = useNavigate()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)

  useEffect(() => {
    if (!roomState) navigate('/')
    if (roomState?.phase === 'LOBBY') navigate(`/lobby/${roomState.code}`)
    if (roomState?.phase === 'GAME_ENDED') navigate(`/results/${roomState?.code}`)
  }, [roomState, navigate])

  if (!roomState || !roomState.scenario) {
    return (
      <div className="dealing-screen">
        <div className="spinner" />
        <div className="dealing-screen__title">{t('game.dealing.title')}</div>
      </div>
    )
  }

  const { phase, scenario, players, currentArgumentPlayerId } = roomState
  const otherPlayers = players.filter(p => p.id !== mySocketId)

  // Fullscreen overlays take priority
  if (phase === 'CATASTROPHE_REVEAL') return <CatastropheReveal />
  if (phase === 'BUNKER_REVEAL') return <BunkerReveal />
  if (phase === 'EXILE_REVEAL') return <ExileReveal />
  if (phase === 'ABILITY_INTERRUPT') return <AbilityInterruptScreen />
  if (phase === 'DEALING') {
    return (
      <div className="dealing-screen">
        <div className="spinner" />
        <div className="dealing-screen__title">{t('game.dealing.title')}</div>
      </div>
    )
  }

  return (
    <div className="game-layout">
      {/* Main area */}
      <div className="game-layout__main">
        {(phase === 'ROUND_ARGUMENT') && <ArgumentPhase />}
        {(phase === 'ROUND_VOTING') && <VotingPanel />}

        {/* Other players' cards */}
        <div className="player-cards-grid" style={{ marginTop: 16 }}>
          {otherPlayers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              categories={scenario.cardCategories}
              lang={lang}
              isHighlighted={player.id === currentArgumentPlayerId}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="game-layout__sidebar">
        <SurvivorBoard />
      </div>

      {/* My hand + abilities */}
      <div className="game-layout__hand">
        <PlayerHand />
        <AbilityTray />
      </div>

      <AbilityAnnouncement />
    </div>
  )
}
