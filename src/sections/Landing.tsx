import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Landing.css'

const TITLE = 'OmniDen'

export default function Landing() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = titleRef.current?.querySelectorAll('.landing-letter')
    if (!letters?.length) return

    const tl = gsap.timeline()
    tl.from(letters, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
    })
      .from(taglineRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    const bounce = gsap.to(indicatorRef.current, {
      y: 10,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })

    return () => {
      tl.kill()
      bounce?.kill()
    }
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="landing"
      className="landing-grain landing-glow relative h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative z-10 text-center px-8">
        <h1
          ref={titleRef}
          className="font-display text-cream flex justify-center leading-none tracking-[-0.02em] mb-6"
          style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)' }}
          aria-label={TITLE}
        >
          {TITLE.split('').map((char, i) => (
            <span key={i} className="landing-letter inline-block" aria-hidden="true">
              {char}
            </span>
          ))}
        </h1>
        <p
          ref={taglineRef}
          className="font-body text-muted uppercase tracking-[0.18em] mb-12"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
        >
          Where Strategy Meets Excellence.
        </p>
        <button
          type="button"
          ref={ctaRef}
          onClick={scrollToAbout}
          className="font-body text-[0.8125rem] uppercase tracking-[0.15em] text-cream bg-transparent border border-gold px-11 py-4 cursor-pointer transition-colors duration-300 hover:bg-gold hover:text-black"
        >
          Explore Our Work
        </button>
      </div>
      <div
        ref={indicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold opacity-60"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
