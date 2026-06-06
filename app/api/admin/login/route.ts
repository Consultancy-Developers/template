import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, COOKIE_NAME } from '@/lib/auth'

function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json() as { username: string; password: string }

  if (
    !safeEquals(username ?? '', process.env.ADMIN_USERNAME ?? '') ||
    !safeEquals(password ?? '', process.env.ADMIN_PASSWORD ?? '')
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = createSessionToken()
  const res = NextResponse.json({ success: true })

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
