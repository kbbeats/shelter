import { useGameStore } from '../../store/gameStore'

export function LanguageToggle() {
  const language = useGameStore(s => s.language)
  const setLanguage = useGameStore(s => s.setLanguage)

  return (
    <div className="lang-toggle">
      <button
        className={`lang-toggle__btn ${language === 'en' ? 'lang-toggle__btn--active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        className={`lang-toggle__btn ${language === 'ru' ? 'lang-toggle__btn--active' : ''}`}
        onClick={() => setLanguage('ru')}
      >
        RU
      </button>
    </div>
  )
}
