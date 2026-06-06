import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { Header } from '../components/layout/Header'
import { RoomCode } from '../components/lobby/RoomCode'
import { PlayerList } from '../components/lobby/PlayerList'
import { ScenarioPicker } from '../components/lobby/ScenarioPicker'
import { useT } from '../i18n'

export default function Lobby() {
  const t = useT()
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const error = useGameStore(s => s.error)
  const clearError = useGameStore(s => s.clearError)
  const { startGame } = useGameStore()

  useEffect(() => {
    if (!roomState) {
      navigate('/')
      return
    }
    if (roomState.phase === 'CATASTROPHE_REVEAL' || roomState.phase === 'BUNKER_REVEAL' || roomState.phase === 'DEALING' || roomState.phase === 'ROUND_ARGUMENT' || roomState.phase === 'ROUND_VOTING' || roomState.phase === 'EXILE_REVEAL') {
      navigate(`/game/${roomState.code}`)
    }
    if (roomState.phase === 'GAME_ENDED') {
      navigate(`/results/${roomState.code}`)
    }
  }, [roomState, navigate])

  if (!roomState || !code) return null

  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost
  const canStart = roomState.players.filter(p => p.isConnected).length >= 1

  return (
    <div className="page">
      <Header showBack />

      {error && (
        <div className="error-toast">
          {error}
          <button className="btn btn--ghost btn--sm" onClick={clearError}>✕</button>
        </div>
      )}

      <div className="lobby">
        <RoomCode code={roomState.code} />

        <PlayerList players={roomState.players} mySocketId={mySocketId} />

        <ScenarioPicker
          selectedId={roomState.selectedScenarioId}
          isHost={!!isHost}
        />

        {isHost ? (
          <div>
            {!canStart && (
              <p className="dim mono mb-2" style={{ fontSize: '0.8rem' }}>
                {t('lobby.need_more')}
              </p>
            )}
            <button
              className="btn btn--primary btn--full btn--lg"
              onClick={startGame}
              disabled={!canStart}
            >
              {t('lobby.start')}
            </button>
          </div>
        ) : (
          <p className="dim mono text-center" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            {t('lobby.waiting')}
          </p>
        )}
      </div>
    </div>
  )
}
