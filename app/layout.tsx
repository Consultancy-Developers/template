import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Corplex Global Accounting | Multi-Jurisdiction Accounting & Tax Consultancy',
  description:
    'Corplex Global Accounting delivers premium accounting, tax compliance and corporate governance services across India, USA, UK and UAE.',
  keywords: [
    'accounting consultancy',
    'tax compliance',
    'corporate governance',
    'India accounting firm',
    'multi-jurisdiction accounting',
    'bookkeeping services',
  ],
  openGraph: {
    title: 'Corplex Global Accounting',
    description:
      'Premium accounting, tax compliance, and corporate governance consultancy across India, USA, UK, and UAE.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
