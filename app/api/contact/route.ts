import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error: insertError } = await supabase
    .from('contacts')
    .insert({ name, email, phone: phone || null, subject, message })

  if (insertError) {
    console.error('Supabase insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('email_enabled')
    .eq('id', 1)
    .single()

  if (settings?.email_enabled) {
    const from = process.env.RESEND_FROM_EMAIL!
    const adminEmail = process.env.ADMIN_EMAIL!

    try {
      await Promise.all([
        resend.emails.send({
          from,
          to: adminEmail,
          subject: `New contact from ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${message}</p>
          `,
        }),
        resend.emails.send({
          from,
          to: email,
          subject: 'We received your message',
          html: `
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! We received your message and will get back to you shortly.</p>
            <p>Best regards,<br/>Template Team</p>
          `,
        }),
      ])
    } catch (emailError) {
      console.error('Failed to send emails:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
