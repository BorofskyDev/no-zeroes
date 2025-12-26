'use client'
import { useTheme } from 'next-themes'
import styles from './ThemeToggle.module.scss'
import { PrimaryBtn } from '@/components/controls'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <PrimaryBtn
      variant='small'
      onClick={toggleTheme}
      className={styles.themeToggleBtn}
    >
      {theme === 'light' ? 'Toggle Dark' : 'Toggle Light'}
    </PrimaryBtn>
  )
}
