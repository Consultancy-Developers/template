# Template Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean minimal multi-page Next.js site (Home, About, Contact) with D1-backed contact form, Resend email notifications, and a password-protected admin dashboard.

**Architecture:** API Routes + httpOnly cookie session (Approach A). Public pages share a Navbar+Footer layout via a `(public)` route group. Admin pages live outside that group so they get no public nav. Auth is checked server-side in the admin page component by reading the session cookie directly.

**Tech Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript · Cloudflare D1 · Resend · Vitest (unit tests for lib)

---

## File Map

**New files to create:**
```
types/index.ts
lib/resend.ts
lib/auth.ts
lib/__tests__/auth.test.ts
vitest.config.ts
.env.local                          (gitignored)
app/(public)/layout.tsx
app/(public)/page.tsx               (replaces app/page.tsx — delete old one)
app/(public)/about/page.tsx
app/(public)/contact/page.tsx
app/admin/layout.tsx
app/admin/page.tsx
app/admin/login/page.tsx
app/api/contact/route.ts
app/api/admin/login/route.ts
app/api/admin/logout/route.ts
app/api/admin/contacts/route.ts
app/api/admin/settings/route.ts
components/Navbar.tsx
components/Footer.tsx
components/ContactForm.tsx
components/admin/LoginForm.tsx
components/admin/AdminDashboard.tsx
components/admin/ContactsTable.tsx
components/admin/SearchFilter.tsx
components/admin/EmailToggle.tsx
```

**Files to modify:**
```
app/layout.tsx          — strip to html/body/fonts only (no nav)
app/globals.css         — remove dark-mode vars, keep Tailwind import
```

**Files to delete:**
```
app/page.tsx            — replaced by app/(public)/page.tsx
```

---

## Task 1: Install dependencies + environment setup

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.local`
- Create: `.gitignore` entry for `.env.local`

- [ ] **Step 1: Install runtime packages**

```bash
npm install nodemailer
```

Expected: packages added to `node_modules`, `package.json` dependencies updated.

- [ ] **Step 2: Install Vitest for unit testing**

```bash
npm install -D vitest
```

- [ ] **Step 3: Create `.env.local` with placeholder values**

Create `d:/Freelance/templates/.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme
ADMIN_EMAIL=dev.codeminal@gmail.com
ADMIN_SESSION_SECRET=replace-with-random-32-char-string

RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev

```

> **Note on RESEND_FROM_EMAIL:** During development, use `onboarding@resend.dev` (Resend's test address). For production, set up a verified domain in Resend and change this to `noreply@yourdomain.com`.

- [ ] **Step 4: Ensure `.env.local` is gitignored**

Open `.gitignore` (create if absent) and verify or add:

```
.env.local
.env*.local
.superpowers/
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: install email and test dependencies"
```

---

## Task 2: Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create `types/index.ts`**

```typescript
export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  created_at: string
}

export interface Settings {
  id: number
  email_enabled: boolean
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: Lib — Email client

**Files:**
- Create: `lib/resend.ts`

- [ ] **Step 1: Create `lib/resend.ts`**

```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/resend.ts
git commit -m "feat: add email client"
```

---

## Task 4: Lib — Auth helpers (TDD)

**Files:**
- Create: `lib/auth.ts`
- Create: `vitest.config.ts`
- Create: `lib/__tests__/auth.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Write the failing tests in `lib/__tests__/auth.test.ts`**

```typescript
import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.ADMIN_USERNAME = 'testadmin'
  process.env.ADMIN_PASSWORD = 'testpass'
  process.env.ADMIN_SESSION_SECRET = 'testsecret'
})

describe('createSessionToken', () => {
  it('returns a 64-char hex string', async () => {
    const { createSessionToken } = await import('../auth')
    const token = createSessionToken()
    expect(token).toMatch(/^[a-f0-9]{64}$/)
  })

  it('returns the same value on repeated calls', async () => {
    const { createSessionToken } = await import('../auth')
    expect(createSessionToken()).toBe(createSessionToken())
  })
})

describe('verifySession', () => {
  it('returns true for a valid token', async () => {
    const { createSessionToken, verifySession } = await import('../auth')
    expect(verifySession(createSessionToken())).toBe(true)
  })

  it('returns false for an invalid token', async () => {
    const { verifySession } = await import('../auth')
    expect(verifySession('not-valid')).toBe(false)
  })

  it('returns false for empty string', async () => {
    const { verifySession } = await import('../auth')
    expect(verifySession('')).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests — expect failure (module not found)**

```bash
npx vitest run lib/__tests__/auth.test.ts
```

Expected: FAIL — `Cannot find module '../auth'`

- [ ] **Step 4: Create `lib/auth.ts`**

```typescript
import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'

export const COOKIE_NAME = 'admin_session'

export function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET!
  const username = process.env.ADMIN_USERNAME!
  const password = process.env.ADMIN_PASSWORD!
  return createHash('sha256')
    .update(`${username}:${password}:${secret}`)
    .digest('hex')
}

export function verifySession(token: string): boolean {
  return token === createSessionToken()
}

export function isRequestAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifySession(token)
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run lib/__tests__/auth.test.ts
```

Expected: 5 tests PASS.

- [ ] **Step 6: Add test script to `package.json`**

In `package.json`, under `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Commit**

```bash
git add lib/auth.ts lib/__tests__/auth.test.ts vitest.config.ts package.json
git commit -m "feat: add auth helpers with unit tests"
```

---

## Task 5: Update root layout + globals

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `app/layout.tsx` — strip to html/body/fonts only**

Replace the entire file with:

```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Template',
  description: 'A clean, minimal site template.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update `app/globals.css` — keep Tailwind, remove dark-mode variables**

Replace the entire file with:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-geist-sans);
}
```

- [ ] **Step 3: Delete the old home page (will be replaced by route group)**

```bash
rm app/page.tsx
```

(On Windows PowerShell: `Remove-Item app/page.tsx`)

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git rm app/page.tsx
git commit -m "feat: update root layout to html/body only, remove default home page"
```

---

## Task 6: Navbar + Footer components

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create `components/Navbar.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight">
          Template
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/Footer.tsx`**

```typescript
import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          © {new Date().getFullYear()} Template
        </span>
        <div className="flex gap-6">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx components/Footer.tsx
git commit -m "feat: add Navbar and Footer components"
```

---

## Task 7: Public layout + Home page

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `app/(public)/page.tsx`

- [ ] **Step 1: Create `app/(public)/layout.tsx`**

```typescript
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(public)/page.tsx`**

```typescript
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-[88vh] text-center px-6">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
          Welcome
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Simple. Fast. Template.
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-10">
          A production-ready site skeleton — pages, contact form, email, and admin dashboard all wired up.
        </p>
        <Link
          href="/contact"
          className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
        >
          Get in Touch
        </Link>
      </section>

      <section className="border-t border-gray-100 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Template gives teams a solid, honest foundation. No bloat, no magic — just well-structured code you can build on.
          </p>
          <Link
            href="/about"
            className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Verify dev server renders correctly**

```bash
npm run dev
```

Open http://localhost:3000 — should show the hero section with Navbar and Footer.

- [ ] **Step 3: Commit**

```bash
git add "app/(public)/layout.tsx" "app/(public)/page.tsx"
git commit -m "feat: add public layout with Navbar/Footer and Home page"
```

---

## Task 8: About page

**Files:**
- Create: `app/(public)/about/page.tsx`

- [ ] **Step 1: Create `app/(public)/about/page.tsx`**

```typescript
const pillars = [
  {
    title: 'Mission',
    text: 'Empower teams to ship faster without sacrificing quality or maintainability.',
  },
  {
    title: 'Values',
    text: 'Simplicity, transparency, and developer experience above all else.',
  },
  {
    title: 'Team',
    text: 'A small distributed team of builders who care deeply about craft.',
  },
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        About Us
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Built for builders
      </h1>
      <p className="text-lg text-gray-500 mb-16 max-w-2xl">
        Template was created to give teams a starting point that is honest and minimal — nothing you don't need, everything you do.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map(({ title, text }) => (
          <div
            key={title}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/about — three cards should render with Navbar and Footer.

- [ ] **Step 3: Commit**

```bash
git add "app/(public)/about/page.tsx"
git commit -m "feat: add About page"
```

---

## Task 9: Contact form component + Contact page

**Files:**
- Create: `components/ContactForm.tsx`
- Create: `app/(public)/contact/page.tsx`

- [ ] **Step 1: Create `components/ContactForm.tsx`**

```typescript
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
```

- [ ] **Step 2: Create `app/(public)/contact/page.tsx`**

```typescript
import ContactForm from '@/components/ContactForm'

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        Contact
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in touch</h1>
      <p className="text-gray-500 mb-10">
        Fill out the form below and we'll respond as soon as possible.
      </p>
      <ContactForm />
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/contact — the 5-field form should render. The submit button will fail (API route not yet created) — that's expected.

- [ ] **Step 3: Commit**

```bash
git add components/ContactForm.tsx "app/(public)/contact/page.tsx"
git commit -m "feat: add ContactForm component and Contact page"
```

---

## Task 10: POST /api/contact route

**Files:**
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create `app/api/contact/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error: insertError } = await D1
    .from('contacts')
    .insert({ name, email, phone: phone || null, subject, message })

  if (insertError) {
    console.error('D1 insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save contact' }, { status: 500 })
  }

  const { data: settings } = await D1
    .from('settings')
    .select('email_enabled')
    .eq('id', 1)
    .single()

  if (settings?.email_enabled) {
    const from = process.env.RESEND_FROM_EMAIL!
    const adminEmail = process.env.ADMIN_EMAIL!

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
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: add POST /api/contact route"
```

---

## Task 11: Admin layout + server-side auth

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create `app/admin/layout.tsx`**

This layout does no auth check — auth is handled per-page via server component cookie reads.

```typescript
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add admin layout shell"
```

---

## Task 12: Admin auth API routes

**Files:**
- Create: `app/api/admin/login/route.ts`
- Create: `app/api/admin/logout/route.ts`

- [ ] **Step 1: Create `app/api/admin/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = createSessionToken()
  const res = NextResponse.json({ success: true })

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
```

- [ ] **Step 2: Create `app/api/admin/logout/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/login/route.ts app/api/admin/logout/route.ts
git commit -m "feat: add admin login/logout API routes"
```

---

## Task 13: Admin data API routes

**Files:**
- Create: `app/api/admin/contacts/route.ts`
- Create: `app/api/admin/settings/route.ts`

- [ ] **Step 1: Create `app/api/admin/contacts/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated } from '@/lib/auth'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: contacts, error } = await D1
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }

  return NextResponse.json({ contacts })
}
```

- [ ] **Step 2: Create `app/api/admin/settings/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { isRequestAuthenticated } from '@/lib/auth'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await D1
    .from('settings')
    .select('email_enabled')
    .eq('id', 1)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }

  return NextResponse.json({ email_enabled: data.email_enabled })
}

export async function PATCH(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email_enabled } = await req.json()

  const { error } = await D1
    .from('settings')
    .update({ email_enabled })
    .eq('id', 1)

  if (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/contacts/route.ts app/api/admin/settings/route.ts
git commit -m "feat: add admin contacts and settings API routes"
```

---

## Task 14: Admin UI components

**Files:**
- Create: `components/admin/ContactsTable.tsx`
- Create: `components/admin/SearchFilter.tsx`
- Create: `components/admin/EmailToggle.tsx`
- Create: `components/admin/LoginForm.tsx`

- [ ] **Step 1: Create `components/admin/ContactsTable.tsx`**

```typescript
import type { Contact } from '@/types'

interface Props {
  contacts: Contact[]
}

export default function ContactsTable({ contacts }: Props) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-sm">No contacts found</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Name', 'Email', 'Phone', 'Subject', 'Date', 'Message'].map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
              <td className="px-4 py-3 text-gray-500">{c.email}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.phone ?? '—'}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                  {c.subject}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(c.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td
                className="px-4 py-3 text-gray-500 max-w-xs truncate"
                title={c.message}
              >
                {c.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/admin/SearchFilter.tsx`**

```typescript
interface Props {
  search: string
  onSearchChange: (v: string) => void
  subjectFilter: string
  onSubjectChange: (v: string) => void
  dateFilter: string
  onDateChange: (v: string) => void
  subjects: string[]
}

const selectClass =
  'border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900'

export default function SearchFilter({
  search, onSearchChange,
  subjectFilter, onSubjectChange,
  dateFilter, onDateChange,
  subjects,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 mb-4 flex-wrap">
      <input
        type="text"
        placeholder="Search name, email, subject..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <select value={subjectFilter} onChange={e => onSubjectChange(e.target.value)} className={selectClass}>
        <option value="">All Subjects</option>
        {subjects.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select value={dateFilter} onChange={e => onDateChange(e.target.value)} className={selectClass}>
        <option value="">All Time</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/admin/EmailToggle.tsx`**

```typescript
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
```

- [ ] **Step 4: Create `components/admin/LoginForm.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Login</h1>
        <p className="text-sm text-gray-400 mb-6">Template dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text" required
              value={username} onChange={e => setUsername(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/admin/
git commit -m "feat: add admin UI components (table, filter, toggle, login form)"
```

---

## Task 15: Admin pages

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/page.tsx`
- Create: `components/admin/AdminDashboard.tsx`

- [ ] **Step 1: Create `components/admin/AdminDashboard.tsx`**

```typescript
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
```

- [ ] **Step 2: Create `app/admin/login/page.tsx`** (server component, redirects if already logged in)

```typescript
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
```

- [ ] **Step 3: Create `app/admin/page.tsx`** (server component, redirects if not logged in)

```typescript
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
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/admin/AdminDashboard.tsx app/admin/login/page.tsx app/admin/page.tsx
git commit -m "feat: add admin login and dashboard pages"
```

---

## Task 16: D1 schema + final smoke test

**Files:** (no code files — run SQL in D1 dashboard)

- [ ] **Step 1: Run this SQL in the D1 SQL editor**

Go to your D1 project → SQL Editor → New query, paste and run:

```sql
-- Contacts table
create table if not exists contacts (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  phone      text,
  subject    text not null,
  message    text not null,
  created_at timestamptz default now()
);

-- Settings table (single-row)
create table if not exists settings (
  id            int primary key default 1,
  email_enabled boolean not null default true,
  constraint single_row check (id = 1)
);

-- Seed the settings row
insert into settings (id, email_enabled)
values (1, true)
on conflict (id) do nothing;
```

- [ ] **Step 2: Fill in real values in `.env.local`**

Replace the placeholder values with your real keys:
- `RESEND_API_KEY` — from resend.com dashboard
- `ADMIN_SESSION_SECRET` — generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- [ ] **Step 3: Run the dev server and test the full flow**

```bash
npm run dev
```

1. Visit http://localhost:3000 — home page renders
2. Visit http://localhost:3000/about — about page renders
3. Visit http://localhost:3000/contact — fill in form, submit → success state
4. Check D1 → `contacts` table has a new row
5. Visit http://localhost:3000/admin — redirects to `/admin/login`
6. Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD` — redirects to dashboard
7. Dashboard shows the submitted contact
8. Search for the contact name — row filters correctly
9. Toggle email notifications off → toggle turns gray
10. Submit another contact form → no emails sent (row still saved in D1)
11. Toggle email back on
12. Click Logout → redirects to login page

- [ ] **Step 4: Run unit tests**

```bash
npm test
```

Expected: 5 tests PASS.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Template site — contact form, D1, email, admin dashboard"
```

---

## Environment Variable Reference

| Variable | Where to get it |
|---|---|
| `ADMIN_USERNAME` | You choose |
| `ADMIN_PASSWORD` | You choose |
| `ADMIN_EMAIL` | Your email for admin notifications |
| `ADMIN_SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (dev) or your verified domain (prod) |
