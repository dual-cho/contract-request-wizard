import type { ZodType } from 'zod'

import { requestConfigSchema } from '../schema/requestConfig'
import { userInfoSchema } from '../schema/userInfo'
import type { WizardValues } from '../schema/wizard'

export interface WizardStep {
  id: 'user-info' | 'request' | 'review'
  title: string
  description: string
  fields: readonly (keyof WizardValues)[]
  schema?: ZodType
}

export const WIZARD_STEPS: readonly WizardStep[] = [
  {
    id: 'user-info',
    title: 'Your details',
    description: 'Tell us who is requesting the contract.',
    fields: ['fullName', 'phone', 'email'],
    schema: userInfoSchema,
  },
  {
    id: 'request',
    title: 'Configure request',
    description: 'Add the services you need and how many.',
    fields: ['items'],
    schema: requestConfigSchema,
  },
  {
    id: 'review',
    title: 'Review & confirm',
    description: 'Check everything before submitting.',
    fields: [],
  },
]

export const LAST_STEP_INDEX = WIZARD_STEPS.length - 1
