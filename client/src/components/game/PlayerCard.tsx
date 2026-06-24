import { useState } from 'react'
import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { useT } from '../../i18n'
import { CARD_ICON_MAP } from '../../assets/card-icons'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
  isDone?: boolean
  isSpeakingNext?: boolean
}

type Status = 'speaking' | 'exiled' | 'done' | 'next' | 'wait'

export function PlayerCard({ player, categories, lang, isHighlighted, isDone, isSpeakingNext }: Props) {
  const t = useT()
  const [collapsed, setCollapsed] = useState(false)

  const status: Status =
    !player.isAlive ? 'exiled'
    : isHighlighted ? 'speaking'
    : isDone ? 'done'
    : isSpeakingNext ? 'next'
    : 'wait'

  const statusLabel: Record<Status, string> = {
    speaking: t('game.status.speaking'),
    exiled: t('exile.title'),
    done: t('game.status.done'),
    next: t('game.next'),
    wait: t('game.status.wait'),
  }

  return (
    <div
      className={[
        'id-card',
        isHighlighted ? 'id-card--highlighted' : '',
        !player.isAlive ? 'id-card--exiled' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="id-card__header">
        <span className="id-card__name">{player.name}</span>
        <span className={`id-card__status id-card__status--${status}`}>[{statusLabel[status]}]</span>
        <button
          className="id-card__collapse-btn"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? t('game.card.expand') : t('game.card.collapse')}
          aria-expanded={!collapsed}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      {!collapsed && (
        <div className="player-drawer__attrs">
          {categories.map(cat => {
            const masked = player.maskedCards[cat.id]
            const isRevealed = masked?.isRevealed ?? false
            const value = isRevealed && masked?.card ? masked.card.label[lang] : null
            return (
              <div key={cat.id} className="player-drawer__attr">
                <span className="player-drawer__attr-label">{CARD_ICON_MAP[cat.id] ? <img src={CARD_ICON_MAP[cat.id]} alt="" aria-hidden="true" className="card-cat-icon" /> : cat.icon} {cat.name[lang]}</span>
                {isRevealed ? (
                  <span className="player-drawer__attr-val">{value}</span>
                ) : (
                  <span className="pill pill--neutral">{t('game.hidden')}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
