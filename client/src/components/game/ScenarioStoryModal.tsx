import type { ScenarioPublic } from '@shelter/shared'
import DecryptedText from '../ui/DecryptedText'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

interface Props {
  scenario: ScenarioPublic
  lang: 'en' | 'ru'
  isHost: boolean
  onHostClose: () => void
  capacity: number
}

// Target total reveal time for a body paragraph, regardless of its length. A fixed tick rate
// (rather than a sub-frame-rate `speed`) keeps each tick's re-render cost reasonable — a few ms
// per character at very short speeds was pegging the main thread for the whole reveal.
const BODY_TARGET_MS = 1000
const BODY_TICK_MS = 20

export function ScenarioStoryModal({ scenario, lang, isHost, onHostClose, capacity }: Props) {
  const t = useT()

  return (
    <div className="story-screen">
      <div className="story-screen__panel">
        <div className="story-screen__eyebrow">{t('game.story.title')}</div>
        <div className="story-screen__title">
          <DecryptedText
            text={scenario.title[lang]}
            animateOn="view"
            sequential={true}
            revealDirection="center"
            speed={70}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%"
            className="story-screen__title-char--revealed"
            encryptedClassName="story-screen__title-char--encrypted"
          />
        </div>
        <div className="story-screen__body">
          {scenario.story[lang].split('\n\n').map((paragraph, i) => (
            <p key={i}>
              <DecryptedText
                text={paragraph}
                animateOn="view"
                sequential={true}
                revealDirection="center"
                speed={BODY_TICK_MS}
                charsPerTick={Math.max(1, Math.ceil(paragraph.length / (BODY_TARGET_MS / BODY_TICK_MS)))}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%"
                className="story-screen__body-char--revealed"
                encryptedClassName="story-screen__body-char--encrypted"
              />
            </p>
          ))}
        </div>
        <div className="story-screen__capacity">
          {t('game.story.capacity_line').replace('{count}', String(capacity))}
        </div>
        <div className="story-screen__footer">
          {isHost ? (
            <Button size="sm" onClick={onHostClose}>{t('game.story.close')}</Button>
          ) : (
            <span className="story-screen__waiting">{t('game.story.waiting_host')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
