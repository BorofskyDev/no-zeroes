'use client'

import { motion } from 'framer-motion'
import { BtnLink, TextLink } from '@/components/'
import { navlinks } from '../navlinks'
import clsx from 'clsx'
import styles from './MobileNav.module.scss'

interface MobileNavProps {
  onLinkClick: () => void
  className?: string
}

export function MobileNav({ onLinkClick, className }: MobileNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(styles.mobileNav, className)}
    >
      <div className={styles.links}>
        {navlinks.map(({ href, label }) => (
          <TextLink
            key={href}
            href={href}
            onClick={onLinkClick}
            className={styles.mobileNavLinks}
          >
            {label}
          </TextLink>
        ))}
      </div>
    </motion.nav>
  )
}
