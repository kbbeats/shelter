import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'
import type { SpecialAbilityCard } from '@shelter/shared'

const ABILITY_ICONS: Record<string, string> = {
  reveal_card: '👁',
  immunity: '🛡',
  inspect: '🔍',
  silence: '🤫',
  double_vote: '⚡',
}

export function AbilityTray() {
  const t = useT()
  const myAbilities = useGameStore(s => s.myAbilities)
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const useAbility = useGameStore(s => s.useAbility)
  const lang = useGameStore(s => s.language)
  const [pendingAbility, setPendingAbility] = useState<SpecialAbilityCard | null>(null)

  if (!myAbilities || myAbilities.length === 0) return null

  const canUse = roomState?.phase === 'ROUND_ARGUMENT'
  const alivePlayers = (roomState?.players ?? []).filter(p => p.isAlive && p.id !== mySocketId)

  const handleAbilityClick = (ability: SpecialAbilityCard) => {
    if (!canUse) return
    if (ability.targetType === 'none') {
      useAbility(ability.id)
    } else if (ability.targetType === 'self') {
      useAbility(ability.id, mySocketId ?? undefined)
    } else {
      setPendingAbility(ability)
    }
  }

  const handleTargetSelect = (targetId: string) => {
    if (!pendingAbility) return
    useAbility(pendingAbility.id, targetId)
    setPendingAbility(null)
  }

  return (
    <>
      <div className="ability-tray">
        <div className="ability-tray__label">{t('ability.label')}</div>
        <div className="ability-tray__cards">
          {myAbilities.map((ability, i) => (
            <button
              key={`${ability.id}-${i}`}
              className={`ability-card${canUse ? ' ability-card--active' : ''}`}
              onClick={() => handleAbilityClick(ability)}
              disabled={!canUse}
              title={ability.description[lang]}
            >
              <div className="ability-card__icon">{ABILITY_ICONS[ability.effectType] ?? '✨'}</div>
              <div className="ability-card__name">{ability.name[lang]}</div>
              <div className="ability-card__desc">{ability.description[lang]}</div>
            </button>
          ))}
        </div>
        {!canUse && (
          <div className="ability-tray__hint">{t('ability.only_during_argument')}</div>
        )}
      </div>

      {pendingAbility && (
        <div className="ability-target-overlay">
          <div className="ability-target-modal">
            <div className="ability-target-modal__title">
              {pendingAbility.name[lang]}: {t('ability.choose_target')}
            </div>
            <div className="ability-target-modal__players">
              {alivePlayers.map(p => (
                <button
                  key={p.id}
                  className="btn btn--outline"
                  onClick={() => handleTargetSelect(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => setPendingAbility(null)}>
              {t('ability.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
