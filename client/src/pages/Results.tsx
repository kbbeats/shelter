import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { LanguageToggle } from '../components/layout/LanguageToggle'
import { CardSlot } from '../components/game/CardSlot'
import { useT } from '../i18n'

export default function Results() {
  const t = useT()
  const navigate = useNavigate()
  const roomState = useGameStore(s => s.roomState)
  const myCards = useGameStore(s => s.myCards)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)
  const { leaveRoom, resetGame } = useGameStore()

  useEffect(() => {
    if (roomState?.phase === 'LOBBY') {
      navigate('/lobby/' + roomState.code)
    }
  }, [roomState?.phase, roomState?.code, navigate])

  if (!roomState || !roomState.scenario) {
    return (
      <div className="results">
        <h1 className="results__title">{t('results.title')}</h1>
        <button className="btn btn--outline" onClick={() => navigate('/')}>
          {t('results.leave')}
        </button>
      </div>
    )
  }

  const { scenario, players, survivors } = roomState
  const survivorPlayers = players.filter(p => survivors.includes(p.id))
  const isHost = players.find(p => p.id === mySocketId)?.isHost ?? false

  const handleLeave = () => {
    leaveRoom()
    navigate('/')
  }

  return (
    <div className="results">
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <LanguageToggle />
      </div>

      <h1 className="results__title">{t('results.title')}</h1>
      <p className="dim mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>
        {t('results.scenario')} — {scenario.title[lang]}
      </p>

      <div className="results__survivors">
        {survivorPlayers.map(player => {
          const isMe = player.id === useGameStore.getState().mySocketId
          return (
            <div key={player.id} className="survivor-card">
              <div className="survivor-card__name">
                {player.name} {isMe ? '(You)' : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {scenario.cardCategories.map(cat => {
                  const masked = player.maskedCards[cat.id]
                  const card = isMe && myCards ? myCards[cat.id] : (masked?.card ?? null)
                  return (
                    <CardSlot
                      key={cat.id}
                      category={cat}
                      card={card}
                      isRevealed={isMe || (masked?.isRevealed ?? false)}
                      isClickable={false}
                      lang={lang}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3" style={{ flexDirection: 'column', alignItems: 'center' }}>
        {isHost ? (
          <button className="btn btn--primary" onClick={resetGame}>
            {t('results.play_again')}
          </button>
        ) : (
          <p className="dim mono" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {t('results.waiting_host')}
          </p>
        )}
        <button className="btn btn--outline" onClick={handleLeave}>
          {t('results.leave')}
        </button>
      </div>
    </div>
  )
}
