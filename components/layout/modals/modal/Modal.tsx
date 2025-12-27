'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from './Modal.module.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void

  /** Accessible title for screen readers (can be visually hidden if you want) */
  title?: string

  /** Optional: tie a button ref to return focus when modal closes */
  initialFocus?: React.RefObject<HTMLElement>

  /** Modal content */
  children: ReactNode

  /** Optional: allow wide layouts */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const overlayMotion = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
}

const panelMotion = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: 8, scale: 0.985, transition: { duration: 0.12 } },
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  initialFocus,
  children,
  size = 'md',
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <Transition appear show as={Fragment}>
          <Dialog
            as='div'
            className={styles.root}
            onClose={onClose}
            initialFocus={initialFocus}
          >
            <div className={styles.viewport}>
              {/* Overlay */}
              <motion.div
                className={styles.overlay}
                variants={overlayMotion}
                initial='hidden'
                animate='show'
                exit='exit'
              />

              {/* Centering wrapper */}
              <div className={styles.centerWrap}>
                <motion.div
                  className={`${styles.panel} ${styles[`panel_${size}`]}`}
                  variants={panelMotion}
                  initial='hidden'
                  animate='show'
                  exit='exit'
                  role='dialog'
                >
                  {/* Header */}
                  <div className={styles.header}>
                    {title ? (
                      <Dialog.Title className={styles.title}>
                        {title}
                      </Dialog.Title>
                    ) : (
                      // If no title is provided, still include a sr-only title for accessibility
                      <Dialog.Title className={styles.srOnly}>
                        Modal dialog
                      </Dialog.Title>
                    )}

                    <button
                      type='button'
                      className={styles.closeBtn}
                      onClick={onClose}
                      aria-label='Close modal'
                    >
                      <span aria-hidden='true'>×</span>
                    </button>
                  </div>

                  {/* Body */}
                  <div className={styles.body}>{children}</div>
                </motion.div>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : null}
    </AnimatePresence>
  )
}
