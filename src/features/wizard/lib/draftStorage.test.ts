import { beforeEach, describe, expect, it } from 'vitest'

import { createMemoryStore, type KeyValueStore } from '@/lib/storage'

import { createEmptyValues } from '../schema/wizard'
import { createDraftStorage, DRAFT_STORAGE_KEY } from './draftStorage'
import { resolveResumeStep } from './resolveResumeStep'

const filledValues = {
  fullName: 'Jane Doe',
  phone: '+1 555 123 4567',
  email: 'jane@company.com',
  items: [{ service: 'training', quantity: 2, note: 'Seoul office' }],
}

describe('createDraftStorage', () => {
  let store: KeyValueStore

  beforeEach(() => {
    store = createMemoryStore()
  })

  it('round-trips the step and values', () => {
    const drafts = createDraftStorage(store)
    drafts.save(1, filledValues)
    expect(drafts.load()).toMatchObject({ step: 1, values: filledValues })
  })

  it('keeps partially typed values that fail business rules', () => {
    const drafts = createDraftStorage(store)
    const partial = { ...createEmptyValues(), email: 'jane@' }
    drafts.save(0, partial)
    expect(drafts.load()?.values.email).toBe('jane@')
  })

  it.each([
    ['malformed JSON', '{not json'],
    ['an older version', JSON.stringify({ version: 0, step: 0, savedAt: 0, values: filledValues })],
    ['an out-of-range step', JSON.stringify({ version: 1, step: 9, savedAt: 0, values: filledValues })],
  ])('discards %s', (_, raw) => {
    store.setItem(DRAFT_STORAGE_KEY, raw)
    expect(createDraftStorage(store).load()).toBeNull()
    expect(store.getItem(DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('clears the draft', () => {
    const drafts = createDraftStorage(store)
    drafts.save(2, filledValues)
    drafts.clear()
    expect(drafts.load()).toBeNull()
  })

  it('degrades gracefully without storage', () => {
    const drafts = createDraftStorage(null)
    drafts.save(1, filledValues)
    expect(drafts.load()).toBeNull()
  })
})

describe('resolveResumeStep', () => {
  it('resumes at the saved step when earlier steps are valid', () => {
    expect(resolveResumeStep(filledValues, 2)).toBe(2)
  })

  it('falls back to the first invalid step', () => {
    expect(resolveResumeStep({ ...filledValues, email: 'broken' }, 2)).toBe(0)
    expect(resolveResumeStep({ ...filledValues, items: [] }, 2)).toBe(1)
  })
})
