import clsx from 'clsx'
import styles from './PageContainer.module.scss'

export const PageContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <main className={clsx(styles.pageContainer, className)}>{children}</main>
}