import { createHash, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

export const COOKIE_NAME = 'admin_session'

export function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET!
  const username = process.env.ADMIN_USERNAME!
  const password = process.env.ADMIN_PASSWORD!
  return createHash('sha256')
    .update(`${username}:${password}:${secret}`)
    .digest('hex')
}

export function verifySession(token: string): boolean {
  const expected = createSessionToken()
  if (token.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function isRequestAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifySession(token)
}
