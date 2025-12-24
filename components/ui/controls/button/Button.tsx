

import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './PrimaryBtn.module.scss'
import clsx from 'clsx'

type Variant =
  | 'primary'
  | 'secondary'
  | 'caution'
  | 'delete'
  | 'disabled'
  | 'small'

interface PrimaryBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function PrimaryBtn({
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...rest
}: PrimaryBtnProps) {
  const isDisabled = disabled || variant === 'disabled'

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={clsx(
        styles.primaryBtn,
        styles[`primaryBtn--${variant}`],
        className
      )}
    >
      {children}
    </button>
  )
}
