import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import type { ScenarioPublic } from '@shelter/shared'

const WHEEL_RADIUS = 124
const SPIN_EXTRA_TURNS = 5
const SPIN_DURATION_MS = 3600
const ZOOM_DURATION_MS = 700
const EXIT_DURATION_MS = 400

type WheelPhase = 'idle' | 'spinning' | 'zoom' | 'exit' | 'done'

function ScenarioWheel({
  scenarioList,
  winnerIndex,
  lang,
  phase,
  rotation,
  appTitle,
}: {
  scenarioList: ScenarioPublic[]
  winnerIndex: number
  lang: 'en' | 'ru'
  phase: WheelPhase
  rotation: number
  appTitle: string
}) {
  const n = scenarioList.length
  const anglePer = 360 / n
  const transition =
    phase === 'spinning' ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.6, 0.2, 1)` : 'none'

  return (
    <div className={`scenario-wheel${phase === 'exit' ? ' scenario-wheel--exiting' : ''}`}>
      <div className="scenario-wheel__indicator" aria-hidden="true" />
      <div
        className="scenario-wheel__ring"
        style={{ transform: `rotate(${rotation}deg)`, transition }}
      >
        {scenarioList.map((s, i) => {
          const rad = ((anglePer * i) * Math.PI) / 180
          const left = 50 + 50 * (WHEEL_RADIUS / 160) * Math.sin(rad)
          const top = 50 - 50 * (WHEEL_RADIUS / 160) * Math.cos(rad)
          const isWinner = i === winnerIndex && phase !== 'spinning'

          return (
            <div key={s.id} className="scenario-wheel__badge" style={{ left: `${left}%`, top: `${top}%` }}>
              <div className="scenario-wheel__badge-rotator" style={{ transform: `rotate(${-rotation}deg)`, transition }}>
                <div className={`scenario-wheel__badge-icon${isWinner ? ' scenario-wheel__badge-icon--winner' : ''}`}>
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
        <span className="scenario-wheel__hub-title">{appTitle}</span>
      </div>
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
    const target = ((360 - anglePer * winnerIndex) % 360) + 360 * SPIN_EXTRA_TURNS

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
  const showWheel = isRandomMode && wheelPhase !== 'done'

  const winnerIndex = Math.max(0, scenarioList.findIndex(s => s.id === scenario.id))

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      <div className="catastrophe-reveal__eyebrow">
        {showWheel ? t('game.catastrophe.drawing') : t('game.catastrophe.title')}
      </div>

      {showWheel && scenarioList.length > 0 ? (
        <ScenarioWheel
          scenarioList={scenarioList}
          winnerIndex={winnerIndex}
          lang={lang}
          phase={wheelPhase}
          rotation={rotation}
          appTitle={t('app.title')}
        />
      ) : (
        <>
          <div className="catastrophe-reveal__icon">{scenario.theme.icon}</div>
          <h1 className="catastrophe-reveal__title">{scenario.title[lang]}</h1>
          <p className="catastrophe-reveal__desc">{scenario.catastropheDescription[lang]}</p>
          <div className="catastrophe-reveal__actions">
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
