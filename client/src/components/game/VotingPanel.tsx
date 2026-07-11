import { useGameStore } from '../../store/gameStore'
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
  const totalVotes = voteStatus?.totalVotes ?? 0
  const totalVoters = voteStatus?.totalVoters ?? 0
  const votedPlayerIds = voteStatus?.votedPlayerIds ?? []
  const hasVoted = votedFor !== null

  const handleVote = (targetId: string) => {
    if (hasVoted) return
    setVotedFor(targetId)
    castVote(targetId)
  }

  // Roster = every alive player except the viewer. Flags derive purely from
  // votedPlayerIds (who has submitted) — never from any vote target.
  const roster = players.filter(p => p.isAlive && p.id !== mySocketId)
  const segments = Array.from({ length: totalVoters }, (_, i) => i < totalVotes)

  return (
    <section className="exile-term" role="status" aria-live="polite">
      <div className="exile-term__bar">
        <span className="exile-term__dot" aria-hidden="true" />
        SHELTER-OS :: EXILE_POLL.SYS
      </div>

      <div className="exile-term__body">
        <div className="exile-term__line">
          &gt; {t('vote.term.pollStatus')}: <strong>{t('vote.term.running')}</strong>
        </div>
        {hasVoted ? (
          <div className="exile-term__line">
            &gt; {t('vote.term.yourInput')}: <strong>{t('vote.term.locked')}</strong>
          </div>
        ) : (
          <div className="exile-term__line">
            &gt; {t('vote.term.resultsLabel')}: <strong>{t('vote.term.withheld')}</strong>
          </div>
        )}

        <div className="exile-term__progress">
          {t('vote.term.submissions')}: <strong>{totalVotes}/{totalVoters}</strong>
          <div className="exile-term__track" aria-hidden="true">
            {segments.map((filled, i) => (
              <div
                key={i}
                className={`exile-term__seg${filled ? ' exile-term__seg--filled' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="exile-term__roster">
          {roster.map((player, i) => {
            const received = votedPlayerIds.includes(player.id)
            return (
              <div key={player.id} className="exile-row">
                <span className="exile-row__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="exile-row__name">{player.name}</span>
                <span
                  className={`exile-row__flag${received ? ' exile-row__flag--in' : ''}`}
                >
                  {received ? t('vote.term.received') : t('vote.term.pending')}
                </span>
                {!hasVoted && (
                  <button
                    type="button"
                    className="exile-row__target"
                    onClick={() => handleVote(player.id)}
                  >
                    {t('vote.term.target')}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="exile-term__footer">
          {hasVoted ? (
            <>&gt; {t('vote.term.accepted')}</>
          ) : (
            <>
              &gt; {t('vote.term.awaiting')}
              <span className="exile-term__cursor" aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
