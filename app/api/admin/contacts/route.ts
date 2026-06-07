import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated } from '@/lib/auth'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { Contact } from '@/types'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { env } = await getCloudflareContext({ async: true })

  try {
    const { results: contacts } = await env.DB.prepare(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    ).all<Contact>()

    return NextResponse.json({ contacts })
  } catch (err) {
    console.error('D1 fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}
