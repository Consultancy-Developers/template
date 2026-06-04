import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = ['landing', 'about', 'showcase', 'contact'] as const
type Section = (typeof SECTIONS)[number]

const LABELS: Record<Section, string> = {
  landing: 'Home',
  about: 'About',
  showcase: 'Showcase',
  contact: 'Contact',
}

export default function Navbar() {
  const [active, setActive] = useState<Section>('landing')
  const [scrolled, setScrolled] = useState(false)
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    triggersRef.current = SECTIONS.flatMap((id) => {
      const el = document.getElementById(id)
      if (!el) return []
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      })
    })
    return () => {
      triggersRef.current.forEach((t) => t.kill())
    }
  }, [])

  const scrollTo = (id: Section) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6 transition-all duration-300',
        scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent',
      ].join(' ')}
    >
      <span className="font-display text-gold text-2xl tracking-[0.05em] select-none">
        OmniDen
      </span>
      <ul className="flex gap-10 list-none m-0 p-0">
        {SECTIONS.map((id) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className={[
                'bg-transparent border-0 font-body text-[0.8125rem] tracking-[0.12em] uppercase cursor-pointer pb-0.5 border-b-2 transition-colors duration-200',
                active === id
                  ? 'text-gold border-gold'
                  : 'text-cream border-transparent hover:text-gold hover:border-gold',
              ].join(' ')}
            >
              {LABELS[id]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
