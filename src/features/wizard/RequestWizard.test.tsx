// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { DRAFT_STORAGE_KEY, DRAFT_VERSION } from './lib/draftStorage'
import { RequestWizard } from './RequestWizard'

const validUser = { fullName: 'Jane Doe', phone: '+1 555 123 4567', email: 'jane@company.com' }

function seedDraft(step: number, values: object) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ version: DRAFT_VERSION, step, savedAt: 0, values }))
}

const readDraft = () => JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) ?? 'null')

beforeAll(() => {
  Element.prototype.scrollTo = () => {}
  Element.prototype.scrollIntoView = () => {}
})

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('RequestWizard', () => {
  it('blocks progress until the active step is valid', async () => {
    const user = userEvent.setup()
    render(<RequestWizard />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText(/at least 2 characters/i)).toBeTruthy()
    expect(screen.getByText(/step 1 of 3/i)).toBeTruthy()

    await user.type(screen.getByLabelText(/full name/i), validUser.fullName)
    await user.type(screen.getByLabelText(/contact number/i), validUser.phone)
    await user.type(screen.getByLabelText(/email/i), validUser.email)
    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(await screen.findByText(/step 2 of 3/i)).toBeTruthy()
  })

  it('toggles field errors while typing once a field was touched', async () => {
    const user = userEvent.setup()
    render(<RequestWizard />)
    const email = screen.getByLabelText(/email/i)

    await user.type(email, 'jane@')
    await user.tab()
    expect(await screen.findByText(/valid email address/i)).toBeTruthy()

    await user.type(email, 'company.com')
    await waitFor(() => expect(screen.queryByText(/valid email address/i)).toBeNull())
  })

  it('autosaves values and step, then restores them after a reload', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<RequestWizard />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane')
    expect(readDraft()).toMatchObject({ step: 0, values: { fullName: 'Jane' } })

    unmount()
    seedDraft(1, { ...validUser, items: [] })
    render(<RequestWizard />)

    expect(await screen.findByText(/step 2 of 3/i)).toBeTruthy()
  })

  it('reports an empty service list at list level', async () => {
    const user = userEvent.setup()
    seedDraft(1, { ...validUser, items: [] })
    render(<RequestWizard />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByText(/add at least one service/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText(/add at least one service/i)).toBeNull()
  })

  it('submits from the review step and clears the draft', async () => {
    const user = userEvent.setup()
    seedDraft(2, { ...validUser, items: [{ service: 'audit', quantity: 1, note: '' }] })
    render(<RequestWizard />)

    expect(await screen.findByText(/security audit/i)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/request submitted/i, {}, { timeout: 3000 })).toBeTruthy()
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('resumes at the first invalid step when a draft is inconsistent', async () => {
    seedDraft(2, { ...validUser, email: 'broken', items: [] })
    render(<RequestWizard />)

    expect(await screen.findByText(/step 1 of 3/i)).toBeTruthy()
  })
})
