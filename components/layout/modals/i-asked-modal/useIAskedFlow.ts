'use client'

import { useCallback, useMemo, useState } from 'react'

export type FlowType = 'personal' | 'business'
export type YesNo = 'yes' | 'no'
export type CardStatus = 'hasCard' | 'noCard'

export type Step = 'chooseFlow' | 'didYouAsk' | 'cardStatus' | 'review'
export type Direction = 1 | -1

export type IAskedState = {
  step: Step
  direction: Direction
  flowType: FlowType | null
  didAsk: YesNo | null
  cardStatus: CardStatus | null
}

const initialState: IAskedState = {
  step: 'chooseFlow',
  direction: 1,
  flowType: null,
  didAsk: null,
  cardStatus: null,
}

export const useIAskedFlow = () => {
  const [state, setState] = useState<IAskedState>(initialState)

  /**
   * Internal helper so every transition sets the direction intentionally.
   * direction: 1 = forward (slide left), -1 = back (slide right)
   */
  const goTo = useCallback((step: Step, direction: Direction) => {
    setState((prev) => ({
      ...prev,
      step,
      direction,
    }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const setFlowType = useCallback((flowType: FlowType) => {
    setState((prev) => ({
      ...prev,
      flowType,
      direction: 1,
      step: 'didYouAsk',
    }))
  }, [])

  const setDidAsk = useCallback((didAsk: YesNo) => {
    setState((prev) => {
      if (didAsk === 'yes') {
        // Clear downstream branch state
        return {
          ...prev,
          didAsk,
          cardStatus: null,
          direction: 1,
          step: 'review',
        }
      }

      return {
        ...prev,
        didAsk,
        direction: 1,
        step: 'cardStatus',
      }
    })
  }, [])

  const setCardStatus = useCallback((cardStatus: CardStatus) => {
    setState((prev) => ({
      ...prev,
      cardStatus,
      direction: 1,
      step: 'review',
    }))
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      let nextStep: Step = prev.step

      if (prev.step === 'didYouAsk') nextStep = 'chooseFlow'
      else if (prev.step === 'cardStatus') nextStep = 'didYouAsk'
      else if (prev.step === 'review') {
        nextStep = prev.didAsk === 'no' ? 'cardStatus' : 'didYouAsk'
      }

      return {
        ...prev,
        step: nextStep,
        direction: -1,
      }
    })
  }, [])

  const setStep = useCallback(
    (step: Step, direction: Direction = 1) => {
      // Convenience for manual jumps (rare). Defaults to "forward".
      goTo(step, direction)
    },
    [goTo]
  )

  const canGoBack = useMemo(() => state.step !== 'chooseFlow', [state.step])

  const isValid = useMemo(() => {
    if (!state.flowType) return false
    if (!state.didAsk) return false
    if (state.didAsk === 'no' && !state.cardStatus) return false
    return true
  }, [state.flowType, state.didAsk, state.cardStatus])

  const payload = useMemo(() => {
    return {
      flowType: state.flowType,
      didAsk: state.didAsk,
      cardStatus: state.didAsk === 'no' ? state.cardStatus : null,
      createdAt: new Date().toISOString(),
    }
  }, [state.flowType, state.didAsk, state.cardStatus])

  return {
    state, // includes direction for framer-motion
    canGoBack,
    isValid,
    payload,

    actions: {
      reset,
      goTo,
      setStep,
      setFlowType,
      setDidAsk,
      setCardStatus,
      goBack,
    },
  }
}
