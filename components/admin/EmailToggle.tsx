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
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={enabled ? 'Disable email notifications' : 'Enable email notifications'}
        className={`w-10 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 disabled:opacity-50 ${
          enabled ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm font-semibold text-gray-900">
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}
