import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import { useState } from 'react'

export function VotingPanel() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const castVote = useGameStore(s => s.castVote)
  const [votedFor, setVotedFor] = useState<string | null>(null)

  if (!roomState || roomState.phase !== 'ROUND_VOTING') return null

  const { players, voteStatus } = roomState
  const alivePlayers = players.filter(p => p.isAlive)
  const totalVotes = voteStatus?.totalVotes ?? 0
  const totalVoters = voteStatus?.totalVoters ?? 0

  const handleVote = (targetId: string) => {
    if (votedFor) return
    setVotedFor(targetId)
    castVote(targetId)
  }

  return (
    <div className="voting-panel">
      <div className="voting-panel__title">{t('vote.title')}</div>
      <div className="mono dim" style={{ fontSize: '0.75rem', marginBottom: 12 }}>
        {totalVotes}/{totalVoters} {t('vote.tally')}
      </div>

      {alivePlayers
        .filter(p => p.id !== mySocketId)
        .map(player => {
          const votes = voteStatus?.votes[player.id] ?? 0
          const pct = totalVoters > 0 ? (votes / totalVoters) * 100 : 0
          const isVoted = votedFor === player.id

          return (
            <div key={player.id} className="vote-option">
              <span className="vote-option__name">{player.name}</span>
              <div className="vote-bar-wrap">
                <div className="vote-bar" style={{ width: `${pct}%` }} />
              </div>
              <span className="vote-count">{votes}</span>
              {!votedFor ? (
                <Button variant="danger" size="sm" onClick={() => handleVote(player.id)}>
                  {t('vote.cast')}
                </Button>
              ) : (
                <span style={{ fontSize: '0.75rem', color: isVoted ? 'var(--c-primary)' : 'var(--c-text-dim)', marginLeft: 4 }}>
                  {isVoted ? '✓' : ''}
                </span>
              )}
            </div>
          )
        })}

      {votedFor && (
        <div className="mt-3 mono dim" style={{ fontSize: '0.8rem' }}>
          {t('vote.you_voted')} {players.find(p => p.id === votedFor)?.name}
        </div>
      )}
    </div>
  )
}
