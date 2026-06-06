import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  actions: ReactNode
  onClose?: () => void
}

export function Modal({ title, children, actions }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__title">{title}</div>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">{actions}</div>
      </div>
    </div>
  )
}
