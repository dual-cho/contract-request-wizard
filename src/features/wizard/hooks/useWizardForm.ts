import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { DraftStorage } from '../lib/draftStorage'
import { resolveResumeStep } from '../lib/resolveResumeStep'
import { createEmptyValues, wizardSchema, type WizardValues } from '../schema/wizard'

export function useWizardForm(drafts: DraftStorage) {
  const [restored] = useState(() => {
    const draft = drafts.load()
    return draft && { values: draft.values, step: resolveResumeStep(draft.values, draft.step) }
  })

  // Validate on first blur, then on every change
  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: restored?.values ?? createEmptyValues(),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  return { form, initialStep: restored?.step ?? 0, wasRestored: restored !== null }
}
