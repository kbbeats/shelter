import type { PublicVoteStatus, VoteSummary } from '@shelter/shared'

export class VoteManager {
  private votes = new Map<string, { targetId: string; weight: number }>()
  private eligibleVoterIds: Set<string>
  private doubleVoters: Set<string>

  constructor(eligibleVoterIds: string[], doubleVoters: string[] = []) {
    this.eligibleVoterIds = new Set(eligibleVoterIds)
    this.doubleVoters = new Set(doubleVoters)
  }

  castVote(voterId: string, targetId: string): boolean {
    if (!this.eligibleVoterIds.has(voterId)) return false
    if (this.votes.has(voterId)) return false
    const weight = this.doubleVoters.has(voterId) ? 2 : 1
    this.votes.set(voterId, { targetId, weight })
    return true
  }

  hasVoted(voterId: string): boolean {
    return this.votes.has(voterId)
  }

  getSummary(): VoteSummary {
    const counts: Record<string, number> = {}
    for (const { targetId, weight } of this.votes.values()) {
      counts[targetId] = (counts[targetId] || 0) + weight
    }
    return {
      votes: counts,
      totalVotes: this.votes.size,
      totalVoters: this.eligibleVoterIds.size,
    }
  }

  /**
   * Anonymity-safe status for broadcast to clients. Exposes only the aggregate
   * count and which voters have submitted — never their targets or per-candidate
   * tallies. `getSummary()` (with the raw breakdown) stays server-internal.
   */
  getPublicStatus(): PublicVoteStatus {
    return {
      totalVotes: this.votes.size,
      totalVoters: this.eligibleVoterIds.size,
      votedPlayerIds: [...this.votes.keys()],
    }
  }

  isComplete(): boolean {
    return this.votes.size >= this.eligibleVoterIds.size
  }

  getExiledPlayerId(immunePlayers: Set<string> = new Set()): string | null {
    const summary = this.getSummary()
    const entries = Object.entries(summary.votes)
    if (entries.length === 0) return null
    entries.sort(([, a], [, b]) => b - a)
    for (const [id] of entries) {
      if (!immunePlayers.has(id)) return id
    }
    return entries[0][0]
  }
}
