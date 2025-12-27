'use client'

import { useCallback, useMemo, useState } from 'react'
import { Modal, PrimaryBtn } from '@/components'
import { WizardStep } from './components'
import { useIAskedFlow, createAsk } from './lib'
import styles from './IAskedModal.module.scss'
import { AnimatePresence, motion } from 'framer-motion'

interface IAskedModalProps {
  isOpen: boolean
  onClose: () => void
}

type Direction = 1 | -1

const slideVariants = {
  enter: (direction: Direction) => ({
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
  exit: (direction: Direction) => ({
    x: direction === 1 ? -40 : 40,
    opacity: 0,
    position: 'absolute' as const,
    width: '100%',
  }),
}

export const IAskedModal = ({ isOpen, onClose }: IAskedModalProps) => {
  const { state, canGoBack, isValid, payload, actions } = useIAskedFlow()

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    onClose()
    actions.reset()
    setError(null)
    setIsSaving(false)
  }, [onClose, actions])

  const handleSubmit = useCallback(async () => {
    if (!isValid || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await createAsk({
        flowType: payload.flowType!, // safe because isValid
        didAsk: payload.didAsk!, // safe because isValid
        cardStatus: payload.didAsk === 'no' ? payload.cardStatus : null,
      })

      handleClose()
    } catch (e: Error | unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save. Try again.')
      setIsSaving(false)
    }
  }, [isValid, isSaving, payload, handleClose])

  const commonStepProps = useMemo(
    () => ({
      showBack: canGoBack,
      onBack: actions.goBack,
    }),
    [canGoBack, actions.goBack]
  )

  const steps = useMemo(() => {
    return {
      chooseFlow: (
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
      ),

      didYouAsk: (
        <WizardStep
          title='Their response?'
          {...commonStepProps}
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
      ),

      cardStatus: (
        <WizardStep
          title='Do they currently have a card?'
          {...commonStepProps}
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
      ),

      review: (
        <WizardStep
          title='Review'
          titleSize='section'
          {...commonStepProps}
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
            <>
              {error ? <p className={styles.error}>{error}</p> : null}

              <PrimaryBtn
                variant='primary'
                onClick={handleSubmit}
                disabled={!isValid || isSaving}
              >
                {isSaving ? 'Saving...' : 'Submit'}
              </PrimaryBtn>
            </>
          }
        />
      ),
    } as const
  }, [
    actions,
    commonStepProps,
    error,
    handleSubmit,
    isSaving,
    isValid,
    state.flowType,
    state.didAsk,
    state.cardStatus,
  ])

  const stepNode = steps[state.step]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='I asked'>
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
