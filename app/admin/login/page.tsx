import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, COOKIE_NAME } from '@/lib/auth'
import LoginForm from '@/components/admin/LoginForm'

export default async function LoginPage() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (token && verifySession(token)) redirect('/admin')
  return <LoginForm />
}
