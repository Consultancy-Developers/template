'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import ContactsTable from './ContactsTable'
import SearchFilter from './SearchFilter'
import EmailToggle from './EmailToggle'
import type { Contact } from '@/types'

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentTime] = useState(() => Date.now())
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const [cRes, sRes] = await Promise.all([
        fetch('/api/admin/contacts'),
        fetch('/api/admin/settings'),
      ])
      if (cRes.status === 401 || sRes.status === 401) {
        router.push('/admin/login')
        return
      }
      const { contacts } = await cRes.json() as { contacts: Contact[] }
      const { email_enabled } = await sRes.json() as { email_enabled: boolean }
      setContacts(contacts)
      setEmailEnabled(email_enabled)
      setLoading(false)
    }
    load()
  }, [router])

  const thisMonth = useMemo(() => {
    const now = new Date()
    return contacts.filter(c => {
      const d = new Date(c.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [contacts])

  const services = useMemo(
    () => [...new Set(contacts.map(c => c.service_required))].sort(),
    [contacts],
  )

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.email.toLowerCase().includes(search.toLowerCase()) &&
        !c.company.toLowerCase().includes(search.toLowerCase()) &&
        !c.service_required.toLowerCase().includes(search.toLowerCase())
      ) return false

      if (serviceFilter && c.service_required !== serviceFilter) return false

      if (dateFilter) {
        const ms = currentTime - new Date(c.created_at).getTime()
        if (dateFilter === 'week' && ms > 7 * 86400_000) return false
        if (dateFilter === 'month') {
          const d = new Date(c.created_at)
          const n = new Date()
          if (d.getMonth() !== n.getMonth() || d.getFullYear() !== n.getFullYear()) return false
        }
      }

      return true
    })
  }, [contacts, search, serviceFilter, dateFilter, currentTime])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <p className="text-sm text-[#1A1A1A]/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="flex items-center justify-between bg-[#0A2540] px-6 py-4 text-white">
        <span className="font-bold tracking-tight">Corplex Global - Admin</span>
        <button
          onClick={handleLogout}
          className="rounded bg-[#C9A44C] px-3 py-1.5 text-sm font-semibold text-[#0A2540] transition-colors hover:bg-[#ddb860]"
        >
          Logout
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/60">Total Contacts</p>
            <p className="mt-1 text-3xl font-bold text-[#0A2540]">{contacts.length}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/60">This Month</p>
            <p className="mt-1 text-3xl font-bold text-[#0A2540]">{thisMonth}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/60">Email Notifications</p>
            <EmailToggle enabled={emailEnabled} onChange={setEmailEnabled} />
          </div>
        </div>

        <SearchFilter
          search={search} onSearchChange={setSearch}
          serviceFilter={serviceFilter} onServiceChange={setServiceFilter}
          dateFilter={dateFilter} onDateChange={setDateFilter}
          services={services}
        />

        <ContactsTable contacts={filtered} />
      </div>
    </div>
  )
}
