export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/15 px-16 py-8 flex items-center justify-between">
      <span className="font-display text-gold text-lg tracking-wide">OmniDen</span>
      <span className="font-body text-muted text-[0.8125rem]">
        © {new Date().getFullYear()} OmniDen. All rights reserved.
      </span>
    </footer>
  )
}
