import { useState, useEffect } from 'react'
import type { Card, CardCategory } from '@shelter/shared'
import { useT } from '../../i18n'

interface Props {
  category: CardCategory
  card: Card | null
  isRevealed: boolean
  isClickable: boolean
  isNew?: boolean
  onClick?: () => void
  lang: 'en' | 'ru'
}

export function CardSlot({ category, card, isRevealed, isClickable, isNew, onClick, lang }: Props) {
  const t = useT()
  const [flipped, setFlipped] = useState(isRevealed)

  useEffect(() => {
    if (isRevealed && !flipped) {
      setTimeout(() => setFlipped(true), 50)
    }
  }, [isRevealed, flipped])

  return (
    <div
      className={`card-slot${isNew ? ' card-slot--new' : ''}`}
      onClick={isClickable ? onClick : undefined}
      title={isClickable ? t('card.click_to_reveal') : ''}
    >
      <div className={`card-slot__inner${flipped ? ' card-slot__inner--flipped' : ''}`}>
        {/* Front = face-down */}
        <div className={`card-slot__face${isClickable ? ' card-slot__face--clickable' : ''}`}>
          <div className="card-slot__category-icon">{category.icon}</div>
          <div className="card-slot__cat-name">{category.name[lang]}</div>
          <div className="card-slot__question">{t('card.face_down')}</div>
        </div>

        {/* Back = face-up */}
        <div className="card-slot__back">
          <div className="card-slot__cat-name">{category.name[lang]}</div>
          {card && (
            <>
              <div className="card-slot__category-icon">{category.icon}</div>
              <div className="card-slot__label">{card.label[lang]}</div>
              <div className="card-slot__desc">{card.description[lang]}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
