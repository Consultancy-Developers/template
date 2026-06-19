# Template Site — Design Spec
**Date:** 2026-06-05
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript · D1 · Resend

---

## Overview

A clean, minimal multi-page marketing site named **Template** with a contact form backed by D1, and a password-protected admin dashboard for managing submissions and email notifications.

---

## Visual Style

- **Palette:** Black (`#111`), white, and subtle grays (`#f9fafb`, `#e5e7eb`, `#6b7280`)
- **Typography:** Geist Sans (already in project)
- **Style:** White backgrounds, crisp borders, no gradients, no shadows except subtle card borders

---

## Pages & Routes

### Public (shared Navbar + Footer)

| Route | Page | Content |
|---|---|---|
| `/` | Home | Hero section, brief about blurb, CTA button → `/contact` |
| `/about` | About | Mission statement, values (3 cards), team blurb |
| `/contact` | Contact | 5-field form + success state |

### Admin (separate layout, no public nav)

| Route | Page | Content |
|---|---|---|
| `/admin/login` | Login | Username + password form |
| `/admin` | Dashboard | Stats, email toggle, contacts table with search/filter |

> **Route group note:** Public pages live under `app/(public)/` with their own layout that includes Navbar + Footer. Admin pages live under `app/(admin)/` with a plain layout. The root `app/layout.tsx` only contains `<html>`, `<body>`, and font setup — no nav.

---

## Components

```
components/
  Navbar.tsx          — Logo left, nav links right, Contact CTA button
  Footer.tsx          — copyright left, nav links right
  ContactForm.tsx     — 5-field form with loading + success states
  admin/
    ContactsTable.tsx — table with truncated message preview (full text on hover)
    SearchFilter.tsx  — text search + subject dropdown + date range dropdown
    EmailToggle.tsx   — toggle switch that calls PATCH /api/admin/settings
```

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | none | Validate fields, save to D1, conditionally send emails |
| `POST` | `/api/admin/login` | none | Verify credentials, set `admin_session` httpOnly cookie |
| `POST` | `/api/admin/logout` | cookie | Clear cookie |
| `GET` | `/api/admin/contacts` | cookie | Return all rows from `contacts` table |
| `PATCH` | `/api/admin/settings` | cookie | Update `email_enabled` in `settings` table |

All `/api/admin/*` routes (except login) check the `admin_session` cookie and return `401` if missing or invalid.

---

## D1 Schema

### `contacts`
```sql
create table contacts (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  phone      text,
  subject    text not null,
  message    text not null,
  created_at timestamptz default now()
);
```

### `settings`
```sql
create table settings (
  id             int primary key default 1,
  email_enabled  boolean not null default true
);

-- Seed the single row
insert into settings (id, email_enabled) values (1, true);
```

---

## Auth

- Admin credentials stored in environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- On successful login: set `admin_session` httpOnly cookie with value `sha256(username+password+secret)`
- Cookie is checked on every protected API route — no middleware needed
- No session expiry for simplicity (can be added later)

---

## Email Flow

Every contact submission:

1. Save contact row to D1 regardless of email setting
2. Fetch `settings.email_enabled`
3. If `true`: send two emails via Resend in parallel:
   - **Admin notification** → `ADMIN_EMAIL` — subject: `New contact from [name]`, body: all 5 fields
   - **Submitter confirmation** → their email — subject: `We received your message`, body: friendly confirmation
4. If `false`: skip emails silently

Admin can toggle `email_enabled` from the dashboard at any time. Change takes effect on the next submission.

---

## Admin Dashboard

- **Stats row:** Total contacts, contacts this month, email toggle
- **Search bar:** Free-text search across name, email, subject (client-side filter on fetched data)
- **Filters:** Subject dropdown (derived from unique subjects in data), Date range dropdown (All Time / This Week / This Month)
- **Table columns:** Name · Email · Phone · Subject · Date · Message (truncated, full text on hover)

---

## File Structure

```
app/
  layout.tsx                  — root layout (html/body/fonts only)
  (public)/
    layout.tsx                — wraps public pages with Navbar + Footer
    page.tsx                  — Home → /
    about/page.tsx            — About → /about
    contact/page.tsx          — Contact → /contact
  admin/
    layout.tsx                — plain layout, no public nav (outside (public) group)
    login/page.tsx            — Login → /admin/login
    page.tsx                  — Dashboard → /admin
  api/
    contact/route.ts
    admin/
      login/route.ts
      logout/route.ts
      contacts/route.ts
      settings/route.ts
components/
  Navbar.tsx
  Footer.tsx
  ContactForm.tsx
  admin/
    ContactsTable.tsx
    SearchFilter.tsx
    EmailToggle.tsx
lib/
  resend.ts                   — Resend client
  auth.ts                     — cookie helpers (sign, verify)
```

---

## Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme
ADMIN_EMAIL=dev.codeminal@gmail.com
ADMIN_SESSION_SECRET=random-secret-string

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

```

---

## Out of Scope

- Password reset for admin
- Multiple admin users
- Contact deletion from dashboard
- Pagination (client-side filter is sufficient for template volume)
- Dark mode
