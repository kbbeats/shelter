import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

export function BunkerReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)

  if (!roomState || roomState.phase !== 'BUNKER_REVEAL' || !roomState.bunker) return null

  const { bunker } = roomState
  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost

  const stats: Array<[string, string]> = [
    [t('game.bunker.size'), bunker.size[lang]],
    [t('game.bunker.food'), bunker.foodSupply[lang]],
    [t('game.bunker.water'), bunker.waterSupply[lang]],
    [t('game.bunker.feature'), bunker.specialFeature[lang]],
  ]

  return (
    <div className="fullscreen-overlay bunker-reveal">
      <div className="bunker-card">
        <div className="bunker-card__header">
          <span className="bunker-card__title">{t('game.bunker.title')}</span>
          <div className="bunker-card__capacity">
            <span className="bunker-card__capacity-num">{bunker.capacity}</span>
            {t('game.bunker.capacity')}
          </div>
        </div>
        {stats.map(([label, value]) => (
          <div key={label} className="bunker-stat">
            <span className="bunker-stat__label">{label}</span>
            <span className="bunker-stat__value">{value}</span>
          </div>
        ))}
      </div>

      {isHost ? (
        <Button size="lg" onClick={nextPhase}>{t('game.bunker.continue')}</Button>
      ) : (
        <p className="dim mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          {t('game.catastrophe.waiting')}
        </p>
      )}
    </div>
  )
}
