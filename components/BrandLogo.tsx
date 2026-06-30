import Image from 'next/image'

type BrandLogoProps = {
  className?: string
  theme?: 'light' | 'dark'
  titleClassName?: string
  subtitleClassName?: string
}

export default function BrandLogo({
  className = '',
  theme = 'light',
  titleClassName = '',
  subtitleClassName = '',
}: BrandLogoProps) {
  const titleColor = theme === 'dark' ? 'text-white' : 'text-[#0A2540]'
  const subtitleColor = 'text-[#C9A44C]'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/corplex-mark.png"
        alt="Corplex Global Accounting logo"
        width={1600}
        height={1600}
        className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
      />
      <span className="hidden h-12 w-px bg-[#C9A44C]/60 sm:block" />
      <span className="min-w-0">
        <span className={`block text-sm font-semibold tracking-[0.26em] sm:text-base ${titleColor} ${titleClassName}`}>
          CORPLEX GLOBAL
        </span>
        <span className={`block text-[11px] uppercase tracking-[0.28em] ${subtitleColor} ${subtitleClassName}`}>
          Accounting & Tax Consultancy
        </span>
      </span>
    </div>
  )
}
