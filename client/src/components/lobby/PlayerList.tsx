import type { PublicPlayer } from '@shelter/shared'
import { useT } from '../../i18n'

interface Props {
  players: PublicPlayer[]
  mySocketId: string | null
}

export function PlayerList({ players, mySocketId }: Props) {
  const t = useT()

  return (
    <div className="lb-ticket">
      <div className="lb-ticket__head">
        <span className="lb-ticket__title">{t('lobby.players')} ({players.length})</span>
      </div>
      <div className="lb-roster">
        {players.map(p => (
          <div
            key={p.id}
            className={`lb-row${p.id === mySocketId ? ' lb-row--me' : ''}`}
          >
            <span className="lb-row__name">{p.name}</span>
            <div className="lb-row__badges">
              {p.id === mySocketId && (
                <span className="lb-tag lb-tag--you">{t('lobby.you')}</span>
              )}
              {p.isHost && (
                <span className="lb-tag lb-tag--host">{t('lobby.host')}</span>
              )}
              {!p.isConnected && (
                <span className="lb-tag lb-tag--offline">offline</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
