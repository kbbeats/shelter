import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { CatastropheReveal } from '../components/game/CatastropheReveal'
import { ArgumentPhase } from '../components/game/ArgumentPhase'
import { VotingPanel } from '../components/game/VotingPanel'
import { ExileReveal } from '../components/game/ExileReveal'
import { BunkerEventReveal } from '../components/game/BunkerEventReveal'
import { PlayerHand } from '../components/game/PlayerHand'
import { PlayerCard } from '../components/game/PlayerCard'
import { AbilityAnnouncement } from '../components/game/AbilityAnnouncement'
import { AbilityInterruptScreen } from '../components/game/AbilityInterruptScreen'
import { ScenarioStoryModal } from '../components/game/ScenarioStoryModal'
import { useT } from '../i18n'

export default function Game() {
  const t = useT()
  const navigate = useNavigate()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const lang = useGameStore(s => s.language)
  const storyClosed = useGameStore(s => s.storyClosed)
  const closeStory = useGameStore(s => s.closeStory)

  useEffect(() => {
    if (!roomState) navigate('/')
    if (roomState?.phase === 'LOBBY') navigate(`/lobby/${roomState.code}`)
    if (roomState?.phase === 'GAME_ENDED') navigate(`/results/${roomState?.code}`)
  }, [roomState, navigate])

  // Mobile starts with the own-card drawer closed so the round UI (status bar +
  // opponent cards) is what's visible first; desktop's sidebar always starts (and
  // stays) expanded, unchanged. One-time mount-time default, not reactive to
  // live resizing — matches the @media (max-width: 700px) breakpoint used
  // everywhere else in index.css for this same mobile/desktop split.
  const [handCollapsed, setHandCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  )

  // Mobile-only swipeable single-card carousel for opponent cards (desktop keeps the grid).
  // Uses native CSS scroll-snap (.player-cards-grid is a real horizontal scroll container,
  // see index.css) instead of a JS-driven transform track — the browser owns the swipe
  // gesture and the snapping. carouselIndex is derived from the scroll position (onScroll)
  // purely to feed the "N / total" indicator and the exile re-sync below.
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [carouselWidth, setCarouselWidth] = useState(0)

  useLayoutEffect(() => {
    const el = carouselRef.current
    if (!el) return
    setCarouselWidth(el.offsetWidth)
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width
      if (width) setCarouselWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // After an exile shrinks the opponent list past the card the user had scrolled to,
  // native scrollLeft would be left out of bounds — pull it (and the index) back to the
  // last valid card. Mirrors the old touch-based re-clamp, but acts on real scroll.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const count = roomState ? roomState.players.filter(p => p.id !== mySocketId).length : 0
    const maxIndex = Math.max(0, count - 1)
    if (carouselIndex > maxIndex) {
      setCarouselIndex(maxIndex)
      el.scrollTo({ left: maxIndex * el.clientWidth, behavior: 'auto' })
    }
  }, [roomState, mySocketId, carouselIndex])

  const prevPhaseRef = useRef<string | null>(null)
  const storyShownRef = useRef(false)
  const [showStory, setShowStory] = useState(false)

  useEffect(() => {
    const phase = roomState?.phase
    if (!phase) return
    if (phase === 'CATASTROPHE_REVEAL') {
      storyShownRef.current = false
    }
    if (phase === 'ROUND_ARGUMENT' && prevPhaseRef.current !== 'ROUND_ARGUMENT' && !storyShownRef.current) {
      storyShownRef.current = true
      setShowStory(true)
    }
    prevPhaseRef.current = phase
  }, [roomState?.phase])

  useEffect(() => {
    if (storyClosed) setShowStory(false)
  }, [storyClosed])

  if (!roomState || !roomState.scenario) {
    return (
      <div className="dealing-screen">
        <div className="dot-loader">
          <span />
          <span />
          <span />
        </div>
        <div className="dealing-screen__title">{t('game.dealing.title')}</div>
      </div>
    )
  }

  const { phase, scenario, players, currentArgumentPlayerId, argumentOrder, currentArgumentIndex } = roomState
  const otherPlayers = players.filter(p => p.id !== mySocketId)
  const isHost = players.find(p => p.id === mySocketId)?.isHost ?? false

  // Re-clamp in case the list shrank (e.g. an exile) past the index a player had swiped to
  const clampedCarouselIndex = Math.min(carouselIndex, Math.max(0, otherPlayers.length - 1))

  // Native scroll-snap owns the gesture; we only read the resulting scroll position
  // back to keep the "N / total" indicator in sync with which card is snapped.
  const handleCarouselScroll = () => {
    const el = gridRef.current
    if (!el || !el.clientWidth) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setCarouselIndex(prev => (prev === index ? prev : index))
  }

  // Fullscreen overlays take priority
  if (phase === 'CATASTROPHE_REVEAL' || phase === 'BUNKER_REVEAL') return <CatastropheReveal />
  if (phase === 'EXILE_REVEAL') return <ExileReveal />
  if (phase === 'BUNKER_EVENT') return <BunkerEventReveal />
  if (phase === 'ABILITY_INTERRUPT') return <AbilityInterruptScreen />
  if (phase === 'DEALING') {
    return (
      <div className="dealing-screen">
        <div className="dot-loader">
          <span />
          <span />
          <span />
        </div>
        <div className="dealing-screen__title">{t('game.dealing.title')}</div>
      </div>
    )
  }

  return (
    <div className={`game-layout${handCollapsed ? ' game-layout--collapsed' : ''}`}>
      {/* My hand — left sidebar column */}
      <div className="game-layout__hand">
        <PlayerHand collapsed={handCollapsed} onToggleCollapsed={() => setHandCollapsed(v => !v)} />
      </div>

      {/* Main area — status bar + opponent roster */}
      <div className="game-layout__main">
        {(phase === 'ROUND_ARGUMENT') && <ArgumentPhase />}
        {(phase === 'ROUND_VOTING') && <VotingPanel />}

        {/* Other players' cards — desktop: plain grid. Mobile: the same markup becomes a
            swipeable single-card carousel via CSS only (.player-cards-carousel/__slide
            are display:contents on desktop, so this has zero effect on the grid there). */}
        <div
          className="player-cards-carousel"
          ref={carouselRef}
        >
          <div
            className="player-cards-grid"
            ref={gridRef}
            onScroll={handleCarouselScroll}
          >
            {otherPlayers.map(player => {
              const argIdx = argumentOrder.indexOf(player.id)
              const isDone = argIdx !== -1 && argIdx < currentArgumentIndex
              const isSpeakingNext = argIdx !== -1 && argIdx === currentArgumentIndex + 1
              return (
                <div
                  className="player-cards-grid__slide"
                  key={player.id}
                >
                  <PlayerCard
                    player={player}
                    categories={scenario.cardCategories}
                    lang={lang}
                    isHighlighted={player.id === currentArgumentPlayerId}
                    isDone={isDone}
                    isSpeakingNext={isSpeakingNext}
                  />
                </div>
              )
            })}
          </div>
          {otherPlayers.length > 1 && (
            <div className="player-cards-carousel__indicator">
              {clampedCarouselIndex + 1} / {otherPlayers.length}
            </div>
          )}
        </div>
      </div>

      <AbilityAnnouncement />

      {showStory && (
        <ScenarioStoryModal
          scenario={scenario}
          lang={lang}
          isHost={isHost}
          onHostClose={closeStory}
          capacity={roomState.bunker?.capacity ?? 0}
        />
      )}
    </div>
  )
}
