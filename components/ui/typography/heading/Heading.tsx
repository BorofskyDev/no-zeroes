import { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Heading.module.scss'

export type HeadingSize =
  | 'page'
  | 'section'
  | 'paragraph'
  | 'card'
  | 'aside'
  | 'caption'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as: HeadingLevel
  size?: HeadingSize
  children: ReactNode
}

export const Heading: React.FC<HeadingProps> = ({
  as: Tag,
  size = 'page',
  children,
  className,
  ...rest
}) => {
  return (
    <Tag
      className={clsx(styles.heading, styles[`heading--${size}`], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}