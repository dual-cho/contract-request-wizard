import { z } from 'zod'

import { findService } from '../config/services'

export const MAX_NOTE_LENGTH = 200
export const MAX_QUANTITY = 99

export const requestItemSchema = z.object({
  service: z
    .string()
    .min(1, 'Choose a service')
    .refine((id) => Boolean(findService(id)), 'Unknown service'),
  quantity: z
    .number({ error: 'Enter a quantity' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(MAX_QUANTITY, `Quantity cannot exceed ${MAX_QUANTITY}`),
  note: z
    .string()
    .trim()
    .max(MAX_NOTE_LENGTH, `Notes must be ${MAX_NOTE_LENGTH} characters or fewer`),
})

export const requestConfigSchema = z.object({
  items: z
    .array(requestItemSchema)
    .min(1, 'Add at least one service to continue')
    .superRefine((items, ctx) => {
      const seen = new Set<string>()
      items.forEach((item, index) => {
        if (!item.service) return
        if (seen.has(item.service)) {
          ctx.addIssue({
            code: 'custom',
            message: 'This service is already in your request',
            path: [index, 'service'],
          })
        }
        seen.add(item.service)
      })
    }),
})

export type RequestItem = z.infer<typeof requestItemSchema>
export type RequestConfig = z.infer<typeof requestConfigSchema>

export const emptyRequestItem = (): RequestItem => ({ service: '', quantity: 1, note: '' })
