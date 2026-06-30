'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Invalid credentials')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/45 focus:border-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C9A44C]/30'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6">
      <div className="w-full max-w-sm rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-[0_20px_60px_rgba(10,37,64,0.08)]">
        <BrandLogo theme="light" />
        <h1 className="mb-1 mt-4 text-xl font-semibold text-[#0A2540]">Admin Login</h1>
        <p className="mb-6 text-sm text-[#1A1A1A]/70">Corporate dashboard access</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-[#0A2540]">Username</label>
            <input
              id="username" type="text" required
              value={username} onChange={e => setUsername(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#0A2540]">Password</label>
            <input
              id="password" type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-full bg-[#C9A44C] py-3 font-semibold text-[#0A2540] transition-colors hover:bg-[#ddb860] disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
