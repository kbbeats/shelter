import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

export function BunkerEventReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)

  if (!roomState || roomState.phase !== 'BUNKER_EVENT' || !roomState.scenario) return null

  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost

  return (
    <div className="fullscreen-overlay bunker-event">
      <div className="bunker-event__title">{t('bunkerEvent.title')}</div>
      <p className="dim mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: 16 }}>
        {t('bunkerEvent.subtitle')}
      </p>
      <p className="bunker-event__text">{roomState.scenario.bunkerEvent[lang]}</p>

      {isHost && (
        <div style={{ marginTop: 24 }}>
          <Button size="lg" onClick={nextPhase}>
            {t('bunkerEvent.continue')}
          </Button>
        </div>
      )}
    </div>
  )
}
