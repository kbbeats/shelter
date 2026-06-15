import { useGameStore } from '../../store/gameStore'
import { getInitials } from '../../utils/avatar'

export function SurvivorBoard() {
  const roomState = useGameStore(s => s.roomState)

  if (!roomState) return null

  const { players, currentArgumentPlayerId, phase } = roomState

  return (
    <div className="survivor-board">
      <div className="survivor-board__title">Players</div>
      {players.map(p => {
        const isSpeaking =
          phase === 'ROUND_ARGUMENT' && p.id === currentArgumentPlayerId
        return (
          <div
            key={p.id}
            className={[
              'survivor-item',
              p.isAlive ? 'survivor-item--alive' : 'survivor-item--exiled',
              isSpeaking ? 'survivor-item--speaking' : '',
            ].filter(Boolean).join(' ')}
          >
            <span className={`avatar survivor-item__avatar${isSpeaking ? ' avatar--active' : ''}`}>{getInitials(p.name)}</span>
            <span style={{ flex: 1 }}>{p.name}</span>
            {!p.isConnected && (
              <span style={{ fontSize: '0.65rem', color: 'var(--c-text-dim)' }}>⚡</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
