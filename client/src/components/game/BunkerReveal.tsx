import { useT } from '../../i18n'
import type { BunkerConfig } from '@shelter/shared'

export function BunkerCard({ bunker, lang }: { bunker: BunkerConfig; lang: 'en' | 'ru' }) {
  const t = useT()

  const stats: Array<[string, string]> = [
    [t('game.bunker.size'), bunker.size[lang]],
    [t('game.bunker.food'), bunker.foodSupply[lang]],
    [t('game.bunker.water'), bunker.waterSupply[lang]],
    [t('game.bunker.feature'), bunker.specialFeature[lang]],
  ]

  return (
    <div className="bunker-card">
      <div className="bunker-card__header">
        <span className="bunker-card__title">{t('game.bunker.title')}</span>
        <div className="bunker-card__capacity">
          <span className="bunker-card__capacity-num">{bunker.capacity}</span>
          {t('game.bunker.capacity')}
        </div>
      </div>
      {stats.map(([label, value]) => (
        <div key={label} className="bunker-stat">
          <span className="bunker-stat__label">{label}</span>
          <span className="bunker-stat__value">{value}</span>
        </div>
      ))}
    </div>
  )
}
