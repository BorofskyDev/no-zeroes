'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HamburgerMenu, MobileNav } from './navigation'
import { Logo } from './logo'
import styles from './Header.module.scss'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <Logo />

        <HamburgerMenu isOpen={isOpen} onClick={toggleMenu} />
        <AnimatePresence>
          {isOpen && <MobileNav onLinkClick={closeMenu} />}
        </AnimatePresence>
      </div>
    </header>
  )
}
