import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

export function CatastropheReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)

  if (!roomState || roomState.phase !== 'CATASTROPHE_REVEAL' || !roomState.scenario) return null

  const { scenario } = roomState
  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      <div className="catastrophe-reveal__eyebrow">{t('game.catastrophe.title')}</div>
      <div className="catastrophe-reveal__icon">{scenario.theme.icon}</div>
      <h1 className="catastrophe-reveal__title">{scenario.title[lang]}</h1>
      <p className="catastrophe-reveal__desc">{scenario.catastropheDescription[lang]}</p>
      <div className="catastrophe-reveal__actions">
        {isHost ? (
          <Button size="lg" onClick={nextPhase}>{t('game.catastrophe.continue')}</Button>
        ) : (
          <p className="dim mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            {t('game.catastrophe.waiting')}
          </p>
        )}
      </div>
    </div>
  )
}
