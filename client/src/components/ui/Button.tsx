import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', full, children, className = '', ...rest }: Props) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : size === 'sm' ? 'btn--sm' : '',
    full ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return <button className={cls} {...rest}>{children}</button>
}
