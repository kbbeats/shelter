import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Results from './pages/Results'
import { ThemeProvider } from './theme/ThemeProvider'
import { useGameStore } from './store/gameStore'

export default function App() {
  const { connect } = useGameStore()

  useEffect(() => {
    connect()
  }, [connect])

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lobby/:code" element={<Lobby />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="/results/:code" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
