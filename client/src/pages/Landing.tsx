import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { LanguageToggle } from '../components/layout/LanguageToggle'
import { useT } from '../i18n'

type View = 'home' | 'create' | 'join'

export default function Landing() {
  const t = useT()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('home')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const { createRoom, joinRoom, roomState, error, clearError, connected } = useGameStore()
  const [disconnectedMs, setDisconnectedMs] = useState(0)

  useEffect(() => {
    if (roomState?.phase === 'LOBBY' && roomState.code) {
      navigate(`/lobby/${roomState.code}`)
    }
  }, [roomState, navigate])

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
      ? 'Server is waking up, this may take ~30 seconds'
      : 'Connecting to server...'
    : null

  return (
    <div className="landing">
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <LanguageToggle />
      </div>

      {error && (
        <div className="error-toast">
          {error}
          <button className="btn btn--ghost btn--sm" onClick={clearError}>✕</button>
        </div>
      )}

      <div className="landing__hero">
        <h1 className="app-title">{t('app.title')}</h1>
        <p className="app-subtitle">{t('app.subtitle')}</p>
      </div>

      {connectionStatus && (
        <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          {connectionStatus}
        </p>
      )}

      {view === 'home' && (
        <div className="landing__actions">
          <button className="btn btn--primary btn--full btn--lg" onClick={() => setView('create')} disabled={!connected}>
            {t('landing.create')}
          </button>
          <button className="btn btn--outline btn--full btn--lg" onClick={() => setView('join')} disabled={!connected}>
            {t('landing.join')}
          </button>
        </div>
      )}

      {view === 'create' && (
        <div className="landing__form">
          <input
            className="input"
            placeholder={t('landing.name.placeholder')}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            maxLength={24}
            autoFocus
          />
          <button className="btn btn--primary btn--full" onClick={handleCreate} disabled={!connected || !name.trim()}>
            {t('landing.create')}
          </button>
          <button className="btn btn--ghost btn--full" onClick={() => setView('home')}>
            {t('landing.back')}
          </button>
        </div>
      )}

      {view === 'join' && (
        <div className="landing__form">
          <input
            className="input"
            placeholder={t('landing.name.placeholder')}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            autoFocus
          />
          <input
            className="input input--code"
            placeholder={t('landing.code.placeholder')}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={6}
          />
          <div className="landing__form-row">
            <button className="btn btn--ghost btn--full" onClick={() => setView('home')}>
              {t('landing.back')}
            </button>
            <button
              className="btn btn--primary btn--full"
              onClick={handleJoin}
              disabled={!connected || !name.trim() || code.length < 4}
            >
              {t('landing.join.submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
