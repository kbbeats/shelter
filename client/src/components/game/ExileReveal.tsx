import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import { CARD_ICON_MAP } from '../../assets/card-icons'

export function ExileReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const lastExile = useGameStore(s => s.lastExile)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)

  if (!roomState || roomState.phase !== 'EXILE_REVEAL' || !lastExile) return null

  const exiledPlayer = roomState.players.find(p => p.id === lastExile.exiledPlayerId)
  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost
  const willEndGame = roomState.players.filter(p => p.isAlive).length <=
    (roomState.bunker?.capacity ?? 0)

  return (
    <div className="fullscreen-overlay exile-reveal">
      <div className="exile-reveal__title">{t('exile.title')}</div>
      <div className="exile-reveal__name">{exiledPlayer?.name}</div>
      <p className="dim mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: 16 }}>
        {t('exile.subtitle')}
      </p>

      <div className="exile-reveal__cards">
        {roomState.scenario?.cardCategories.map((cat, i) => {
          const card = lastExile.finalCards[cat.id]
          return (
            <div
              key={cat.id}
              className="exile-card"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <div className="exile-card__cat">{cat.name[lang]}</div>
              <div className="exile-card__icon">
                {CARD_ICON_MAP[cat.id] ? <img src={CARD_ICON_MAP[cat.id]} alt="" aria-hidden="true" className="card-cat-icon" /> : cat.icon}
              </div>
              <div className="exile-card__label">{card ? card.label[lang] : '?'}</div>
            </div>
          )
        })}
      </div>

      {isHost && (
        <div style={{ marginTop: 24 }}>
          <Button size="lg" onClick={nextPhase}>
            {willEndGame ? t('exile.to_bunker') : t('exile.continue')}
          </Button>
        </div>
      )}
    </div>
  )
}
