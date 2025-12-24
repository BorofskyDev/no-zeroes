import { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './BodyText.module.scss'

export type TextVariant = 'body' | 'lg' | 'sm' | 'xs' | 'caption'

interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant
  children: ReactNode
  className?: string
}

export const BodyText: React.FC<BodyTextProps> = ({
  variant = 'body',
  children,
  className,
  ...rest
}) => {
  return (
    <p
      className={clsx(styles.text, styles[`text--${variant}`], className)}
      {...rest}
    >
      {children}
    </p>
  )
}
