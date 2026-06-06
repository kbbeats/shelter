import type { PublicPlayer, CardCategory } from '@shelter/shared'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
}

export function PlayerCard({ player, categories, lang, isHighlighted }: Props) {
  return (
    <div className={`id-card${isHighlighted ? ' id-card--highlighted' : ''}`}>
      <div className="id-card__header">
        <span className="id-card__name">{player.name}</span>
        {!player.isAlive && <span className="badge badge--exiled">Exiled</span>}
      </div>
      <div className="id-card__attrs">
        {categories.map(cat => {
          const masked = player.maskedCards[cat.id]
          const isRevealed = masked?.isRevealed ?? false
          const value = isRevealed && masked?.card ? masked.card.label[lang] : null
          return (
            <div key={cat.id} className="id-card__attr">
              <span className="id-card__attr-label">{cat.icon} {cat.name[lang]}</span>
              <span className={`id-card__attr-val${!isRevealed ? ' id-card__attr-val--hidden' : ''}`}>
                {value ?? '???'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
