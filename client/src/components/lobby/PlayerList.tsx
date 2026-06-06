import type { PublicPlayer } from '@shelter/shared'
import { useT } from '../../i18n'

interface Props {
  players: PublicPlayer[]
  mySocketId: string | null
}

export function PlayerList({ players, mySocketId }: Props) {
  const t = useT()

  return (
    <div>
      <div className="section-label">{t('lobby.players')} ({players.length})</div>
      <div className="lobby__player-list">
        {players.map(p => (
          <div
            key={p.id}
            className={`player-row${p.id === mySocketId ? ' player-row--me' : ''}`}
          >
            <span className="player-row__name">{p.name}</span>
            <div className="player-row__badges">
              {p.id === mySocketId && (
                <span className="badge badge--you">{t('lobby.you')}</span>
              )}
              {p.isHost && (
                <span className="badge badge--host">{t('lobby.host')}</span>
              )}
              {!p.isConnected && (
                <span className="badge badge--offline">offline</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
