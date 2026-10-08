import { useCallback, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { LAST_STEP_INDEX, WIZARD_STEPS } from '../config/steps'
import type { WizardValues } from '../schema/wizard'

export function useWizardNavigation(form: UseFormReturn<WizardValues>, initialStep: number) {
  const [step, setStep] = useState(initialStep)

  const next = useCallback(async () => {
    const { fields } = WIZARD_STEPS[step]
    const isValid = fields.length === 0 || (await form.trigger([...fields], { shouldFocus: true }))
    // Absolute index so a double tap can't skip a step
    if (isValid) setStep(Math.min(step + 1, LAST_STEP_INDEX))
    return isValid
  }, [form, step])

  const back = useCallback(() => setStep(Math.max(step - 1, 0)), [step])

  // Can only jump to visited steps, use next() to go forward
  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < step) setStep(index)
  }, [step])

  const restart = useCallback(() => setStep(0), [])

  return {
    step,
    current: WIZARD_STEPS[step],
    isFirst: step === 0,
    isLast: step === LAST_STEP_INDEX,
    next,
    back,
    goTo,
    restart,
  }
}
