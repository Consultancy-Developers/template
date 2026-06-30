import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const serviceLinks = [
  'Accounting & Bookkeeping',
  'Tax Compliance',
  'Corporate Governance',
  'Virtual CFO Advisory',
]

const jurisdictionLinks = ['Australia', 'India', 'USA', 'UK', 'UAE']

const socialLinks = [
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://www.x.com', label: 'X', icon: 'x' },
  { href: 'https://www.instagram.com', label: 'Instagram', icon: 'instagram' },
] as const

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.5 8.75h3V20h-3V8.75ZM9.25 8.75h2.87v1.54h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59V20h-3v-5.18c0-1.24-.02-2.83-1.72-2.83-1.73 0-2 1.35-2 2.74V20h-3V8.75Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 2.75A5.25 5.25 0 1 1 6.75 12 5.26 5.26 0 0 1 12 6.75Zm0 2A3.25 3.25 0 1 0 15.25 12 3.25 3.25 0 0 0 12 8.75ZM17.6 5.4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M4.5 5.5h3.3l4.2 5.7 4.8-5.7h3.3l-6.4 7.5L20.5 18h-3.3l-4.6-6.1L8.1 18H4.8l6.9-8.1L4.5 5.5Z" />
        </svg>
      )
  }
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0A2540]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
        <div>
          <BrandLogo theme="dark" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
            Multi-jurisdiction accounting, tax compliance, and governance consultancy for executive teams that need disciplined execution.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/70">
            Copyright {new Date().getFullYear()} Corplex Global Accounting
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-white/80 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Services</p>
          <div className="mt-4 grid gap-3">
            {serviceLinks.map((item) => (
              <span key={item} className="text-sm text-white/80">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Jurisdictions</p>
          <div className="mt-4 grid gap-3">
            {jurisdictionLinks.map((item) => (
              <Link key={item} href="/#services" className="text-sm text-white/80 transition-colors hover:text-white">
                {item}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm font-semibold text-white">Social</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition-all duration-300 ease-out hover:border-[#C9A44C] hover:bg-[#12365A] hover:text-white hover:scale-120 hover:-translate-y-1 hover:rotate-6 hover:shadow-[0_8px_20px_rgba(201,164,76,0.3)]"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <SocialIcon icon={item.icon} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs uppercase tracking-[0.24em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>Trusted compliance · Expert advisory · Global growth</p>
          <p>Australia · India · USA · UK · UAE</p>
        </div>
      </div>
    </footer>
  )
}
