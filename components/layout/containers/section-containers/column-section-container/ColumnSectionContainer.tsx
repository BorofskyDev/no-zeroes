import clsx from 'clsx'
import styles from './ColumnSectionContainer.module.scss'

interface ColumnSectionContainerProps {
  children: React.ReactNode
  id: string
  className?: string
}
export const ColumnSectionContainer = ({
  children,
  id,
  className,
}: ColumnSectionContainerProps) => {
  return (
    <section id={id} className={clsx(styles.columnSectionContainer, className)}>
      {children}
    </section>
  )
}
