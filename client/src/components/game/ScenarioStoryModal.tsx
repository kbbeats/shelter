import type { ScenarioPublic } from '@shelter/shared'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'

interface Props {
  scenario: ScenarioPublic
  lang: 'en' | 'ru'
  onClose: () => void
}

export function ScenarioStoryModal({ scenario, lang, onClose }: Props) {
  const t = useT()

  return (
    <Modal
      title={t('game.story.title')}
      actions={
        <Button size="sm" onClick={onClose}>{t('game.story.close')}</Button>
      }
    >
      {scenario.story[lang].split('\n\n').map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </Modal>
  )
}
