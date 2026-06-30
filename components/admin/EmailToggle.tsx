'use client'
import { useState } from 'react'

interface Props {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function EmailToggle({ enabled, onChange }: Props) {
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const next = !enabled
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_enabled: next }),
    })
    if (res.ok) onChange(next)
    setLoading(false)
  }

  return (
    <div className="mt-2 flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={enabled ? 'Disable email notifications' : 'Enable email notifications'}
        className={`relative h-6 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A44C] focus:ring-offset-1 focus:ring-offset-white disabled:opacity-50 ${
          enabled ? 'bg-[#C9A44C]' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`absolute top-1 block h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm font-semibold text-[#1A1A1A]">
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}
