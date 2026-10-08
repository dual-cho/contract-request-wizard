import { z } from 'zod'

import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from './patterns'

export const userInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be 60 characters or fewer')
    .regex(NAME_PATTERN, 'Name can only contain letters, spaces, apostrophes, dots and dashes'),
  phone: z
    .string()
    .trim()
    .min(1, 'Contact number is required')
    .regex(PHONE_PATTERN, 'Enter a valid phone number, e.g. +1 555 123 4567'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(EMAIL_PATTERN, 'Enter a valid email address, e.g. name@company.com'),
})

export type UserInfo = z.infer<typeof userInfoSchema>
