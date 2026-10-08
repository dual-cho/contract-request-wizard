import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { createDraftStorage } from '../lib/draftStorage'
import { submitRequest, type SubmissionReceipt } from '../lib/submitRequest'
import { createEmptyValues } from '../schema/wizard'
import { useDraftAutosave } from './useDraftAutosave'
import { useWizardForm } from './useWizardForm'
import { useWizardNavigation } from './useWizardNavigation'

const drafts = createDraftStorage()

export function useRequestWizard() {
  const { form, initialStep, wasRestored } = useWizardForm(drafts)
  const navigation = useWizardNavigation(form, initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null)
  const inFlight = useRef(false)

  // Paused during submit so the cleared draft isn't saved again
  useDraftAutosave({ form, drafts, step: navigation.step, enabled: !isSubmitting && !receipt })

  useEffect(() => {
    if (wasRestored) {
      toast.info('Draft restored', { id: 'draft-restored', description: 'We picked up where you left off.' })
    }
  }, [wasRestored])

  const submit = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    setIsSubmitting(true)
    try {
      const isValid = await form.trigger(undefined, { shouldFocus: true })
      if (!isValid) return
      const result = await submitRequest(form.getValues())
      drafts.clear()
      setReceipt(result)
      toast.success('Request submitted', { description: `Reference ${result.referenceId}` })
    } catch {
      toast.error('Submission failed', { description: 'Your draft is still saved. Please try again.' })
    } finally {
      inFlight.current = false
      setIsSubmitting(false)
    }
  }, [form])

  const { isLast, next, restart } = navigation

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      void (isLast ? submit() : next())
    },
    [isLast, next, submit],
  )

  const startOver = useCallback(() => {
    form.reset(createEmptyValues())
    restart()
    setReceipt(null)
  }, [form, restart])

  return { form, navigation, isSubmitting, receipt, handleFormSubmit, startOver }
}
