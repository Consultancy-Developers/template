import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated } from '@/lib/auth'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { env } = await getCloudflareContext({ async: true })

  try {
    const data = await env.DB.prepare(
      'SELECT email_enabled FROM settings WHERE id = 1'
    ).first<{ email_enabled: number }>()

    if (!data) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 500 })
    }

    return NextResponse.json({ email_enabled: Boolean(data.email_enabled) })
  } catch (err) {
    console.error('D1 settings fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email_enabled } = await req.json() as { email_enabled: boolean }
  const { env } = await getCloudflareContext({ async: true })

  try {
    await env.DB.prepare(
      'UPDATE settings SET email_enabled = ? WHERE id = 1'
    ).bind(email_enabled ? 1 : 0).run()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('D1 settings update error:', err)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
