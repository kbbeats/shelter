import { useState } from 'react'
import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { getInitials } from '../../utils/avatar'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
}

export function PlayerCard({ player, categories, lang, isHighlighted }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={[
        'id-card',
        isHighlighted ? 'id-card--highlighted' : '',
        !player.isAlive ? 'id-card--exiled' : '',
        expanded ? 'id-card--expanded' : '',
      ].filter(Boolean).join(' ')}
      onClick={() => { if (!expanded) setExpanded(true) }}
    >
      <div
        className="id-card__header"
        onClick={e => { if (expanded) { e.stopPropagation(); setExpanded(false) } }}
      >
        <span className={`avatar id-card__avatar${isHighlighted ? ' avatar--active' : ''}`}>
          {getInitials(player.name)}
        </span>
        <span className="id-card__name">{player.name}</span>
        {!player.isAlive && (
          <span className="pill pill--danger id-card__exiled-pill">Exiled</span>
        )}
        <div className="id-card__dots" aria-hidden="true">
          {categories.map(cat => {
            const isRevealed = player.maskedCards[cat.id]?.isRevealed ?? false
            return (
              <span
                key={cat.id}
                className={`id-card__dot${isRevealed ? ' id-card__dot--revealed' : ''}`}
                title={cat.name[lang]}
              />
            )
          })}
        </div>
        <button
          className="id-card__toggle"
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
          aria-label={expanded ? 'Collapse card' : 'Expand card'}
          aria-expanded={expanded}
        >
          {expanded ? '▴' : '▾'}
        </button>
      </div>
      <div className="id-card__attrs">
        {categories.map(cat => {
          const masked = player.maskedCards[cat.id]
          const isRevealed = masked?.isRevealed ?? false
          const value = isRevealed && masked?.card ? masked.card.label[lang] : null
          return (
            <div key={cat.id} className="id-card__attr">
              <span className="id-card__attr-label">{cat.icon} {cat.name[lang]}</span>
              {isRevealed ? (
                <span className="id-card__attr-val">{value}</span>
              ) : (
                <span className="pill pill--neutral">Hidden</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
