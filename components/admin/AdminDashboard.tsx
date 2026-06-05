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
  const [subjectFilter, setSubjectFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
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
      const { contacts } = await cRes.json()
      const { email_enabled } = await sRes.json()
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

  const subjects = useMemo(
    () => [...new Set(contacts.map(c => c.subject))].sort(),
    [contacts],
  )

  const filtered = useMemo(() => {
    const now = Date.now()
    return contacts.filter(c => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.email.toLowerCase().includes(search.toLowerCase()) &&
        !c.subject.toLowerCase().includes(search.toLowerCase())
      ) return false

      if (subjectFilter && c.subject !== subjectFilter) return false

      if (dateFilter) {
        const ms = now - new Date(c.created_at).getTime()
        if (dateFilter === 'week' && ms > 7 * 86400_000) return false
        if (dateFilter === 'month') {
          const d = new Date(c.created_at)
          const n = new Date()
          if (d.getMonth() !== n.getMonth() || d.getFullYear() !== n.getFullYear()) return false
        }
      }

      return true
    })
  }, [contacts, search, subjectFilter, dateFilter])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold tracking-tight">Template — Admin</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Contacts</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{contacts.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{thisMonth}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email Notifications</p>
            <EmailToggle enabled={emailEnabled} onChange={setEmailEnabled} />
          </div>
        </div>

        <SearchFilter
          search={search} onSearchChange={setSearch}
          subjectFilter={subjectFilter} onSubjectChange={setSubjectFilter}
          dateFilter={dateFilter} onDateChange={setDateFilter}
          subjects={subjects}
        />

        <ContactsTable contacts={filtered} />
      </div>
    </div>
  )
}
