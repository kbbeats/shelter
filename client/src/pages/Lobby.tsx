import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { LanguageToggle } from '../components/layout/LanguageToggle'
import { RoomCode } from '../components/lobby/RoomCode'
import { PlayerList } from '../components/lobby/PlayerList'
import { ScenarioPicker } from '../components/lobby/ScenarioPicker'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useT } from '../i18n'

export default function Lobby() {
  const t = useT()
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const error = useGameStore(s => s.error)
  const clearError = useGameStore(s => s.clearError)
  const { startGame, leaveRoom } = useGameStore()
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)

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
  const myPlayerName = roomState.players.find(p => p.id === mySocketId)?.name ?? null
  const hostName = roomState.players.find(p => p.isHost)?.name ?? ''
  const hasEnoughPlayers = roomState.players.filter(p => p.isConnected).length >= 6
  const canStart = hasEnoughPlayers && !!roomState.selectedScenarioId

  return (
    <div className="lobby-page">
      {error && (
        <div className="error-toast">
          {error}
          <button className="btn btn--ghost btn--sm" onClick={clearError}>✕</button>
        </div>
      )}

      <header className="z-bar">
        <Link to="/" className="lb-logo">
          <svg className="lb-trefoil" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="var(--c-primary)" />
            <g fill="var(--c-bg)">
              <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" />
              <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(120 50 50)" />
              <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(240 50 50)" />
            </g>
            <circle cx="50" cy="50" r="10" fill="var(--c-bg)" />
          </svg>
          {t('app.title')}
        </Link>
        <div className="z-bar__right">
          <button className="z-btn z-btn--ghost" onClick={() => setConfirmLeaveOpen(true)}>{t('landing.back')}</button>
          <LanguageToggle />
        </div>
      </header>

      {confirmLeaveOpen && (
        <Modal
          title={t('lobby.leave.confirm')}
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => setConfirmLeaveOpen(false)}>{t('lobby.leave.stay')}</Button>
              <Button variant="danger" size="sm" onClick={() => { leaveRoom(); navigate('/') }}>{t('lobby.leave.yes')}</Button>
            </>
          }
        >
          {null}
        </Modal>
      )}

      <main className="lb-main">
        <RoomCode code={roomState.code} />

        <PlayerList players={roomState.players} mySocketId={mySocketId} />

        <ScenarioPicker
          selectedId={roomState.selectedScenarioId}
          isHost={!!isHost}
          scenarioMode={roomState.scenarioMode}
          scenarioVotes={roomState.scenarioVotes}
          hostName={hostName}
          myPlayerName={myPlayerName}
        />

        <div className="lb-action">
          {isHost ? (
            <>
              {!roomState.selectedScenarioId && (
                <p className="lb-hint">{t('lobby.select_to_start')}</p>
              )}
              {roomState.selectedScenarioId && !hasEnoughPlayers && (
                <p className="lb-hint">{t('lobby.need_more')}</p>
              )}
              <button
                className="z-btn z-btn--primary"
                onClick={startGame}
                disabled={!canStart}
              >
                {t('lobby.start')}
              </button>
            </>
          ) : (
            <p className="lb-hint">{t('lobby.waiting')}</p>
          )}
        </div>
      </main>
    </div>
  )
}
