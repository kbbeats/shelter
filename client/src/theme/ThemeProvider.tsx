import { useEffect, type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'

interface Props {
  children: ReactNode
}

export function ThemeProvider({ children }: Props) {
  const scenario = useGameStore(s => s.roomState?.scenario)
  const phase = useGameStore(s => s.roomState?.phase)

  useEffect(() => {
    const root = document.documentElement
    if (scenario && phase !== 'LOBBY') {
      root.setAttribute('data-theme', scenario.id)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [scenario, phase])

  return <>{children}</>
}
