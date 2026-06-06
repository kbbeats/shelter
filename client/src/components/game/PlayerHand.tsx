import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { CardSlot } from './CardSlot'
import { CardRevealModal } from './CardRevealModal'
import type { CardCategory } from '@shelter/shared'

export function PlayerHand() {
  const roomState = useGameStore(s => s.roomState)
  const myCards = useGameStore(s => s.myCards)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)
  const [confirming, setConfirming] = useState<CardCategory | null>(null)

  if (!roomState?.scenario || !myCards || !mySocketId) return null

  const me = roomState.players.find(p => p.id === mySocketId)
  if (!me) return null

  const isMyTurn =
    roomState.phase === 'ROUND_ARGUMENT' &&
    roomState.currentArgumentPlayerId === mySocketId

  return (
    <>
      <div className="player-hand">
        <div className="player-hand__label">Your cards</div>
        <div className="player-hand__cards">
          {roomState.scenario.cardCategories.map(cat => {
            const card = myCards[cat.id] ?? null
            const isRevealed = me.revealedCategoryIds.includes(cat.id)
            return (
              <div key={cat.id} className="player-hand__card-wrap">
                <CardSlot
                  category={cat}
                  card={card}
                  isRevealed={isRevealed}
                  isClickable={isMyTurn && !isRevealed}
                  lang={lang}
                  onClick={() => setConfirming(cat)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {confirming && (
        <CardRevealModal
          category={confirming}
          onClose={() => setConfirming(null)}
        />
      )}
    </>
  )
}
