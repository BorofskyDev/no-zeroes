
import { TextLink } from '@/components/ui'
import styles from './Logo.module.scss'

export function Logo() {
  return (
    <div className={styles.logo}>
      <TextLink href='/' >
        N0
      </TextLink>
    </div>
  )
}
