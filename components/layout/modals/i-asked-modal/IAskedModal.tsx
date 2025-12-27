'use client'

import { useCallback, useMemo } from 'react'
import { Modal, PrimaryBtn } from '@/components'
import { WizardStep } from './components'
import { useIAskedFlow } from './useIAskedFlow'
import styles from './IAskedModal.module.scss'
import { AnimatePresence, motion } from 'framer-motion'

interface IAskedModalProps {
    isOpen: boolean
    onClose: () => void
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction === 1 ? 40 : -40,
    opacity: 0,
    position: 'absolute' as const,
    width: '100%',
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative' as const,
    width: '100%',
  },
  exit: (direction: 1 | -1) => ({
    x: direction === 1 ? -40 : 40,
    opacity: 0,
    position: 'absolute' as const,
    width: '100%',
  }),
}

export const IAskedModal = ({ isOpen, onClose }: IAskedModalProps) => {
  const { state, canGoBack, isValid, payload, actions } = useIAskedFlow()

  const handleClose = useCallback(() => {
    onClose()
    actions.reset()
  }, [onClose, actions])

  const handleSubmit = useCallback(async () => {
    // await fetch(...payload)
    handleClose()
  }, [payload, handleClose])

  const stepNode = useMemo(() => {
    const common = {
      showBack: canGoBack,
      onBack: actions.goBack,
    }

    switch (state.step) {
      case 'chooseFlow':
        return (
          <WizardStep
            title='Personal or business?'
            actions={
              <>
                <PrimaryBtn
                  variant='primary'
                  onClick={() => actions.setFlowType('personal')}
                >
                  Personal
                </PrimaryBtn>
                <PrimaryBtn
                  variant='primary'
                  onClick={() => actions.setFlowType('business')}
                >
                  Business
                </PrimaryBtn>
              </>
            }
          />
        )

      case 'didYouAsk':
        return (
          <WizardStep
            title='Their response?'
            {...common}
            actions={
              <>
                <PrimaryBtn
                  variant='primary'
                  onClick={() => actions.setDidAsk('yes')}
                >
                  Yes
                </PrimaryBtn>
                <PrimaryBtn
                  variant='secondary'
                  onClick={() => actions.setDidAsk('no')}
                >
                  No
                </PrimaryBtn>
              </>
            }
          />
        )

      case 'cardStatus':
        return (
          <WizardStep
            title='Do they currently have a card?'
            {...common}
            actions={
              <>
                <PrimaryBtn
                  variant='primary'
                  onClick={() => actions.setCardStatus('hasCard')}
                >
                  Yes
                </PrimaryBtn>
                <PrimaryBtn
                  variant='secondary'
                  onClick={() => actions.setCardStatus('noCard')}
                >
                  No
                </PrimaryBtn>
              </>
            }
          />
        )

      case 'review':
        return (
          <WizardStep
            title='Review'
            titleSize='section'
            {...common}
            actions={
              <div className={styles.summary}>
                <div>
                  <strong>Type:</strong> {state.flowType ?? '-'}
                </div>
                <div>
                  <strong>Asked:</strong> {state.didAsk ?? '-'}
                </div>
                {state.didAsk === 'no' ? (
                  <div>
                    <strong>Card:</strong> {state.cardStatus ?? '-'}
                  </div>
                ) : null}
              </div>
            }
            footer={
              <PrimaryBtn
                variant='primary'
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Submit
              </PrimaryBtn>
            }
          />
        )
      default:
        return null
    }
  }, [state, canGoBack, actions, handleSubmit, isValid])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='I asked'>
      {/* this wrapper is important: lets outgoing/entering steps overlap */}
      <div className={styles.animWrap}>
        <AnimatePresence
          initial={false}
          custom={state.direction}
          mode='popLayout'
        >
          <motion.div
            key={state.step}
            custom={state.direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className={styles.wrap}>{stepNode}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  )
}
