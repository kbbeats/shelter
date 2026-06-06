import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'

const INTERRUPT_DURATION = 4000

export function AbilityInterruptScreen() {
  const t = useT()
  const lang = useGameStore(s => s.language)
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const skipInterrupt = useGameStore(s => s.skipInterrupt)
  const [progress, setProgress] = useState(100)

  const interrupt = roomState?.activeInterrupt ?? null
  const expiresAt = interrupt?.expiresAt ?? null

  useEffect(() => {
    if (!expiresAt) return
    const tick = () => {
      const remaining = expiresAt - Date.now()
      setProgress(Math.max(0, Math.min(100, (remaining / INTERRUPT_DURATION) * 100)))
    }
    tick()
    const interval = setInterval(tick, 80)
    return () => clearInterval(interval)
  }, [expiresAt])

  if (!interrupt) return null

  const isMyInterrupt = interrupt.usedBySocketId === mySocketId
  const scenario = roomState?.scenario

  const revealedCategory = interrupt.revealedCard
    ? scenario?.cardCategories.find(c => c.id === interrupt.revealedCard!.categoryId)
    : null

  return (
    <div className="ability-interrupt">
      <div className="ability-interrupt__backdrop" />
      <div className="ability-interrupt__card">
        <div className="ability-interrupt__header">
          <span className="ability-interrupt__label">{t('ability.interrupt.label')}</span>
        </div>

        <div className="ability-interrupt__icon">{interrupt.abilityIcon}</div>
        <div className="ability-interrupt__name">{interrupt.abilityName[lang]}</div>

        <div className="ability-interrupt__who">
          <strong>{interrupt.usedByName}</strong>
          {interrupt.targetName && (
            <> → <strong>{interrupt.targetName}</strong></>
          )}
        </div>

        {interrupt.revealedCard && revealedCategory && (
          <div className="ability-interrupt__revealed">
            <div className="ability-interrupt__revealed-label">{t('ability.interrupt.revealed')}</div>
            <div className="ability-interrupt__revealed-card">
              <span className="ability-interrupt__revealed-icon">{revealedCategory.icon}</span>
              <span className="ability-interrupt__revealed-cat">{revealedCategory.name[lang]}</span>
              <span className="ability-interrupt__revealed-val">{interrupt.revealedCard.card.label[lang]}</span>
            </div>
          </div>
        )}

        {interrupt.effectType === 'immunity' && (
          <div className="ability-interrupt__effect-desc">{t('ability.interrupt.effect.immunity')}</div>
        )}
        {interrupt.effectType === 'silence' && interrupt.targetName && (
          <div className="ability-interrupt__effect-desc">
            {lang === 'ru'
              ? `${interrupt.targetName} пропустит следующий ход аргументации`
              : `${interrupt.targetName} skips their next argument turn`}
          </div>
        )}
        {interrupt.effectType === 'double_vote' && (
          <div className="ability-interrupt__effect-desc">{t('ability.interrupt.effect.double_vote')}</div>
        )}
        {interrupt.effectType === 'inspect' && isMyInterrupt && (
          <div className="ability-interrupt__effect-desc">{t('ability.interrupt.effect.inspect')}</div>
        )}
        {interrupt.effectType === 'inspect' && !isMyInterrupt && (
          <div className="ability-interrupt__effect-desc">
            {lang === 'ru'
              ? `${interrupt.usedByName} тайно просмотрел карты`
              : `${interrupt.usedByName} secretly inspected hidden cards`}
          </div>
        )}

        <div className="ability-interrupt__progress">
          <div className="ability-interrupt__progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {isMyInterrupt && (
          <button className="btn btn--ghost btn--sm" onClick={skipInterrupt}>
            {t('ability.interrupt.skip')}
          </button>
        )}
      </div>
    </div>
  )
}
