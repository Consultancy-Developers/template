import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getTransporter } from '@/lib/email'

const MAX_DB_BYTES = 400 * 1024 * 1024 // 400 MB

export async function POST(req: NextRequest) {
  const { name, email, phone, company, country, serviceRequired, message } = await req.json() as {
    name: string
    email: string
    phone?: string
    company: string
    country: string
    serviceRequired: string
    message: string
  }

  if (!name || !email || !company || !country || !serviceRequired || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { env } = await getCloudflareContext({ async: true })
  const db = env.DB

  // Prune oldest 10% of contacts when D1 storage exceeds 400 MB
  const pageCount = await db.prepare('PRAGMA page_count').first<{ page_count: number }>()
  const pageSize = await db.prepare('PRAGMA page_size').first<{ page_size: number }>()
  const sizeBytes = (pageCount?.page_count ?? 0) * (pageSize?.page_size ?? 4096)

  if (sizeBytes > MAX_DB_BYTES) {
    await db.prepare(
      `DELETE FROM contacts WHERE id IN (
        SELECT id FROM contacts ORDER BY created_at ASC
        LIMIT MAX(1, (SELECT COUNT(*) / 10 FROM contacts))
      )`
    ).run()
  }

  const id = crypto.randomUUID()

  try {
    await db
      .prepare(
        'INSERT INTO contacts (id, name, email, phone, company, country, service_required, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(id, name, email, phone || null, company, country, serviceRequired, message)
      .run()
  } catch (err) {
    console.error('D1 insert error:', err)
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  const settings = await db
    .prepare('SELECT email_enabled FROM settings WHERE id = 1')
    .first<{ email_enabled: number }>()

  if (settings?.email_enabled) {
    const from = process.env.FROM_EMAIL!
    const adminEmail = process.env.ADMIN_EMAIL!

    try {
      const transporter = getTransporter()
      await Promise.all([
        transporter.sendMail({
          from,
          to: adminEmail,
          subject: `New consultation request from ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Service Required:</strong> ${serviceRequired}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${message}</p>
          `,
        }),
        transporter.sendMail({
          from,
          to: email,
          subject: 'We received your consultation request',
          html: `
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! We received your message and will get back to you shortly.</p>
            <p>Best regards,<br/>Corplex Global Accounting</p>
          `,
        }),
      ])
    } catch (emailError) {
      // Email failure is non-fatal — contact is already saved
      console.error('Failed to send emails:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
