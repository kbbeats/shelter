import { useState } from 'react'
import { useT } from '../../i18n'

interface Props {
  code: string
}

export function RoomCode({ code }: Props) {
  const t = useT()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="lobby__code-box">
      <div>
        <div className="section-label">{t('lobby.code.label')}</div>
        <div className="lobby__code">{code}</div>
      </div>
      <button className="btn btn--outline btn--sm" onClick={copy}>
        {copied ? t('lobby.code.copied') : t('lobby.code.copy')}
      </button>
    </div>
  )
}
