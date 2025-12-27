'use client'

import { useMemo, useState } from 'react'
import { Modal, PrimaryBtn, Heading } from '@/components'
import styles from './IAskedModal.module.scss'

type IAskedModalProps = {
  isOpen: boolean
  onClose: () => void
}

type FlowType = 'personal' | 'business'
type YesNo = 'yes' | 'no'
type CardStatus = 'hasCard' | 'noCard'

type Step = 'chooseFlow' | 'didYouAsk' | 'cardStatus' | 'review' // optional (or go straight to submit)

export const IAskedModal = ({ isOpen, onClose }: IAskedModalProps) => {
  const [step, setStep] = useState<Step>('chooseFlow')

  const [flowType, setFlowType] = useState<FlowType | null>(null)
  const [didAsk, setDidAsk] = useState<YesNo | null>(null)
  const [cardStatus, setCardStatus] = useState<CardStatus | null>(null)

  const canGoBack = useMemo(() => step !== 'chooseFlow', [step])

  const reset = () => {
    setStep('chooseFlow')
    setFlowType(null)
    setDidAsk(null)
    setCardStatus(null)
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  const goBack = () => {
    if (step === 'didYouAsk') setStep('chooseFlow')
    else if (step === 'cardStatus') setStep('didYouAsk')
    else if (step === 'review') setStep('cardStatus')
  }

  const handleSubmit = async () => {
    // build payload from state
    const payload = {
      flowType,
      didAsk,
      cardStatus: didAsk === 'no' ? cardStatus : null,
      createdAt: new Date().toISOString(),
    }

    // TODO: call your API route here
    // await fetch('/api/ask', { method:'POST', body: JSON.stringify(payload) ... })

    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='I asked'>
      <div className={styles.wrap}>
        {step === 'chooseFlow' && (
          <section className={styles.step}>
            <Heading as='h2' size='card'>
              Personal or business?
            </Heading>

            <div className={styles.actions}>
              <PrimaryBtn
                variant='primary'
                onClick={() => {
                  setFlowType('personal')
                  setStep('didYouAsk')
                }}
              >
                Personal
              </PrimaryBtn>

              <PrimaryBtn
                variant='primary'
                onClick={() => {
                  setFlowType('business')
                  setStep('didYouAsk')
                }}
              >
                Business
              </PrimaryBtn>
            </div>
          </section>
        )}

        {step === 'didYouAsk' && (
          <section className={styles.step}>
            <Heading as='h2' size='card'>
              Their Response?
            </Heading>

            <div className={styles.actions}>
              <PrimaryBtn
                variant='primary'
                onClick={() => {
                  setDidAsk('yes')
                  setStep('review') // or submit immediately
                }}
              >
                Yes
              </PrimaryBtn>

              <PrimaryBtn
                variant='secondary'
                onClick={() => {
                  setDidAsk('no')
                  setStep('cardStatus')
                }}
              >
                No
              </PrimaryBtn>
            </div>

            <div className={styles.navRow}>
              {canGoBack && (
                <PrimaryBtn
                  type='button'
                  className={styles.backBtn}
                  onClick={goBack}
                  variant='tertiary'
                >
                  Back
                </PrimaryBtn>
              )}
            </div>
          </section>
        )}

        {step === 'cardStatus' && (
          <section className={styles.step}>
            <Heading as='h2' size='card'>
              Do they currently have a card?
            </Heading>

            <div className={styles.actions}>
              <PrimaryBtn
                variant='primary'
                onClick={() => {
                  setCardStatus('hasCard')
                  setStep('review')
                }}
              >
                Yes
              </PrimaryBtn>

              <PrimaryBtn
                variant='secondary'
                onClick={() => {
                  setCardStatus('noCard')
                  setStep('review')
                }}
              >
                No 
              </PrimaryBtn>
            </div>

            <div className={styles.navRow}>
              <button type='button' className={styles.backBtn} onClick={goBack}>
                Back
              </button>
            </div>
          </section>
        )}

        {step === 'review' && (
          <section className={styles.step}>
            <Heading as='h2' size='section'>
              Review
            </Heading>

            <div className={styles.summary}>
              <div>
                <strong>Type:</strong> {flowType ?? '-'}
              </div>
              <div>
                <strong>Asked:</strong> {didAsk ?? '-'}
              </div>
              {didAsk === 'no' && (
                <div>
                  <strong>Card:</strong> {cardStatus ?? '-'}
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <button type='button' className={styles.backBtn} onClick={goBack}>
                Back
              </button>

              <PrimaryBtn
                variant='primary'
                onClick={handleSubmit}
                // basic validation:
                disabled={
                  !flowType || !didAsk || (didAsk === 'no' && !cardStatus)
                }
              >
                Submit
              </PrimaryBtn>
            </div>
          </section>
        )}
      </div>
    </Modal>
  )
}
