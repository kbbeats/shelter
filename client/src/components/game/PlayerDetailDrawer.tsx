import type { PublicPlayer, CardCategory } from '@shelter/shared'
import { getInitials } from '../../utils/avatar'
import { useT } from '../../i18n'

interface Props {
  player: PublicPlayer | null
  categories: CardCategory[]
  lang: 'en' | 'ru'
  onClose: () => void
}

export function PlayerDetailDrawer({ player, categories, lang, onClose }: Props) {
  const t = useT()
  const isOpen = player !== null

  return (
    <>
      <div
        className={`player-drawer__backdrop${isOpen ? ' player-drawer__backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`player-drawer${isOpen ? ' player-drawer--open' : ''}`}
        aria-label={player?.name ?? ''}
        aria-hidden={!isOpen}
      >
        {player && (
          <>
            <button className="player-drawer__close" onClick={onClose} aria-label="Close">✕</button>
            <div className="player-drawer__header">
              <span className={`avatar player-drawer__avatar${!player.isAlive ? '' : ''}`}>
                {getInitials(player.name)}
              </span>
              <div className="player-drawer__name">{player.name}</div>
              {!player.isAlive && (
                <span className="pill pill--danger">{t('exile.title')}</span>
              )}
            </div>
            <div className="player-drawer__attrs">
              {categories.map(cat => {
                const masked = player.maskedCards[cat.id]
                const isRevealed = masked?.isRevealed ?? false
                const value = isRevealed && masked?.card ? masked.card.label[lang] : null
                return (
                  <div key={cat.id} className="player-drawer__attr">
                    <span className="player-drawer__attr-label">{cat.icon} {cat.name[lang]}</span>
                    {isRevealed ? (
                      <span className="player-drawer__attr-val">{value}</span>
                    ) : (
                      <span className="pill pill--neutral">{t('game.hidden')}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
