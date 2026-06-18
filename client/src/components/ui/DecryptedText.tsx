import { useEffect, useState, useRef, useMemo, useCallback } from 'react'

const wrapperStyle: React.CSSProperties = { display: 'inline-block', whiteSpace: 'pre-wrap' }
const srOnlyStyle: React.CSSProperties = {
  position: 'absolute', width: '1px', height: '1px', padding: 0,
  margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0
}

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click'
  clickMode?: 'once' | 'toggle'
}

export default function DecryptedText({
  text, speed = 50, maxIterations = 10, sequential = false,
  revealDirection = 'start', useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '', parentClassName = '', encryptedClassName = '',
  animateOn = 'hover', clickMode = 'once',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>())
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click')
  const [direction, setDirection] = useState('forward')
  const containerRef = useRef<HTMLSpanElement>(null)
  const orderRef = useRef<number[]>([])
  const pointerRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const availableChars = useMemo(() =>
    useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c => c !== ' ')
      : characters.split(''),
    [useOriginalCharsOnly, text, characters])

  const shuffleText = useCallback((orig: string, revealed: Set<number>) =>
    orig.split('').map((char, i) => {
      if (char === ' ') return ' '
      if (revealed.has(i)) return orig[i]
      return availableChars[Math.floor(Math.random() * availableChars.length)]
    }).join(''), [availableChars])

  const computeOrder = useCallback((len: number) => {
    const order: number[] = []
    if (len <= 0) return order
    if (revealDirection === 'start') { for (let i = 0; i < len; i++) order.push(i); return order }
    if (revealDirection === 'end') { for (let i = len - 1; i >= 0; i--) order.push(i); return order }
    const middle = Math.floor(len / 2); let offset = 0
    while (order.length < len) {
      if (offset % 2 === 0) { const idx = middle + offset / 2; if (idx >= 0 && idx < len) order.push(idx) }
      else { const idx = middle - Math.ceil(offset / 2); if (idx >= 0 && idx < len) order.push(idx) }
      offset++
    }
    return order.slice(0, len)
  }, [revealDirection])

  const fillAllIndices = useCallback(() => { const s = new Set<number>(); for (let i = 0; i < text.length; i++) s.add(i); return s }, [text])
  const removeRandomIndices = useCallback((set: Set<number>, count: number) => {
    const arr = Array.from(set)
    for (let i = 0; i < count && arr.length > 0; i++) arr.splice(Math.floor(Math.random() * arr.length), 1)
    return new Set(arr)
  }, [])
  const encryptInstantly = useCallback(() => { const e = new Set<number>(); setRevealedIndices(e); setDisplayText(shuffleText(text, e)); setIsDecrypted(false) }, [text, shuffleText])
  const triggerDecrypt = useCallback(() => {
    if (sequential) { orderRef.current = computeOrder(text.length); pointerRef.current = 0; setRevealedIndices(new Set()) }
    else setRevealedIndices(new Set())
    setDirection('forward'); setIsAnimating(true)
  }, [sequential, computeOrder, text.length])
  const triggerReverse = useCallback(() => {
    if (sequential) { orderRef.current = computeOrder(text.length).slice().reverse(); pointerRef.current = 0; setRevealedIndices(fillAllIndices()); setDisplayText(shuffleText(text, fillAllIndices())) }
    else { setRevealedIndices(fillAllIndices()); setDisplayText(shuffleText(text, fillAllIndices())) }
    setDirection('reverse'); setIsAnimating(true)
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text])

  useEffect(() => {
    if (!isAnimating) return
    let iter = 0
    const getNext = (r: Set<number>) => {
      if (revealDirection === 'start') return r.size
      if (revealDirection === 'end') return text.length - 1 - r.size
      const mid = Math.floor(text.length / 2), off = Math.floor(r.size / 2)
      const ni = r.size % 2 === 0 ? mid + off : mid - off - 1
      if (ni >= 0 && ni < text.length && !r.has(ni)) return ni
      for (let i = 0; i < text.length; i++) if (!r.has(i)) return i
      return 0
    }
    intervalRef.current = setInterval(() => {
      setRevealedIndices(prev => {
        if (sequential) {
          if (direction === 'forward') {
            if (prev.size < text.length) { const ni = getNext(prev); const nr = new Set(prev); nr.add(ni); setDisplayText(shuffleText(text, nr)); return nr }
            clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(true); return prev
          }
          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const ri = orderRef.current[pointerRef.current++]; const nr = new Set(prev); nr.delete(ri); setDisplayText(shuffleText(text, nr))
              if (nr.size === 0) { clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false) }
              return nr
            }
            clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false); return prev
          }
        } else {
          if (direction === 'forward') {
            setDisplayText(shuffleText(text, prev)); iter++
            if (iter >= maxIterations) { clearInterval(intervalRef.current!); setIsAnimating(false); setDisplayText(text); setIsDecrypted(true) }
            return prev
          }
          if (direction === 'reverse') {
            let cur = prev; if (cur.size === 0) cur = fillAllIndices()
            const rc = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)))
            const ns = removeRandomIndices(cur, rc); setDisplayText(shuffleText(text, ns)); iter++
            if (ns.size === 0 || iter >= maxIterations) { clearInterval(intervalRef.current!); setIsAnimating(false); setIsDecrypted(false); setDisplayText(shuffleText(text, new Set())); return new Set() }
            return ns
          }
        }
        return prev
      })
    }, speed)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isAnimating, text, speed, maxIterations, sequential, revealDirection, shuffleText, direction, fillAllIndices, removeRandomIndices])

  const handleClick = () => {
    if (animateOn !== 'click') return
    if (clickMode === 'once') { if (isDecrypted) return; setDirection('forward'); triggerDecrypt() }
    if (clickMode === 'toggle') { if (isDecrypted) triggerReverse(); else { setDirection('forward'); triggerDecrypt() } }
  }
  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return
    setRevealedIndices(new Set()); setIsDecrypted(false); setDisplayText(text); setDirection('forward'); setIsAnimating(true)
  }, [isAnimating, text])
  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsAnimating(false); setRevealedIndices(new Set()); setDisplayText(text); setIsDecrypted(true); setDirection('forward')
  }, [text])

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && !hasAnimated) { triggerDecrypt(); setHasAnimated(true) } })
    }, { threshold: 0.1 })
    const cur = containerRef.current; if (cur) obs.observe(cur)
    return () => { if (cur) obs.unobserve(cur) }
  }, [animateOn, hasAnimated, triggerDecrypt])

  useEffect(() => {
    if (animateOn === 'click') encryptInstantly()
    else { setDisplayText(text); setIsDecrypted(true) }
    setRevealedIndices(new Set()); setDirection('forward')
  }, [animateOn, text, encryptInstantly])

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
      : animateOn === 'click' ? { onClick: handleClick } : {}

  return (
    <span className={parentClassName} ref={containerRef} style={wrapperStyle} {...animateProps}>
      <span style={srOnlyStyle}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const done = revealedIndices.has(index) || (!isAnimating && isDecrypted)
          return <span key={index} className={done ? className : encryptedClassName}>{char}</span>
        })}
      </span>
    </span>
  )
}
