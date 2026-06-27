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

  // TEMP DEBUG — remove before done. ?debug=1 injects a self-contained 5-opponent
  // fake game state (no server/sockets needed) so the real carousel bug can be
  // reproduced with real finger swipes on a real phone.
  const debugEnabled = typeof window !== 'undefined' && window.location.search.includes('debug=1')
  useEffect(() => {
    if (!debugEnabled || roomState) return
    // No "me" entry — mySocketId is set to an id that can never collide with one of
    // these, so the otherPlayers filter stays correct even if the real socket.io
    // client (still running in the background) connects and overwrites mySocketId.
    const names = ['host', 'test1', 'test2', 'test3', 'test4']
    const ids = names.map((_, i) => 'p' + i)
    const cats = [
      { id: 'biology', name: { en: 'Biology', ru: 'Биология' }, icon: '🧬' },
      { id: 'occupation', name: { en: 'Occupation', ru: 'Профессия' }, icon: '💼' },
      { id: 'baggage', name: { en: 'Baggage', ru: 'Багаж' }, icon: '🧳' },
      { id: 'health', name: { en: 'Health', ru: 'Здоровье' }, icon: '❤️' },
    ]
    const players = ids.map((id, i) => ({
      id, name: names[i], isHost: i === 0, isAlive: true, isConnected: true,
      revealedCategoryIds: ['biology'],
      maskedCards: {
        biology: { categoryId: 'biology', isRevealed: true, card: { id: 'c' + i, categoryId: 'biology', label: { en: 'Sample ' + i, ru: 'Образец ' + i }, description: { en: '', ru: '' } } },
        occupation: { categoryId: 'occupation', isRevealed: false, card: null },
        baggage: { categoryId: 'baggage', isRevealed: false, card: null },
        health: { categoryId: 'health', isRevealed: false, card: null },
      },
      specialAbilityCount: 0,
    }))
    useGameStore.setState({
      mySocketId: '__debug-self__',
      storyClosed: true,
      roomState: {
        code: 'TEST', phase: 'ROUND_ARGUMENT', players,
        scenario: {
          id: 'test-scenario', title: { en: 'Test', ru: 'Тест' },
          catastropheDescription: { en: '', ru: '' }, story: { en: '', ru: '' }, bunkerEvent: { en: '', ru: '' },
          theme: { primaryColor: '#fff', accentColor: '#fff', bgColor: '#000', surfaceColor: '#111', textColor: '#fff', glowColor: '#fff', icon: '', backgroundFx: '' },
          cardCategories: cats, isPremium: false, minPlayers: 2, maxPlayers: 6,
        },
        bunker: null, currentRound: 1, currentArgumentIndex: 0, argumentOrder: ids,
        currentArgumentPlayerId: ids[0], voteStatus: null, survivors: [], selectedScenarioId: 'test-scenario',
        lastAbilityAnnouncement: null, activeInterrupt: null, scenarioMode: 'host', scenarioVotes: {},
      },
    })
  }, [debugEnabled, roomState])

  useEffect(() => {
    if (debugEnabled) return
    if (!roomState) navigate('/')
    if (roomState?.phase === 'LOBBY') navigate(`/lobby/${roomState.code}`)
    if (roomState?.phase === 'GAME_ENDED') navigate(`/results/${roomState?.code}`)
  }, [roomState, navigate, debugEnabled])

  // Mobile starts with the own-card drawer closed so the round UI (status bar +
  // opponent cards) is what's visible first; desktop's sidebar always starts (and
  // stays) expanded, unchanged. One-time mount-time default, not reactive to
  // live resizing — matches the @media (max-width: 700px) breakpoint used
  // everywhere else in index.css for this same mobile/desktop split.
  const [handCollapsed, setHandCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  )

  // Mobile-only swipeable single-card carousel for opponent cards (desktop keeps the grid).
  // Slide width/track offset are measured in real pixels (via ResizeObserver) rather than
  // expressed as CSS percentages — percentage flex-basis combined with overflow:hidden and
  // a transitioned transform on the same ancestor chain is a documented WebKit fragility
  // class, and this carousel's slides are exactly that shape. Pixels sidestep it entirely.
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselDrag, setCarouselDrag] = useState(0)
  const carouselTouchStartX = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
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

  // TEMP DEBUG — remove before done. The "Dump layout" button (shown when ?debug=1)
  // prints getComputedStyle/getBoundingClientRect for every carousel slide + ancestor
  // chain as on-screen selectable text, so real numbers can be pulled off a real
  // phone with no devtools/cable needed.
  const [debugDump, setDebugDump] = useState<string | null>(null)

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

  // TEMP DEBUG — remove before done
  const dumpCarouselLayout = () => {
    const root = carouselRef.current
    if (!root) return
    const round = (n: number) => Math.round(n * 100) / 100
    const describe = (el: Element | null) => {
      if (!el) return null
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        width: cs.width, flexBasis: cs.flexBasis, flexGrow: cs.flexGrow, flexShrink: cs.flexShrink,
        minWidth: cs.minWidth, display: cs.display, transform: cs.transform, overflow: cs.overflow,
        rect: { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height) },
      }
    }
    const slides = Array.from(root.querySelectorAll('.player-cards-grid__slide'))
    const result = {
      carouselIndex: clampedCarouselIndex,
      carouselWidth,
      ancestors: {
        gameLayoutMain: describe(root.closest('.game-layout__main')),
        carousel: describe(root),
        grid: describe(root.querySelector('.player-cards-grid')),
      },
      slides: slides.map((slide, i) => ({
        index: i,
        name: slide.querySelector('.id-card__name')?.textContent,
        slide: describe(slide),
        idCard: describe(slide.querySelector('.id-card')),
      })),
    }
    setDebugDump(JSON.stringify(result, null, 2))
  }

  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    carouselTouchStartX.current = e.touches[0].clientX
  }
  const handleCarouselTouchMove = (e: React.TouchEvent) => {
    if (carouselTouchStartX.current === null) return
    let delta = e.touches[0].clientX - carouselTouchStartX.current
    // Rubber-band resistance past the first/last card
    if ((clampedCarouselIndex === 0 && delta > 0) || (clampedCarouselIndex === otherPlayers.length - 1 && delta < 0)) {
      delta *= 0.3
    }
    setCarouselDrag(delta)
  }
  const handleCarouselTouchEnd = () => {
    const SWIPE_THRESHOLD = 50
    if (carouselDrag <= -SWIPE_THRESHOLD && clampedCarouselIndex < otherPlayers.length - 1) {
      setCarouselIndex(clampedCarouselIndex + 1)
    } else if (carouselDrag >= SWIPE_THRESHOLD && clampedCarouselIndex > 0) {
      setCarouselIndex(clampedCarouselIndex - 1)
    }
    carouselTouchStartX.current = null
    setCarouselDrag(0)
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
          onTouchStart={handleCarouselTouchStart}
          onTouchMove={handleCarouselTouchMove}
          onTouchEnd={handleCarouselTouchEnd}
        >
          <div
            className="player-cards-grid"
            style={{
              transform: carouselWidth
                ? `translateX(${clampedCarouselIndex * -carouselWidth + carouselDrag}px)`
                : `translateX(calc(${clampedCarouselIndex * -100}% + ${carouselDrag}px))`,
            }}
          >
            {otherPlayers.map(player => {
              const argIdx = argumentOrder.indexOf(player.id)
              const isDone = argIdx !== -1 && argIdx < currentArgumentIndex
              const isSpeakingNext = argIdx !== -1 && argIdx === currentArgumentIndex + 1
              return (
                <div
                  className="player-cards-grid__slide"
                  key={player.id}
                  style={carouselWidth ? { width: carouselWidth, flex: `0 0 ${carouselWidth}px` } : undefined}
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

      {/* TEMP DEBUG — remove before done */}
      {debugEnabled && (
        <button
          onClick={dumpCarouselLayout}
          style={{
            position: 'fixed', bottom: 12, right: 12, zIndex: 99999,
            background: '#f00', color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 14px', fontSize: 14, fontWeight: 700,
          }}
        >
          🐞 Dump layout
        </button>
      )}
      {debugDump && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)',
            color: '#0f0', overflow: 'auto', padding: 12,
          }}
          onClick={() => setDebugDump(null)}
        >
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', userSelect: 'text', margin: 0 }}>{debugDump}</pre>
        </div>
      )}

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
