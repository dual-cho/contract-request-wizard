import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import type { DraftStorage } from '../lib/draftStorage'
import type { WizardValues } from '../schema/wizard'

interface DraftAutosaveOptions {
  form: UseFormReturn<WizardValues>
  drafts: DraftStorage
  step: number
  enabled: boolean
}

// No debounce on purpose, localStorage writes are cheap and we don't want to lose input
export function useDraftAutosave({ form, drafts, step, enabled }: DraftAutosaveOptions) {
  useEffect(() => {
    if (!enabled) return

    const persist = () => drafts.save(step, form.getValues())
    persist()
    return form.subscribe({ formState: { values: true }, callback: persist })
  }, [form, drafts, step, enabled])
}
