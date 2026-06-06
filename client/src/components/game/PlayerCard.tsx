import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { CardSlot } from './CardSlot'

interface Props {
  player: PublicPlayer
  categories: CardCategory[]
  lang: 'en' | 'ru'
  isHighlighted?: boolean
}

export function PlayerCard({ player, categories, lang, isHighlighted }: Props) {
  const cols = Math.min(categories.length, 3)
  return (
    <div
      style={{
        padding: 10,
        background: 'var(--c-surface2)',
        border: `1px solid ${isHighlighted ? 'var(--c-primary)' : 'var(--c-border)'}`,
        borderRadius: 8,
        boxShadow: isHighlighted ? '0 0 20px var(--c-glow)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text)' }}>
          {player.name}
        </span>
        {!player.isAlive && (
          <span className="badge badge--exiled">Exiled</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
        {categories.map(cat => {
          const masked = player.maskedCards[cat.id]
          return (
            <CardSlot
              key={cat.id}
              category={cat}
              card={masked?.card ?? null}
              isRevealed={masked?.isRevealed ?? false}
              isClickable={false}
              lang={lang}
            />
          )
        })}
      </div>
    </div>
  )
}
