import { useState } from 'react'
import { useT } from '../../i18n'

const STORAGE_KEY = 'shelter_age_confirmed'

export function AgeGateModal() {
  const t = useT()
  const [confirmed, setConfirmed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const [denied, setDenied] = useState(false)

  if (confirmed) return null

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setConfirmed(true)
  }

  return (
    <div className="age-gate-modal__backdrop">
      <div className="age-gate-modal__panel">
        <h1 className="age-gate-modal__title">{t('agegate.title')}</h1>
        <p className="age-gate-modal__body">{t('agegate.body')}</p>

        {denied ? (
          <p className="age-gate-modal__denied">{t('agegate.denied_message')}</p>
        ) : (
          <div className="age-gate-modal__actions">
            <button className="btn btn--primary btn--lg" onClick={handleConfirm}>
              {t('agegate.confirm')}
            </button>
            <button className="btn btn--ghost age-gate-modal__deny" onClick={() => setDenied(true)}>
              {t('agegate.deny')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
