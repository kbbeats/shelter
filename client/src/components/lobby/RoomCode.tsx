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
    <div className="lb-ticket">
      <div className="lb-ticket__head">
        <span className="lb-ticket__title">{t('lobby.code.label')}</span>
        <button className="z-btn z-btn--outline z-btn--sm" onClick={copy}>
          {copied ? t('lobby.code.copied') : t('lobby.code.copy')}
        </button>
      </div>
      <div className="lb-code-row">
        <span className="lb-code">{code}</span>
      </div>
    </div>
  )
}
