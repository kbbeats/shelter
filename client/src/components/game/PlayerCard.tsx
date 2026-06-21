import type { PublicPlayer, CardCategory } from '@shelter/shared'
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

type Status = 'speaking' | 'exiled' | 'done' | 'next' | 'wait'

export function PlayerCard({ player, categories, lang, isHighlighted, isDone, isSpeakingNext, onClick }: Props) {
  const t = useT()

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
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      <div className="id-card__header">
        <span className="id-card__name">{player.name}</span>
        <span className={`id-card__status id-card__status--${status}`}>[{statusLabel[status]}]</span>
      </div>
      <div className="id-card__dots" aria-hidden="true">
        {categories.map(cat => {
          const isRevealed = player.maskedCards[cat.id]?.isRevealed ?? false
          return (
            <span
              key={cat.id}
              className={`id-card__dot${isRevealed ? ' id-card__dot--revealed' : ''}`}
              title={cat.name[lang]}
            >█</span>
          )
        })}
      </div>
    </div>
  )
}
