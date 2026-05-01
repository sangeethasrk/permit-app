import { describe, expect, it } from 'vitest'
import { canTransitionStatus, isValidPermitStatus } from './permitModel.js'

describe('permit status business rules', () => {
  it('allows valid transition draft -> submitted', () => {
    expect(canTransitionStatus('draft', 'submitted')).toBe(true)
  })

  it('blocks invalid transition approved -> draft', () => {
    expect(canTransitionStatus('approved', 'draft')).toBe(false)
  })

  it('rejects invalid status value', () => {
    expect(isValidPermitStatus('in_review')).toBe(false)
  })
})
