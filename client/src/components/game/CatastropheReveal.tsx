import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import { ScenarioIcon } from '../icons/ScenarioIcons'
import type { ScenarioPublic } from '@shelter/shared'

const SPIN_EXTRA_TURNS = 8
export const WHEEL_SPIN_START_DELAY_MS = 30
export const SPIN_DURATION_MS = 5600
export const GROW_DURATION_MS = 500
const EXIT_DURATION_MS = 300

const PIE_CENTER = 100
const PIE_RADIUS = 90
const ICON_RADIUS = 60

type WheelPhase = 'idle' | 'spinning' | 'grow' | 'exit' | 'done'

function polarPoint(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: PIE_CENTER + r * Math.sin(rad),
    y: PIE_CENTER - r * Math.cos(rad),
  }
}

// --- Per-scenario "washed" wheel gradient stops ---

const WHEEL_GRADIENTS: Record<string, { type: 'radial' | 'linear'; stops: [string, string, string] }> = {
  'nuclear-war':        { type: 'radial', stops: ['#E0B01A', '#6E6A57', '#7A3324'] },
  pandemic:             { type: 'radial', stops: ['#4F9E55', '#8C9590', '#7A3B3B'] },
  'asteroid-impact':    { type: 'linear', stops: ['#7C5FC2', '#4A4A52', '#B5651D'] },
  'climate-collapse':   { type: 'radial', stops: ['#2E96A0', '#7A8270', '#3A5A52'] },
  'zombie-apocalypse':  { type: 'linear', stops: ['#7E9A2E', '#6E6E64', '#7A2B2B'] },
  'ai-takeover':        { type: 'radial', stops: ['#3A6FB5', '#5A6068', '#8A3030'] },
  'volcanic-winter':    { type: 'linear', stops: ['#C2421E', '#7D7368', '#3A2E26'] },
  'solar-flare':        { type: 'radial', stops: ['#D9791A', '#8A8278', '#4A3826'] },
}

function ScenarioWheel({
  scenarioList,
  winnerIndex,
  phase,
  rotation,
}: {
  scenarioList: ScenarioPublic[]
  winnerIndex: number
  phase: WheelPhase
  rotation: number
}) {
  const n = scenarioList.length
  const anglePer = 360 / n
  const transition =
    phase === 'spinning' ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.08, 0.82, 0.13, 1)` : 'none'
  const landed = phase === 'grow' || phase === 'exit'

  const winnerStart = polarPoint(anglePer * winnerIndex, PIE_RADIUS)
  const winnerEnd = polarPoint(anglePer * (winnerIndex + 1), PIE_RADIUS)
  const winnerLargeArc = anglePer > 180 ? 1 : 0
  const winnerD = `M ${PIE_CENTER} ${PIE_CENTER} L ${winnerStart.x} ${winnerStart.y} A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${winnerLargeArc} 1 ${winnerEnd.x} ${winnerEnd.y} Z`

  return (
    <div className={`scenario-wheel${phase === 'exit' ? ' scenario-wheel--exiting' : ''}`}>
      <div className="scenario-wheel__indicator" aria-hidden="true" />
      <div
        className="scenario-wheel__ring"
        style={{ transform: `rotate(${rotation}deg)`, transition }}
      >
        <svg className="scenario-wheel__pie" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <filter id="wheel-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
              <feColorMatrix
                in="noise"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0.3 0.3 0 0"
                result="alphaNoise"
              />
              <feComposite in="alphaNoise" in2="SourceGraphic" operator="in" />
            </filter>
            {scenarioList.map((s, i) => {
              const grad = WHEEL_GRADIENTS[s.id]
              if (!grad) return null
              const midAngle = anglePer * i + anglePer / 2
              const [c0, c1, c2] = grad.stops
              if (grad.type === 'radial') {
                const center = polarPoint(midAngle, PIE_RADIUS * 0.15)
                return (
                  <radialGradient
                    key={s.id}
                    id={`wheel-grad-${s.id}`}
                    gradientUnits="userSpaceOnUse"
                    cx={center.x}
                    cy={center.y}
                    r={PIE_RADIUS * 0.95}
                  >
                    <stop offset="0%" stopColor={c2} />
                    <stop offset="35%" stopColor={c1} />
                    <stop offset="100%" stopColor={c0} />
                  </radialGradient>
                )
              }
              const edge = polarPoint(midAngle, PIE_RADIUS)
              return (
                <linearGradient
                  key={s.id}
                  id={`wheel-grad-${s.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1={PIE_CENTER}
                  y1={PIE_CENTER}
                  x2={edge.x}
                  y2={edge.y}
                >
                  <stop offset="0%" stopColor={c2} />
                  <stop offset="35%" stopColor={c1} />
                  <stop offset="100%" stopColor={c0} />
                </linearGradient>
              )
            })}
          </defs>
          {scenarioList.map((s, i) => {
            const start = polarPoint(anglePer * i, PIE_RADIUS)
            const end = polarPoint(anglePer * (i + 1), PIE_RADIUS)
            const largeArc = anglePer > 180 ? 1 : 0
            const d = `M ${PIE_CENTER} ${PIE_CENTER} L ${start.x} ${start.y} A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
            return (
              <g key={s.id}>
                <path d={d} className="scenario-wheel__slice" style={{ fill: `url(#wheel-grad-${s.id})` }} />
                <path
                  d={d}
                  className="scenario-wheel__slice-grain"
                  fill="#ffffff"
                  filter="url(#wheel-grain)"
                />
              </g>
            )
          })}
          {landed && (
            <path
              d={winnerD}
              className="scenario-wheel__slice scenario-wheel__slice--winner"
              style={{ fill: `url(#wheel-grad-${scenarioList[winnerIndex]?.id})` }}
            />
          )}
        </svg>
        {scenarioList.map((s, i) => {
          const midAngle = anglePer * i + anglePer / 2
          const pos = polarPoint(midAngle, ICON_RADIUS)
          const left = (pos.x / (PIE_CENTER * 2)) * 100
          const top = (pos.y / (PIE_CENTER * 2)) * 100
          const isWinner = i === winnerIndex

          return (
            <div key={s.id} className="scenario-wheel__slice-icon-wrap" style={{ left: `${left}%`, top: `${top}%` }}>
              <div className="scenario-wheel__slice-icon-rotator" style={{ transform: `rotate(${-rotation}deg)`, transition }}>
                <div
                  className={`scenario-wheel__slice-icon${isWinner && landed ? ' scenario-wheel__slice-icon--winner' : ''}`}
                >
                  <ScenarioIcon id={s.id} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="scenario-wheel__hub" aria-hidden="true" />
    </div>
  )
}

export function CatastropheReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)
  const scenarioList = useGameStore(s => s.scenarioList)
  const getScenarios = useGameStore(s => s.getScenarios)

  const isRandomMode = roomState?.scenarioMode === 'random'
  const [wheelPhase, setWheelPhase] = useState<WheelPhase>(isRandomMode ? 'idle' : 'done')
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (isRandomMode && scenarioList.length === 0) getScenarios()
  }, [isRandomMode, scenarioList.length, getScenarios])

  useEffect(() => {
    if (!isRandomMode || wheelPhase !== 'idle' || scenarioList.length === 0 || !roomState?.scenario) return

    const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === roomState.scenario!.id))
    const anglePer = 360 / scenarioList.length
    const winnerMidAngle = anglePer * winnerIndex + anglePer / 2
    // Indicator sits at the 3 o'clock position (90deg in our polar convention)
    const target = (((90 - winnerMidAngle) % 360) + 360) % 360 + 360 * SPIN_EXTRA_TURNS

    const id = setTimeout(() => {
      setRotation(target)
      setWheelPhase('spinning')
    }, WHEEL_SPIN_START_DELAY_MS)
    return () => clearTimeout(id)
  }, [isRandomMode, wheelPhase, scenarioList, roomState?.scenario])

  useEffect(() => {
    if (wheelPhase === 'spinning') {
      const id = setTimeout(() => setWheelPhase('grow'), SPIN_DURATION_MS)
      return () => clearTimeout(id)
    }
    if (wheelPhase === 'grow') {
      const id = setTimeout(() => setWheelPhase('exit'), GROW_DURATION_MS)
      return () => clearTimeout(id)
    }
    if (wheelPhase === 'exit') {
      const id = setTimeout(() => setWheelPhase('done'), EXIT_DURATION_MS)
      return () => clearTimeout(id)
    }
  }, [wheelPhase])

  if (!roomState || roomState.phase !== 'CATASTROPHE_REVEAL' || !roomState.scenario) return null

  const { scenario } = roomState
  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost

  const wheelDrawing = isRandomMode && (wheelPhase === 'idle' || wheelPhase === 'spinning' || wheelPhase === 'grow')
  const showWheelChrome = isRandomMode && wheelPhase !== 'done'
  const showContent = !isRandomMode || wheelPhase === 'exit' || wheelPhase === 'done'
  const showThemeWipe = isRandomMode && (wheelPhase === 'grow' || wheelPhase === 'exit' || wheelPhase === 'done')
  const showBgPattern = isRandomMode && (wheelPhase === 'idle' || wheelPhase === 'spinning')
  const cameFromWheel = isRandomMode

  const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === scenario.id))

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      {showBgPattern && <div className="scenario-wheel__bg-pattern" aria-hidden="true" />}

      <div className={`catastrophe-reveal__eyebrow${wheelDrawing ? ' catastrophe-reveal__eyebrow--wheel' : ''}`}>
        {wheelDrawing ? t('game.catastrophe.drawing') : t('game.catastrophe.title')}
      </div>

      {showThemeWipe && (
        <div
          className="scenario-wheel__theme-wipe"
          style={{ background: scenario.theme.bgColor }}
          aria-hidden="true"
        />
      )}

      {showWheelChrome && scenarioList.length > 0 && (
        <ScenarioWheel
          scenarioList={scenarioList}
          winnerIndex={winnerIndex}
          phase={wheelPhase}
          rotation={rotation}
        />
      )}

      {showContent && (
        <>
          <div
            className={`catastrophe-reveal__icon${cameFromWheel ? ' catastrophe-reveal__icon--quick' : ''}`}
          >
            <ScenarioIcon id={scenario.id} />
          </div>
          <h1 className={`catastrophe-reveal__title${cameFromWheel ? ' catastrophe-reveal__title--quick' : ''}`}>
            {scenario.title[lang]}
          </h1>
          <p className={`catastrophe-reveal__desc${cameFromWheel ? ' catastrophe-reveal__desc--quick' : ''}`}>
            {scenario.catastropheDescription[lang]}
          </p>
          <div className={`catastrophe-reveal__actions${cameFromWheel ? ' catastrophe-reveal__actions--quick' : ''}`}>
            {isHost ? (
              <Button size="lg" onClick={nextPhase}>{t('game.catastrophe.continue')}</Button>
            ) : (
              <p className="dim mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                {t('game.catastrophe.waiting')}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
