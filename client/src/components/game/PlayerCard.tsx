import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { getInitials } from '../../utils/avatar'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
}

export function PlayerCard({ player, categories, lang, isHighlighted }: Props) {
  return (
    <div className={`id-card${isHighlighted ? ' id-card--highlighted' : ''}${!player.isAlive ? ' id-card--exiled' : ''}`}>
      <div className="id-card__header">
        <span className={`avatar id-card__avatar${isHighlighted ? ' avatar--active' : ''}`}>{getInitials(player.name)}</span>
        <span className="id-card__name">{player.name}</span>
        {!player.isAlive && <span className="pill pill--danger">Exiled</span>}
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
