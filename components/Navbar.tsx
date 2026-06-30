'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import BrandLogo from '@/components/BrandLogo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#global-reach', label: 'Global Reach' },
  { href: '/#resources', label: 'Resources' },
  { href: '/#faqs', label: 'FAQs' },
  { href: '/#founder', label: 'Founder' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const isOpaque = scrolled || mobileOpen || pathname !== '/'

  useEffect(() => {
    // Set initial hash client-side
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentHash(window.location.hash)

    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/') {
      return
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/') {
      return
    }

    const sections = ['services', 'about', 'global-reach', 'resources', 'faqs', 'founder', 'contact']

    const handleScrollSpy = () => {
      // 1. If at the top of the page, highlight Home
      if (window.scrollY < 150) {
        setCurrentHash('')
        return
      }

      // 2. Check if the user reached the absolute bottom of the page
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120
      if (scrolledToBottom) {
        setCurrentHash('#contact')
        return
      }

      // 3. Find the section currently intersecting the active viewport horizontal line
      let activeSection = ''
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 250 && rect.bottom >= 150) {
            activeSection = `#${id}`
          }
        }
      })

      if (activeSection) {
        setCurrentHash(activeSection)
      }
    }

    handleScrollSpy()
    window.addEventListener('scroll', handleScrollSpy)
    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [pathname])

  const isActive = (href: string) => {
    const normHash = currentHash.replace(/^[\/#]+/, '')
    const normHref = href.replace(/^[\/#]+/, '')

    if (normHref === '') {
      return pathname === '/' && (normHash === '' || normHash === '#')
    }

    if (pathname === '/') {
      return normHash === normHref
    }

    return pathname === href || pathname.startsWith(href)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/' && pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.pushState(null, '', '/')
      setCurrentHash('')
      setMobileOpen(false)
    } else if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault()
      const id = href.replace('/#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', `#${id}`)
        setCurrentHash(`#${id}`)
      }
      setMobileOpen(false)
    }
  }

  return (
    <>
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isOpaque 
            ? 'bg-white/98 border-b border-[#E5E7EB] shadow-sm text-[#0A2540] backdrop-blur-sm' 
            : 'bg-transparent border-b border-transparent text-white'
        }`}
      >
        <div className="w-full">
          <div className="flex h-20 items-center justify-between pl-6 pr-6 sm:pl-8 sm:pr-8 lg:pl-14 lg:pr-14">
            <Link href="/" className="flex items-center">
              <BrandLogo 
                titleClassName={isOpaque ? 'text-[#0A2540]' : 'text-white'} 
                subtitleClassName={isOpaque ? 'text-[#1A1A1A]/70' : 'text-white/70'} 
              />
            </Link>

            <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
              {navLinks.map(({ href, label }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => handleLinkClick(e, href)}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                      active
                        ? isOpaque
                          ? 'border-[#0A2540]/25 bg-[#0A2540]/10 text-[#0A2540] shadow-[0_8px_20px_rgba(10,37,64,0.04)] font-bold'
                          : 'border-white/30 bg-white/20 text-white shadow-[0_8px_20px_rgba(255,255,255,0.08)] font-bold'
                        : isOpaque
                          ? 'border-transparent bg-transparent text-[#1A1A1A]/70 hover:border-[#E5E7EB] hover:bg-[#F5F7FA] hover:text-[#0A2540]'
                          : 'border-transparent bg-transparent text-white/75 hover:border-white/25 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
              <span className={`mx-3 h-5 w-px ${isOpaque ? 'bg-[#E5E7EB]' : 'bg-white/20'}`} />
              <Link
                href="/#contact"
                onClick={(e) => handleLinkClick(e, '/#contact')}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  isOpaque
                    ? 'bg-[#0A2540] text-white hover:bg-[#12365a] shadow-[0_10px_30px_rgba(10,37,64,0.22)]'
                    : 'bg-white text-[#0A2540] hover:bg-white/90 shadow-[0_10px_30px_rgba(255,255,255,0.15)]'
                }`}
              >
                Book a Free Consultation
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all sm:hidden ${
                isOpaque 
                  ? 'border-[#E5E7EB] text-[#0A2540] hover:bg-[#F5F7FA]' 
                  : 'border-white/20 text-white bg-white/5'
              }`}
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-4 bg-current" />
                <span className="h-0.5 w-4 bg-current" />
                <span className="h-0.5 w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:hidden">
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0_12px_40px_rgba(10,37,64,0.08)]">
              <div className="grid gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-3">
                {navLinks.map(({ href, label }) => {
                  const active = isActive(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={(e) => handleLinkClick(e, href)}
                      className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                        active
                          ? 'border-[#0A2540]/20 bg-[#0A2540]/10 text-[#0A2540] font-bold'
                          : 'border-[#E5E7EB] bg-white text-[#1A1A1A]/70 hover:border-[#D7DDE5] hover:text-[#0A2540]'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
                <Link
                  href="/#contact"
                  onClick={(e) => handleLinkClick(e, '/#contact')}
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#0A2540] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(10,37,64,0.16)]"
                >
                  Book a Free Consultation
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </nav>
      {/* Spacer for non-home pages to push content below the fixed solid navbar */}
      {pathname !== '/' && <div className="h-20" />}
    </>
  )
}
