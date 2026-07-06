import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

export function ArgumentPhase() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const argumentDone = useGameStore(s => s.argumentDone)
  const lastReveal = useGameStore(s => s.lastReveal)
  const lang = useGameStore(s => s.language)

  if (!roomState || roomState.phase !== 'ROUND_ARGUMENT') return null

  const {
    currentArgumentPlayerId,
    players,
    currentRound,
    scenario,
    argumentOrder,
    currentArgumentIndex,
  } = roomState
  const isMyTurn = currentArgumentPlayerId === mySocketId
  const me = players.find(p => p.id === mySocketId)

  const hasRevealableLeft = !!me && !!scenario && scenario.cardCategories.some(
    c => c.id !== 'occupation' && c.id !== 'special_action' && !me.revealedCategoryIds.includes(c.id),
  )
  const mustRevealFirst = currentRound >= 2 && !!me && !me.hasRevealedThisRound && hasRevealableLeft

  const getPlayerName = (id: string) =>
    players.find(p => p.id === id)?.name ?? '?'

  // Only trust a reveal captured during THIS round — anything older is stale.
  const reveal = lastReveal && lastReveal.round === currentRound ? lastReveal : null
  const revealCategory = reveal
    ? scenario?.cardCategories.find(c => c.id === reveal.categoryId) ?? null
    : null

  const nextPlayerId = argumentOrder[currentArgumentIndex + 1] ?? null
  const nextPlayer = nextPlayerId ? players.find(p => p.id === nextPlayerId) : null

  const showSide = isMyTurn || !!nextPlayer

  return (
    <section className="argument-phase">
      <div className="argument-phase__round">
        <span className="argument-phase__round-word">{t('game.round')}</span>
        <span className="argument-phase__round-num">{currentRound}</span>
      </div>

      <div className="argument-phase__mid">
        <div className="argument-phase__turn">
          {isMyTurn ? (
            <>
              <span className="argument-phase__turn-flag">{t('game.your_turn')}</span>{' '}
              {t('game.your_turn.tail')}
            </>
          ) : (
            <>
              {getPlayerName(currentArgumentPlayerId ?? '')}{' '}
              <span className="argument-phase__turn-flag">{t('game.their_turn')}</span>
            </>
          )}
        </div>
        {revealCategory && (
          <div className="argument-phase__reveal">
            <span className="pill pill--accent">{t('game.last_reveal')}</span>
            <span className="argument-phase__reveal-text">
              <strong>{revealCategory.name[lang]}</strong> {t('game.shown_by')}{' '}
              <strong>{getPlayerName(reveal!.playerId)}</strong>
            </span>
          </div>
        )}
      </div>

      {showSide && (
        <div className="argument-phase__side">
          {isMyTurn ? (
            <Button
              className="argument-phase__btn"
              onClick={argumentDone}
              disabled={mustRevealFirst}
              title={mustRevealFirst ? t('game.reveal_hint') : ''}
            >
              {t('game.done_arguing')}
            </Button>
          ) : (
            <div className="argument-phase__next">
              <span className="argument-phase__next-word">{t('game.up_next')}</span>
              <span className="argument-phase__next-name">
                {nextPlayer!.id === mySocketId ? t('game.up_next.you') : nextPlayer!.name}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
