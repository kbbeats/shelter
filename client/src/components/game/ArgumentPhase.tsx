import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

export function ArgumentPhase() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const argumentDone = useGameStore(s => s.argumentDone)

  if (!roomState || roomState.phase !== 'ROUND_ARGUMENT') return null

  const { currentArgumentPlayerId, argumentOrder, players, currentRound } = roomState
  const isMyTurn = currentArgumentPlayerId === mySocketId

  const getPlayerName = (id: string) =>
    players.find(p => p.id === id)?.name ?? '?'

  return (
    <div className="argument-phase">
      <div className="argument-phase__round">
        {t('game.round')} {currentRound}
      </div>

      {isMyTurn ? (
        <>
          <div className="argument-phase__speaker">{t('game.your_turn')}</div>
          <div className="argument-phase__hint">{t('game.reveal_hint')}</div>
          <Button onClick={argumentDone} full>{t('game.done_arguing')}</Button>
        </>
      ) : (
        <>
          <div className="argument-phase__speaker">
            {getPlayerName(currentArgumentPlayerId ?? '')} {t('game.their_turn')}
          </div>
          <div className="argument-phase__hint">⏳</div>
        </>
      )}

      <div className="argument-phase__order" style={{ marginTop: 16 }}>
        {argumentOrder.map((id, i) => {
          const currentIdx = roomState.currentArgumentIndex
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <div
              key={id}
              className={`arg-order-item${active ? ' arg-order-item--active' : done ? ' arg-order-item--done' : ''}`}
            >
              <div className="arg-order-item__dot" />
              <span>{getPlayerName(id)}</span>
              {done && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
