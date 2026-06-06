import type { CardCategory } from '@shelter/shared'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import { useGameStore } from '../../store/gameStore'

interface Props {
  category: CardCategory
  onClose: () => void
}

export function CardRevealModal({ category, onClose }: Props) {
  const t = useT()
  const { revealCard } = useGameStore()
  const lang = useGameStore(s => s.language)

  const handleReveal = () => {
    revealCard(category.id)
    onClose()
  }

  return (
    <Modal
      title={t('card.reveal.confirm')}
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>{t('card.reveal.cancel')}</Button>
          <Button size="sm" onClick={handleReveal}>{category.icon} {t('card.reveal.yes')} {category.name[lang]}</Button>
        </>
      }
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        {category.icon} {category.name[lang]}
      </span>
    </Modal>
  )
}
