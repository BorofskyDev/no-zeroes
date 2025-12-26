import Link from 'next/link'
import styles from './Logo.module.scss'

export function Logo() {
  return (
    <div className={styles.logo}>
      <Link href='/' className={styles.logoLink}>
        N0
      </Link>
    </div>
  )
}
