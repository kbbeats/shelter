import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import type { ScenarioPublic } from '@shelter/shared'

const SPIN_DELAYS = [70, 70, 80, 90, 100, 110, 130, 150, 170, 200, 230, 260, 300]

export function CatastropheReveal() {
  const t = useT()
  const roomState = useGameStore(s => s.roomState)
  const mySocketId = useGameStore(s => s.mySocketId)
  const nextPhase = useGameStore(s => s.nextPhase)
  const lang = useGameStore(s => s.language)
  const scenarioList = useGameStore(s => s.scenarioList)
  const getScenarios = useGameStore(s => s.getScenarios)

  const isRandomMode = roomState?.scenarioMode === 'random'
  const [spinning, setSpinning] = useState(isRandomMode)
  const [spinFrame, setSpinFrame] = useState<ScenarioPublic | null>(null)
  const [spinTick, setSpinTick] = useState(0)

  useEffect(() => {
    if (isRandomMode && scenarioList.length === 0) getScenarios()
  }, [isRandomMode, scenarioList.length, getScenarios])

  useEffect(() => {
    if (!isRandomMode || scenarioList.length === 0) {
      setSpinning(false)
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>
    let i = 0

    const step = () => {
      if (cancelled) return
      setSpinFrame(scenarioList[Math.floor(Math.random() * scenarioList.length)])
      setSpinTick(tick => tick + 1)
      if (i < SPIN_DELAYS.length) {
        timeoutId = setTimeout(step, SPIN_DELAYS[i])
        i++
      } else {
        setSpinning(false)
      }
    }

    step()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [isRandomMode, scenarioList])

  if (!roomState || roomState.phase !== 'CATASTROPHE_REVEAL' || !roomState.scenario) return null

  const { scenario } = roomState
  const isHost = roomState.players.find(p => p.id === mySocketId)?.isHost
  const showSpin = isRandomMode && spinning

  return (
    <div className="fullscreen-overlay catastrophe-reveal">
      <div className="catastrophe-reveal__eyebrow">{t('game.catastrophe.title')}</div>

      {showSpin && spinFrame ? (
        <>
          <div key={`icon-${spinTick}`} className="catastrophe-reveal__icon catastrophe-reveal__icon--spinning">
            {spinFrame.theme.icon}
          </div>
          <h1 key={`title-${spinTick}`} className="catastrophe-reveal__title catastrophe-reveal__title--spinning">
            {spinFrame.title[lang]}
          </h1>
        </>
      ) : (
        <>
          <div className="catastrophe-reveal__icon">{scenario.theme.icon}</div>
          <h1 className="catastrophe-reveal__title">{scenario.title[lang]}</h1>
        </>
      )}

      {!showSpin && (
        <>
          <p className={`catastrophe-reveal__desc${isRandomMode ? ' catastrophe-reveal__desc--post-spin' : ''}`}>
            {scenario.catastropheDescription[lang]}
          </p>
          <div className={`catastrophe-reveal__actions${isRandomMode ? ' catastrophe-reveal__actions--post-spin' : ''}`}>
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
