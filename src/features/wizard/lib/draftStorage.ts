import { z } from 'zod'

import { getBrowserStore, type KeyValueStore } from '@/lib/storage'

import { LAST_STEP_INDEX } from '../config/steps'
import type { WizardValues } from '../schema/wizard'

export const DRAFT_STORAGE_KEY = 'contract-wizard:draft'
export const DRAFT_VERSION = 1

// Shape check only, drafts can hold incomplete values
const draftSchema = z.object({
  version: z.literal(DRAFT_VERSION),
  step: z.number().int().min(0).max(LAST_STEP_INDEX),
  savedAt: z.number(),
  values: z.object({
    fullName: z.string(),
    phone: z.string(),
    email: z.string(),
    items: z.array(
      z.object({
        service: z.string(),
        quantity: z.number().optional(),
        note: z.string(),
      }),
    ),
  }),
})

export interface WizardDraft {
  step: number
  values: WizardValues
  savedAt: number
}

export function createDraftStorage(store: KeyValueStore | null = getBrowserStore()) {
  const load = (): WizardDraft | null => {
    const raw = store?.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed = draftSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data as WizardDraft
    } catch {
      // Bad JSON, cleaned up below
    }
    clear()
    return null
  }

  const save = (step: number, values: WizardValues) => {
    const draft = { version: DRAFT_VERSION, step, savedAt: Date.now(), values }
    try {
      store?.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Quota exceeded or storage disabled, ignore
    }
  }

  const clear = () => {
    try {
      store?.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // Nothing to clean up
    }
  }

  return { load, save, clear }
}

export type DraftStorage = ReturnType<typeof createDraftStorage>
