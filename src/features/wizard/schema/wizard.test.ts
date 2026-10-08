import { describe, expect, it } from 'vitest'

import { requestConfigSchema } from './requestConfig'
import { userInfoSchema } from './userInfo'
import { createEmptyValues, wizardSchema } from './wizard'

const validValues = {
  fullName: 'Jane Doe',
  phone: '+1 555 123 4567',
  email: 'jane@company.com',
  items: [{ service: 'consulting', quantity: 4, note: '' }],
}

describe('userInfoSchema', () => {
  it('trims and accepts valid contact details', () => {
    const result = userInfoSchema.parse({ ...validValues, fullName: '  Jane Doe  ' })
    expect(result.fullName).toBe('Jane Doe')
  })

  it('reports every invalid field', () => {
    const result = userInfoSchema.safeParse(createEmptyValues())
    const paths = result.error?.issues.map((issue) => issue.path[0])
    expect(paths).toEqual(expect.arrayContaining(['fullName', 'phone', 'email']))
  })
})

describe('requestConfigSchema', () => {
  it('requires at least one item', () => {
    const result = requestConfigSchema.safeParse({ items: [] })
    expect(result.error?.issues[0]?.message).toMatch(/at least one service/i)
  })

  it('flags duplicate services on the repeated row', () => {
    const items = [
      { service: 'audit', quantity: 1, note: '' },
      { service: 'audit', quantity: 2, note: '' },
    ]
    const result = requestConfigSchema.safeParse({ items })
    expect(result.error?.issues[0]?.path).toEqual(['items', 1, 'service'])
  })

  it('enforces quantity bounds and note length', () => {
    const items = [{ service: 'support', quantity: 100, note: 'x'.repeat(201) }]
    const paths = requestConfigSchema.safeParse({ items }).error?.issues.map((issue) => issue.path.join('.'))
    expect(paths).toEqual(['items.0.quantity', 'items.0.note'])
  })

  it('rejects services outside the catalog', () => {
    const items = [{ service: 'teleportation', quantity: 1, note: '' }]
    expect(requestConfigSchema.safeParse({ items }).success).toBe(false)
  })
})

describe('wizardSchema', () => {
  it('accepts a complete request', () => {
    expect(wizardSchema.safeParse(validValues).success).toBe(true)
  })
})
