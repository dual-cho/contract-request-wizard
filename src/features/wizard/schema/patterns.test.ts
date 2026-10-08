import { describe, expect, it } from 'vitest'

import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from './patterns'

describe('EMAIL_PATTERN', () => {
  it.each(['jane@company.com', 'j.doe+work@mail.co.uk', 'a_b-c@sub.domain.io'])('accepts %s', (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(true)
  })

  it.each(['plainaddress', 'jane@', '@company.com', 'jane..doe@company.com', '.jane@company.com', 'jane.@company.com', 'jane@company', 'jane@company.c'])(
    'rejects %s',
    (email) => {
      expect(EMAIL_PATTERN.test(email)).toBe(false)
    },
  )
})

describe('PHONE_PATTERN', () => {
  it.each(['+1 (555) 123-4567', '010-1234-5678', '+44 20 7946 0958', '5551234567', '+82.10.1234.5678'])('accepts %s', (phone) => {
    expect(PHONE_PATTERN.test(phone)).toBe(true)
  })

  it.each(['12345', 'abc-defg-hijk', '555--1234567', '+1 555 123 4567 8901 23', '555-123-', '++15551234567'])(
    'rejects %s',
    (phone) => {
      expect(PHONE_PATTERN.test(phone)).toBe(false)
    },
  )
})

describe('NAME_PATTERN', () => {
  it.each(["Jane O'Neil", 'Jean-Luc Picard', 'Kim Min-jun', 'José Álvarez'])('accepts %s', (name) => {
    expect(NAME_PATTERN.test(name)).toBe(true)
  })

  it.each(['J4ne', '-Jane', 'Jane_Doe'])('rejects %s', (name) => {
    expect(NAME_PATTERN.test(name)).toBe(false)
  })
})
