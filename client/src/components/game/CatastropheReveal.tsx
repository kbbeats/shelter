import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import type { ScenarioPublic } from '@shelter/shared'

const SPIN_EXTRA_TURNS = 8
const SPIN_DURATION_MS = 5600
const ZOOM_DURATION_MS = 900
const EXIT_DURATION_MS = 650
const ZOOM_FILL_RATIO = 0.78

const PIE_CENTER = 100
const PIE_RADIUS = 90
const ICON_RADIUS = 60

type WheelPhase = 'idle' | 'spinning' | 'zoom' | 'exit' | 'done'

function polarPoint(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: PIE_CENTER + r * Math.sin(rad),
    y: PIE_CENTER - r * Math.cos(rad),
  }
}

function ScenarioWheel({
  scenarioList,
  winnerIndex,
  phase,
  rotation,
  winnerBadgeRef,
}: {
  scenarioList: ScenarioPublic[]
  winnerIndex: number
  phase: WheelPhase
  rotation: number
  winnerBadgeRef: React.RefObject<HTMLDivElement>
}) {
  const n = scenarioList.length
  const anglePer = 360 / n
  const transition =
    phase === 'spinning' ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.08, 0.82, 0.13, 1)` : 'none'
  const landed = phase === 'zoom' || phase === 'exit'

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
                className={`scenario-wheel__slice scenario-wheel__slice--${i % 2 === 0 ? 'a' : 'b'}`}
              />
            )
          })}
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
                  ref={isWinner ? winnerBadgeRef : undefined}
                  className={`scenario-wheel__slice-icon${isWinner && landed ? ' scenario-wheel__slice-icon--winner' : ''}`}
                >
                  {s.theme.icon}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="scenario-wheel__hub">
        <svg className="scenario-wheel__hub-icon" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="scenario-wheel__hub-ring" cx="50" cy="50" r="45" />
          <g className="scenario-wheel__hub-blades">
            <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" />
            <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(120 50 50)" />
            <path d="M60.69 44.55 L85.64 31.84 A40 40 0 0 1 85.64 68.16 L60.69 55.45 A12 12 0 0 0 60.69 44.55 Z" transform="rotate(240 50 50)" />
          </g>
          <circle className="scenario-wheel__hub-core" cx="50" cy="50" r="10" />
        </svg>
      </div>
    </div>
  )
}

function ZoomIcon({
  icon,
  rect,
  phase,
  sliceVariant,
}: {
  icon: string
  rect: DOMRect | null
  phase: WheelPhase
  sliceVariant: 'a' | 'b'
}) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (phase !== 'zoom' || !rect) return
    const id = setTimeout(() => setArmed(true), 30)
    return () => clearTimeout(id)
  }, [phase, rect])

  if (!rect) return null

  const targetSize = Math.min(window.innerWidth, window.innerHeight) * ZOOM_FILL_RATIO
  const scale = targetSize / rect.width

  const style: React.CSSProperties = armed
    ? {
        top: '50%',
        left: '50%',
        width: rect.width,
        height: rect.height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: phase === 'exit' ? 0 : 1,
        transition:
          phase === 'exit'
            ? `opacity ${EXIT_DURATION_MS}ms ease`
            : `top ${ZOOM_DURATION_MS}ms cubic-bezier(0.3, 0, 0.2, 1), left ${ZOOM_DURATION_MS}ms cubic-bezier(0.3, 0, 0.2, 1), transform ${ZOOM_DURATION_MS}ms cubic-bezier(0.3, 0, 0.2, 1)`,
      }
    : {
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
        width: rect.width,
        height: rect.height,
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1,
        transition: 'none',
      }

  return (
    <div className={`scenario-wheel__zoom-icon scenario-wheel__zoom-icon--slice-${sliceVariant}`} style={style} aria-hidden="true">
      {icon}
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
  const [overlayRect, setOverlayRect] = useState<DOMRect | null>(null)
  const winnerBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isRandomMode && scenarioList.length === 0) getScenarios()
  }, [isRandomMode, scenarioList.length, getScenarios])

  useEffect(() => {
    if (!isRandomMode || wheelPhase !== 'idle' || scenarioList.length === 0 || !roomState?.scenario) return

    const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === roomState.scenario!.id))
    const anglePer = 360 / scenarioList.length
    const winnerMidAngle = anglePer * winnerIndex + anglePer / 2
    const target = ((360 - winnerMidAngle) % 360) + 360 * SPIN_EXTRA_TURNS

    const id = setTimeout(() => {
      setRotation(target)
      setWheelPhase('spinning')
    }, 30)
    return () => clearTimeout(id)
  }, [isRandomMode, wheelPhase, scenarioList, roomState?.scenario])

  useEffect(() => {
    if (wheelPhase === 'spinning') {
      const id = setTimeout(() => setWheelPhase('zoom'), SPIN_DURATION_MS)
      return () => clearTimeout(id)
    }
    if (wheelPhase === 'zoom') {
      if (winnerBadgeRef.current) setOverlayRect(winnerBadgeRef.current.getBoundingClientRect())
      const id = setTimeout(() => setWheelPhase('exit'), ZOOM_DURATION_MS)
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

  const wheelDrawing = isRandomMode && (wheelPhase === 'idle' || wheelPhase === 'spinning' || wheelPhase === 'zoom')
  const showWheelChrome = isRandomMode && wheelPhase !== 'done'
  const showOverlay = isRandomMode && (wheelPhase === 'zoom' || wheelPhase === 'exit')
  const showContent = !isRandomMode || wheelPhase === 'exit' || wheelPhase === 'done'
  const cameFromWheel = isRandomMode

  const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === scenario.id))

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      <div className="catastrophe-reveal__eyebrow">
        {wheelDrawing ? t('game.catastrophe.drawing') : t('game.catastrophe.title')}
      </div>

      {showWheelChrome && scenarioList.length > 0 && (
        <ScenarioWheel
          scenarioList={scenarioList}
          winnerIndex={winnerIndex}
          phase={wheelPhase}
          rotation={rotation}
          winnerBadgeRef={winnerBadgeRef}
        />
      )}

      {showOverlay && (
        <ZoomIcon
          icon={scenario.theme.icon}
          rect={overlayRect}
          phase={wheelPhase}
          sliceVariant={winnerIndex % 2 === 0 ? 'a' : 'b'}
        />
      )}

      {showContent && (
        <>
          <div className={`catastrophe-reveal__icon${cameFromWheel ? ' catastrophe-reveal__icon--zoom-in' : ''}`}>
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
