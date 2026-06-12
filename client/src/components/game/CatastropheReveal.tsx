import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
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

// --- Slice color derivation (per-scenario theme.primaryColor, with collision avoidance) ---

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  return { h, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b)
  return Math.min(d, 360 - d)
}

const SLICE_HUE_THRESHOLD = 20
const SLICE_LIGHTNESS_THRESHOLD = 15
const SLICE_HUE_NUDGE = 35
const SLICE_MIN_SAT = 55
const SLICE_MAX_SAT = 90
const SLICE_MIN_LIGHT = 40
const SLICE_MAX_LIGHT = 65

function getDistinctSliceColors(primaryColors: string[]): string[] {
  const placed: { h: number; s: number; l: number }[] = []

  for (const hex of primaryColors) {
    const hsl = hexToHsl(hex)
    let h = hsl.h
    const s = Math.min(Math.max(hsl.s, SLICE_MIN_SAT), SLICE_MAX_SAT)
    const l = Math.min(Math.max(hsl.l, SLICE_MIN_LIGHT), SLICE_MAX_LIGHT)

    let attempts = 0
    while (
      placed.some(c => hueDistance(c.h, h) < SLICE_HUE_THRESHOLD && Math.abs(c.l - l) < SLICE_LIGHTNESS_THRESHOLD) &&
      attempts < 6
    ) {
      h = (h + SLICE_HUE_NUDGE) % 360
      attempts++
    }

    placed.push({ h, s, l })
  }

  return placed.map(c => hslToHex(c.h, c.s, c.l))
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

  const sliceColors = useMemo(
    () => getDistinctSliceColors(scenarioList.map(s => s.theme.primaryColor)),
    [scenarioList],
  )

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
          {scenarioList.map((s, i) => {
            const start = polarPoint(anglePer * i, PIE_RADIUS)
            const end = polarPoint(anglePer * (i + 1), PIE_RADIUS)
            const largeArc = anglePer > 180 ? 1 : 0
            const d = `M ${PIE_CENTER} ${PIE_CENTER} L ${start.x} ${start.y} A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
            return (
              <path
                key={s.id}
                d={d}
                className="scenario-wheel__slice"
                style={{ fill: sliceColors[i] }}
              />
            )
          })}
          {landed && (
            <path
              d={winnerD}
              className="scenario-wheel__slice scenario-wheel__slice--winner"
              style={{ fill: sliceColors[winnerIndex] }}
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
                  {s.theme.icon}
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
  const cameFromWheel = isRandomMode

  const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === scenario.id))

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      <div className="catastrophe-reveal__eyebrow">
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
          <div className={`catastrophe-reveal__icon${cameFromWheel ? ' catastrophe-reveal__icon--quick' : ''}`}>
            {scenario.theme.icon}
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
