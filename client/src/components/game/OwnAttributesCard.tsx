import { useGameStore } from '../../store/gameStore'
import { CARD_ICON_MAP } from '../../assets/card-icons'

export function OwnAttributesCard({ lang }: { lang: 'en' | 'ru' }) {
  const roomState = useGameStore(s => s.roomState)
  const myCards = useGameStore(s => s.myCards)
  const mySocketId = useGameStore(s => s.mySocketId)

  if (!roomState?.scenario || !myCards || !mySocketId) return null

  const me = roomState.players.find(p => p.id === mySocketId)
  if (!me) return null

  return (
    <div className="own-card">
      <div className="own-card__header">
        <span className="own-card__name">{me.name}</span>
        <span className="section-label" style={{ marginBottom: 0 }}>Your cards</span>
      </div>
      <div className="own-card__attrs">
        {roomState.scenario.cardCategories.map(cat => {
          const card = myCards[cat.id] ?? null
          return (
            <div key={cat.id} className="own-card__attr">
              <span className="own-card__attr-label">
                {CARD_ICON_MAP[cat.id]
                  ? <img src={CARD_ICON_MAP[cat.id]} alt="" aria-hidden="true" className="card-cat-icon" />
                  : cat.icon}{' '}
                {cat.name[lang]}
              </span>
              <span className="own-card__attr-val">{card ? card.label[lang] : '—'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
