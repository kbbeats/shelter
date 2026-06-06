import { useEffect, useState } from 'react'

interface Props {
  duration: number
  onExpire?: () => void
}

export function Timer({ duration, onExpire }: Props) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    setRemaining(duration)
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [duration, onExpire])

  const urgent = remaining <= 10
  return (
    <span className={`timer${urgent ? ' timer--urgent' : ''}`}>
      ⏱ {remaining}s
    </span>
  )
}
