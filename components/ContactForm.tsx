'use client'
import { useState } from 'react'

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const empty: FormState = { name: '', email: '', phone: '', subject: '', message: '' }

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Something went wrong')
      }
      setSuccess(true)
      setForm(empty)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h3>
        <p className="text-gray-500">Thanks for reaching out. We'll be in touch soon.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-gray-400 underline hover:text-gray-900 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Name" required>
          <input
            name="name" type="text" required
            value={form.name} onChange={set}
            placeholder="John Doe"
            className={inputClass}
          />
        </Field>
        <Field label="Email" required>
          <input
            name="email" type="email" required
            value={form.email} onChange={set}
            placeholder="john@example.com"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Phone">
          <input
            name="phone" type="tel"
            value={form.phone} onChange={set}
            placeholder="+1 555 0101"
            className={inputClass}
          />
        </Field>
        <Field label="Subject" required>
          <input
            name="subject" type="text" required
            value={form.subject} onChange={set}
            placeholder="General Inquiry"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Message" required>
        <textarea
          name="message" required rows={5}
          value={form.message} onChange={set}
          placeholder="Tell us how we can help..."
          className={`${inputClass} resize-none`}
        />
      </Field>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit" disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
