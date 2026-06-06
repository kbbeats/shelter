import { Link } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { useT } from '../../i18n'

interface Props {
  showBack?: boolean
}

export function Header({ showBack }: Props) {
  const t = useT()
  return (
    <header className="header">
      <Link to="/" className="header__logo">{t('app.title')}</Link>
      <div className="header__right">
        {showBack && (
          <Link to="/" className="btn btn--ghost btn--sm">{t('landing.back')}</Link>
        )}
        <LanguageToggle />
      </div>
    </header>
  )
}
