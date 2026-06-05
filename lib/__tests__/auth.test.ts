import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.ADMIN_USERNAME = 'testadmin'
  process.env.ADMIN_PASSWORD = 'testpass'
  process.env.ADMIN_SESSION_SECRET = 'testsecret'
})

describe('createSessionToken', () => {
  it('returns a 64-char hex string', async () => {
    const { createSessionToken } = await import('../auth')
    const token = createSessionToken()
    expect(token).toMatch(/^[a-f0-9]{64}$/)
  })

  it('returns the same value on repeated calls', async () => {
    const { createSessionToken } = await import('../auth')
    expect(createSessionToken()).toBe(createSessionToken())
  })
})

describe('verifySession', () => {
  it('returns true for a valid token', async () => {
    const { createSessionToken, verifySession } = await import('../auth')
    expect(verifySession(createSessionToken())).toBe(true)
  })

  it('returns false for an invalid token', async () => {
    const { verifySession } = await import('../auth')
    expect(verifySession('not-valid')).toBe(false)
  })

  it('returns false for empty string', async () => {
    const { verifySession } = await import('../auth')
    expect(verifySession('')).toBe(false)
  })
})
