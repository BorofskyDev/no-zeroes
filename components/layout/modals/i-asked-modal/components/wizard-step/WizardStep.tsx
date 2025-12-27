'use client'

import { ReactNode } from 'react'
import { Heading, PrimaryBtn } from '@/components'
import styles from './WizardStep.module.scss'

type WizardStepProps = {
  title: string
  titleSize?: 'card' | 'section' | 'page'
  actions: ReactNode

  showBack?: boolean
  onBack?: () => void

  footer?: ReactNode
}

export const WizardStep = ({
  title,
  titleSize = 'card',
  actions,
  showBack = false,
  onBack,
  footer,
}: WizardStepProps) => {
  return (
    <section className={styles.step}>
      <Heading as='h2' size={titleSize}>
        {title}
      </Heading>

      <div className={styles.actions}>{actions}</div>

      {showBack && onBack ? (
        <div className={styles.navRow}>
          <PrimaryBtn
            variant='tertiary'
            type='button'
            className={styles.backBtn}
            onClick={onBack}
          >
            Back
          </PrimaryBtn>
        </div>
      ) : null}

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </section>
  )
}
