import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'

export function PlayerHand() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const myCards = useGameStore(s => s.myCards)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)
  const revealCard = useGameStore(s => s.revealCard)

  if (!roomState?.scenario || !myCards || !mySocketId) return null

  const me = roomState.players.find(p => p.id === mySocketId)
  if (!me) return null

  const isMyTurn =
    roomState.phase === 'ROUND_ARGUMENT' &&
    roomState.currentArgumentPlayerId === mySocketId

  const allowFreeChoiceReveal = roomState.currentRound >= 2

  return (
    <div className="own-card">
      <div className="own-card__header">
        <span className="own-card__name">{me.name}</span>
        <span className="section-label" style={{ marginBottom: 0 }}>Your cards</span>
      </div>
      <div className="own-card__attrs">
        {roomState.scenario.cardCategories.map(cat => {
          const card = myCards[cat.id] ?? null
          const isRevealed = me.revealedCategoryIds.includes(cat.id)
          return (
            <div key={cat.id} className="own-card__attr">
              <span className="own-card__attr-label">{cat.icon} {cat.name[lang]}</span>
              <span className="own-card__attr-val">{card ? card.label[lang] : '—'}</span>
              {!isRevealed ? (
                allowFreeChoiceReveal ? (
                  <button
                    className={`own-card__reveal-btn${isMyTurn ? ' own-card__reveal-btn--active' : ''}`}
                    onClick={() => isMyTurn && revealCard(cat.id)}
                    disabled={!isMyTurn}
                    title={isMyTurn ? '' : 'Not your turn'}
                  >
                    Reveal
                  </button>
                ) : (
                  <span className="own-card__public-badge own-card__public-badge--hidden">{t('game.hidden')}</span>
                )
              ) : (
                <span className="own-card__public-badge">Public</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
