import { useEffect, type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'
import { WHEEL_SPIN_START_DELAY_MS, SPIN_DURATION_MS, GROW_DURATION_MS } from '../components/game/CatastropheReveal'

interface Props {
  children: ReactNode
}

// In random scenario mode, the wheel spins for a suspenseful while before
// landing and growing the winning segment. Delay the data-theme switch
// until that "grow" step ends (matching CatastropheReveal's own phase
// timing) so it lands exactly when the wheel's theme-wipe finishes covering
// the screen — no premature flash, no snap once the wheel exits.
const RANDOM_THEME_SWITCH_DELAY_MS = WHEEL_SPIN_START_DELAY_MS + SPIN_DURATION_MS + GROW_DURATION_MS

export function ThemeProvider({ children }: Props) {
  const scenarioId = useGameStore(s => s.roomState?.scenario?.id)
  const phase = useGameStore(s => s.roomState?.phase)
  const scenarioMode = useGameStore(s => s.roomState?.scenarioMode)

  useEffect(() => {
    const root = document.documentElement

    if (!scenarioId || phase === 'LOBBY') {
      root.removeAttribute('data-theme')
      return
    }

    if (phase === 'CATASTROPHE_REVEAL' && scenarioMode === 'random') {
      const id = setTimeout(() => {
        root.setAttribute('data-theme', scenarioId)
      }, RANDOM_THEME_SWITCH_DELAY_MS)
      return () => clearTimeout(id)
    }

    root.setAttribute('data-theme', scenarioId)
  }, [scenarioId, phase, scenarioMode])

  return <>{children}</>
}
