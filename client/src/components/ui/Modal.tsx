import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  actions: ReactNode
  onClose?: () => void
  className?: string
}

export function Modal({ title, children, actions, className = '' }: Props) {
  const overlayCls = ['modal-overlay', className].filter(Boolean).join(' ')
  const modalCls = ['modal', className].filter(Boolean).join(' ')

  return (
    <div className={overlayCls}>
      <div className={modalCls}>
        <div className="modal__title">{title}</div>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">{actions}</div>
      </div>
    </div>
  )
}
