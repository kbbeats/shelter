import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { getInitials } from '../../utils/avatar'
import { useT } from '../../i18n'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
  isDone?: boolean
  isSpeakingNext?: boolean
  onClick?: () => void
}

export function PlayerCard({ player, categories, lang, isHighlighted, isDone, isSpeakingNext, onClick }: Props) {
  const t = useT()
  return (
    <div
      className={[
        'id-card',
        isHighlighted ? 'id-card--highlighted' : '',
        !player.isAlive ? 'id-card--exiled' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      <div className="id-card__header">
        <span className={`avatar id-card__avatar${isHighlighted ? ' avatar--active' : ''}`}>
          {getInitials(player.name)}
        </span>
        <span className="id-card__name">{player.name}</span>
        {!player.isAlive && (
          <span className="pill pill--danger id-card__exiled-pill">Exiled</span>
        )}
        {isDone && !isHighlighted && (
          <span className="id-card__done-badge">✓</span>
        )}
        {isSpeakingNext && !isHighlighted && (
          <span className="pill pill--neutral id-card__next-pill">{t('game.next')}</span>
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
      </div>
    </div>
  )
}
