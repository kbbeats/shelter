import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

export function AbilityAnnouncement() {
  const abilityAnnouncement = useGameStore(s => s.abilityAnnouncement)
  const clearAbilityAnnouncement = useGameStore(s => s.clearAbilityAnnouncement)
  const lang = useGameStore(s => s.language)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!abilityAnnouncement) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      clearAbilityAnnouncement()
    }, 3500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [abilityAnnouncement, clearAbilityAnnouncement])

  if (!abilityAnnouncement) return null

  const { playerName, abilityName, targetName } = abilityAnnouncement

  return (
    <div className="ability-announcement">
      <span className="ability-announcement__icon">⚡</span>
      <span>
        <strong>{playerName}</strong>{' '}
        {lang === 'ru' ? 'использовал' : 'used'}{' '}
        <strong>{abilityName[lang]}</strong>
        {targetName && (
          <> {lang === 'ru' ? 'на' : 'on'} <strong>{targetName}</strong></>
        )}!
      </span>
    </div>
  )
}
