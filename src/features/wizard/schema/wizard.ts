import { z } from 'zod'

import { requestConfigSchema } from './requestConfig'
import { userInfoSchema } from './userInfo'

export const wizardSchema = userInfoSchema.extend(requestConfigSchema.shape)

export type WizardValues = z.infer<typeof wizardSchema>

export const createEmptyValues = (): WizardValues => ({
  fullName: '',
  phone: '',
  email: '',
  items: [],
})
