import { delay } from '@/lib/delay'

import { wizardSchema, type WizardValues } from '../schema/wizard'

export interface SubmissionReceipt {
  referenceId: string
  submittedAt: Date
}

const MOCK_LATENCY_MS = 1500

export async function submitRequest(values: WizardValues): Promise<SubmissionReceipt> {
  // Same check the backend would do
  wizardSchema.parse(values)
  await delay(MOCK_LATENCY_MS)
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase()
  return { referenceId: `REQ-${suffix.padStart(7, '0')}`, submittedAt: new Date() }
}
