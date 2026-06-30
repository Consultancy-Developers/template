'use client'
import { useState } from 'react'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  country: string
  serviceRequired: string
  message: string
}

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  company: 'First Contact',
  country: 'Other',
  serviceRequired: 'Other',
  message: '',
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#0A2540]/80">
        {label}{required && <span className="ml-0.5 text-[#C9A44C]">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/45 transition-colors focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/10'

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [offers, setOffers] = useState({
    gstChecklist: false,
    uaeVatGuide: false,
    ukBookkeeping: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Build list of selected checklists
    const selectedChecklists = Object.entries(offers)
      .filter(([_, checked]) => checked)
      .map(([key]) => {
        if (key === 'gstChecklist') return 'Free GST Compliance Checklist'
        if (key === 'uaeVatGuide') return 'Free UAE VAT Guide'
        if (key === 'ukBookkeeping') return 'Free UK Bookkeeping Checklist'
        return ''
      })
      .filter(Boolean)

    const combinedMessage = selectedChecklists.length > 0
      ? `${form.message}\n\n[Requested Resources: ${selectedChecklists.join(', ')}]`
      : form.message

    const payload = {
      ...form,
      message: combinedMessage,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Something went wrong')
      }
      setSuccess(true)
      setForm(empty)
      setOffers({
        gstChecklist: false,
        uaeVatGuide: false,
        ukBookkeeping: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] px-6 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0A2540] text-white shadow-[0_14px_30px_rgba(10,37,64,0.18)]">
          ✓
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-[#0A2540]">Message sent!</h3>
        <p className="mt-2 text-[#1A1A1A]/70">Thanks for reaching out. We&apos;ll be in touch soon.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium text-[#C9A44C] underline decoration-[#C9A44C]/40 underline-offset-4 transition-colors hover:text-[#0A2540]"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={set}
            placeholder="John Doe"
            className={inputClass}
            suppressHydrationWarning
          />
        </Field>
        <Field id="email" label="Email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={set}
            placeholder="john@example.com"
            className={inputClass}
            suppressHydrationWarning
          />
        </Field>
      </div>

      <Field id="phone" label="Phone">
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={set}
          placeholder="+1 555 0101"
          className={inputClass}
          suppressHydrationWarning
        />
      </Field>

      {/* Free Offers Checklist */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-left">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A2540]/80">
          Offer: Free Resources (Optional)
        </p>
        <div className="space-y-3">
          {[
            { id: 'gstChecklist', label: 'Free GST Compliance Checklist' },
            { id: 'uaeVatGuide', label: 'Free UAE VAT Guide' },
            { id: 'ukBookkeeping', label: 'Free UK Bookkeeping Checklist' },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer select-none text-sm text-[#1A1A1A]/85 hover:text-[#0A2540]">
              <input
                type="checkbox"
                checked={offers[item.id as keyof typeof offers]}
                onChange={() => setOffers(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof offers] }))}
                className="h-4 w-4 rounded border-[#E5E7EB] text-[#C9A44C] accent-[#C9A44C] focus:ring-[#C9A44C]"
              />
              <span className="font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field id="message" label="Requirement" required>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={set}
          placeholder="Describe your accounting, tax, or compliance requirements here..."
          className={`${inputClass} resize-none`}
        />
      </Field>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        suppressHydrationWarning
        className="w-full rounded-full bg-[#0A2540] py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(10,37,64,0.18)] transition-colors hover:bg-[#12365a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
