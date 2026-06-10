import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { LanguageToggle } from '../components/layout/LanguageToggle'
import { HowToPlayModal } from '../components/layout/HowToPlayModal'
import { useT } from '../i18n'

type View = 'home' | 'create' | 'join'

const TIP_COUNT = 8

export default function Landing() {
  const t = useT()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('home')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const { createRoom, joinRoom, roomState, error, clearError, connected } = useGameStore()
  const [disconnectedMs, setDisconnectedMs] = useState(0)
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIP_COUNT))

  useEffect(() => {
    if (roomState?.phase === 'LOBBY' && roomState.code) {
      navigate(`/lobby/${roomState.code}`)
    }
  }, [roomState, navigate])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNext = () => {
      const delay = 10_000 + Math.random() * 5_000
      timeoutId = setTimeout(() => {
        setTipIndex(prev => {
          if (TIP_COUNT <= 1) return prev
          let next = Math.floor(Math.random() * TIP_COUNT)
          while (next === prev) next = Math.floor(Math.random() * TIP_COUNT)
          return next
        })
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (connected) {
      setDisconnectedMs(0)
      return
    }
    const start = Date.now()
    const interval = setInterval(() => setDisconnectedMs(Date.now() - start), 500)
    return () => clearInterval(interval)
  }, [connected])

  const handleCreate = () => {
    if (!name.trim()) return
    createRoom(name.trim())
  }

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return
    joinRoom(code.trim().toUpperCase(), name.trim())
  }

  const connectionStatus = !connected
    ? disconnectedMs >= 10_000
      ? t('landing.status.waking')
      : t('landing.status.connecting')
    : null

  return (
    <div className="landing">
      <HowToPlayModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      {error && (
        <div className="error-toast">
          {error}
          <button className="btn btn--ghost btn--sm" onClick={clearError}>✕</button>
        </div>
      )}

      <header className="z-bar">
        <div className="z-bar__right">
          <button className="z-btn z-btn--ghost" onClick={() => setTutorialOpen(true)}>
            {t('landing.tutorial')}
          </button>
          <LanguageToggle />
        </div>
      </header>

      <main className="z-main">
        <div className="z-poster">
          <div className="z-tape" aria-hidden="true" />
          <div className="z-sign">
            <svg className="z-trefoil" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="z-trefoil__ring" cx="50" cy="50" r="45" />
              <g className="z-trefoil__icon">
                <g className="z-trefoil__blades">
                  <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" />
                  <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(120 50 50)" />
                  <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(240 50 50)" />
                </g>
                <circle className="z-trefoil__core" cx="50" cy="50" r="10" />
              </g>
            </svg>
            <h1 className="z-title">{t('app.title')}</h1>
          </div>
          <div className="z-stamp">
            <span className="z-stamp__line">{t('landing.stamp.line1')}</span>
            <span className="z-stamp__line">{t('landing.stamp.line2')}</span>
          </div>
        </div>

        <div className="z-ticket">
          <div className="z-ticket__head">
            <span className="z-ticket__title">{t('landing.ticket.title')}</span>
            {connectionStatus ? (
              <span className="z-ticket__status">
                <span className="z-dot" />
                {connectionStatus}
              </span>
            ) : (
              <span className="z-ticket__status z-ticket__status--ok">
                <span className="z-dot z-dot--ok" />
                {t('landing.status.connected')}
              </span>
            )}
          </div>

          <div className="z-ticket__body">
            {view === 'home' && (
              <div className="z-actions" key="home">
                <button
                  className="z-btn z-btn--primary"
                  onClick={() => setView('create')}
                  disabled={!connected}
                >
                  {t('landing.create')}
                </button>
                <button
                  className="z-btn z-btn--outline"
                  onClick={() => setView('join')}
                  disabled={!connected}
                >
                  {t('landing.join')}
                </button>
              </div>
            )}

            {view === 'create' && (
              <div className="z-form" key="create">
                <input
                  className="z-input"
                  placeholder={t('landing.name.placeholder')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  maxLength={24}
                  autoFocus
                />
                <button
                  className="z-btn z-btn--primary"
                  onClick={handleCreate}
                  disabled={!connected || !name.trim()}
                >
                  {t('landing.create')}
                </button>
                <button
                  className="z-btn z-btn--outline"
                  onClick={() => setView('home')}
                >
                  {t('landing.back')}
                </button>
              </div>
            )}

            {view === 'join' && (
              <div className="z-form" key="join">
                <input
                  className="z-input"
                  placeholder={t('landing.name.placeholder')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={24}
                  autoFocus
                />
                <input
                  className="z-input z-input--code"
                  placeholder={t('landing.code.placeholder')}
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  maxLength={6}
                />
                <div className="z-form-row">
                  <button
                    className="z-btn z-btn--outline"
                    onClick={() => setView('home')}
                  >
                    {t('landing.back')}
                  </button>
                  <button
                    className="z-btn z-btn--primary"
                    onClick={handleJoin}
                    disabled={!connected || !name.trim() || code.length < 4}
                  >
                    {t('landing.join.submit')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="z-foot">
        <span className="z-foot__tip-wrap">
          <span className="z-foot__tip" key={tipIndex}>
            <span className="z-foot__tip-label">{t('landing.foot.tip.label')}</span> {t(`landing.foot.tip.${tipIndex}`)}
          </span>
        </span>
        <span className="z-foot__sub">{t('landing.foot.right')}</span>
      </footer>
    </div>
  )
}
