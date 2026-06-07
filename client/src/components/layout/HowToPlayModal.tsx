import { useEffect, useRef, useState } from 'react'
import { useT } from '../../i18n'

const STEPS = [
  { icon: '☣️', titleKey: 'howToPlay.step.catastrophe.title', bodyKey: 'howToPlay.step.catastrophe.body' },
  { icon: '🪪', titleKey: 'howToPlay.step.character.title', bodyKey: 'howToPlay.step.character.body' },
  { icon: '🗣️', titleKey: 'howToPlay.step.argue.title', bodyKey: 'howToPlay.step.argue.body' },
  { icon: '🗳️', titleKey: 'howToPlay.step.vote.title', bodyKey: 'howToPlay.step.vote.body' },
  { icon: '🚪', titleKey: 'howToPlay.step.survive.title', bodyKey: 'howToPlay.step.survive.body' },
]

interface StepProps {
  icon: string
  title: string
  body: string
  index: number
}

function Step({ icon, title, body, index }: StepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`how-to-play__step${visible ? ' how-to-play__step--visible' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="how-to-play__step-icon">{icon}</div>
      <div className="how-to-play__step-content">
        <h2 className="how-to-play__step-title">{title}</h2>
        <p className="how-to-play__step-body">{body}</p>
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function HowToPlayModal({ isOpen, onClose }: Props) {
  const t = useT()

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="how-to-play-modal__backdrop" onClick={onClose}>
      <div className="how-to-play-modal__panel" onClick={e => e.stopPropagation()}>
        <button className="btn btn--ghost btn--sm how-to-play-modal__close" onClick={onClose}>✕</button>

        <div className="how-to-play__hero">
          <h1 className="how-to-play__title">{t('howToPlay.title')}</h1>
          <p className="how-to-play__subtitle">{t('howToPlay.subtitle')}</p>
        </div>

        <div className="how-to-play__steps">
          {STEPS.map((step, index) => (
            <Step
              key={step.titleKey}
              icon={step.icon}
              title={t(step.titleKey)}
              body={t(step.bodyKey)}
              index={index}
            />
          ))}
        </div>

        <button className="btn btn--primary btn--lg how-to-play__start" onClick={onClose}>
          {t('howToPlay.close')}
        </button>
      </div>
    </div>
  )
}
