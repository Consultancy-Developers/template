import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, COOKIE_NAME } from '@/lib/auth'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token || !verifySession(token)) redirect('/admin/login')
  return <AdminDashboard />
}
