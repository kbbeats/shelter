import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'
import { CARD_ICON_MAP } from '../../assets/card-icons'

interface Props {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function PlayerHand({ collapsed, onToggleCollapsed }: Props) {
  const t = useT()
  const [pendingAbilityTarget, setPendingAbilityTarget] = useState(false)
  const roomState = useGameStore(s => s.roomState)
  const myCards = useGameStore(s => s.myCards)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)
  const revealCard = useGameStore(s => s.revealCard)
  const useAbility = useGameStore(s => s.useAbility)

  if (!roomState?.scenario || !myCards || !mySocketId) return null

  const me = roomState.players.find(p => p.id === mySocketId)
  if (!me) return null

  const isMyTurn =
    roomState.phase === 'ROUND_ARGUMENT' &&
    roomState.currentArgumentPlayerId === mySocketId

  const allowFreeChoiceReveal = roomState.currentRound >= 2

  const alivePlayers = roomState.players.filter(p => p.isAlive && p.id !== mySocketId)

  const handleUseSpecialAction = () => {
    const specialCard = myCards['special_action']
    if (!specialCard) return
    const targetType = specialCard.targetType ?? 'none'
    if (targetType === 'other') {
      setPendingAbilityTarget(true)
    } else if (targetType === 'self') {
      useAbility(mySocketId)
    } else {
      useAbility()
    }
  }

  return (
    <>
      <div className={`own-card${collapsed ? ' own-card--collapsed' : ''}`}>
        <button
          className="own-card__collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? t('game.card.expand') : t('game.card.collapse')}
          aria-expanded={!collapsed}
        >
          {collapsed ? '»' : '«'}
        </button>
        <div className="own-card__book">
          <div className="own-card__content">
            <div className="own-card__header">
              <span className="own-card__name">{me.name}</span>
              <span className="section-label" style={{ marginBottom: 0 }}>Your cards</span>
            </div>
            <div className="own-card__attrs">
              {roomState.scenario.cardCategories.map(cat => {
                const card = myCards[cat.id] ?? null
                const isRevealed = me.revealedCategoryIds.includes(cat.id)

                if (cat.id === 'special_action') {
                  return (
                    <div key={cat.id} className="own-card__attr">
                      <div className="own-card__attr-top">
                        <span className="own-card__attr-label">{CARD_ICON_MAP[cat.id] ? <img src={CARD_ICON_MAP[cat.id]} alt="" aria-hidden="true" className="card-cat-icon" /> : cat.icon} {cat.name[lang]}</span>
                        {isRevealed ? (
                          <span className="pill pill--accent">{t('special_action.used')}</span>
                        ) : (
                          <button
                            className="special-action-use-btn"
                            onClick={handleUseSpecialAction}
                          >
                            {t('special_action.use')}
                          </button>
                        )}
                      </div>
                      <span
                        className="own-card__attr-val"
                        title={card ? card.description[lang] : ''}
                      >
                        {card ? card.label[lang] : '—'}
                      </span>
                    </div>
                  )
                }

                return (
                  <div key={cat.id} className="own-card__attr">
                    <div className="own-card__attr-top">
                      <span className="own-card__attr-label">{CARD_ICON_MAP[cat.id] ? <img src={CARD_ICON_MAP[cat.id]} alt="" aria-hidden="true" className="card-cat-icon" /> : cat.icon} {cat.name[lang]}</span>
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
                          <span className="pill pill--neutral">{t('game.hidden')}</span>
                        )
                      ) : (
                        <span className="pill pill--accent">Public</span>
                      )}
                    </div>
                    <span className="own-card__attr-val">{card ? card.label[lang] : '—'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {pendingAbilityTarget && (
        <div className="ability-target-overlay">
          <div className="ability-target-modal">
            <div className="ability-target-modal__title">
              {myCards['special_action']?.label[lang] ?? ''}: {t('ability.choose_target')}
            </div>
            <div className="ability-target-modal__players">
              {alivePlayers.map(p => (
                <button
                  key={p.id}
                  className="btn btn--outline"
                  onClick={() => {
                    useAbility(p.id)
                    setPendingAbilityTarget(false)
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => setPendingAbilityTarget(false)}>
              {t('ability.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
