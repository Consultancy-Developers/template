'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { Lock, ArrowRight, Check } from 'lucide-react'

const easeCurve = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeCurve } },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: easeCurve } },
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: easeCurve } },
}

const viewport = { once: true, amount: 0.15 }

const jurisdictions = {
  Australia: {
    title: 'Australia - BAS, GST, Payroll, PAYG & ATO Compliance',
    intro:
      'Governed by the Australian Taxation Office (ATO), Treasury, and ASIC under Australian Accounting Standards (AASB). We provide complete compliance management for Australian businesses.',
    cards: [
      {
        title: 'ATO BAS & GST Compliance',
        bullets: [
          'Business Activity Statement (BAS) preparation and ATO lodgement',
          'GST registration, calculation, and active reconciliation',
          'IAS (Instalment Activity Statement) management',
          'ATO audit representation and penalty mitigation support',
        ],
      },
      {
        title: 'Payroll & PAYG Services',
        bullets: [
          'Single Touch Payroll (STP) configuration and weekly/monthly filing',
          'PAYG (Pay As You Go) withholding calculations and payments',
          'Superannuation guarantee contribution reconciliation and clearing house management',
          'Fringe Benefits Tax (FBT) advice and annual returns',
        ],
      },
      {
        title: 'ASIC Company Compliance',
        bullets: [
          'ASIC annual company review and solvency statement lodgement',
          'ASIC registry maintenance, company setup, and share structure registry',
          'Solvency resolutions and corporate registers management',
          'Director ID registration and regulatory compliance',
        ],
      },
      {
        title: 'ATO Tax Returns & SMSF',
        bullets: [
          'Company Tax Return (CTR) preparation and ATO lodgement',
          'Sole trader, partnership, and trust tax returns (ITR)',
          'SMSF (Self-Managed Super Fund) setup, administration and compliance support',
          'Division 7A loan agreements compliance and advice',
        ],
      },
      {
        title: 'Virtual CFO & Bookkeeping',
        bullets: [
          'Daily cloud bookkeeping on Xero (Australia custom chart of accounts)',
          'Monthly management reporting and cash flow tracking',
          'Superannuation guarantee and ATO debt payment plan management',
          'Strategic growth advice and KPI dashboards',
        ],
      },
    ],
  },
  India: {
    title: 'India - GST, Income Tax, MCA & Labour Compliance',
    intro:
      'Governed by the Income Tax Act 1961, GST Act 2017, Companies Act 2013, and EPF & Miscellaneous Provisions Act 1952. Filings are administered through CBDT, GSTN, MCA21, and EPFO/ESIC portals.',
    cards: [
      {
        title: 'Accounting & Bookkeeping',
        bullets: [
          'Day-to-day transaction recording and categorisation',
          'Bank and ledger reconciliations across UPI, NEFT, and RTGS',
          'GAAP-compliant Balance Sheet, P&L, and Cash Flow statements',
          'MIS dashboard reporting for leadership teams',
        ],
      },
      {
        title: 'GST Registration & Compliance',
        bullets: [
          'Turnkey GST registration, mandatory and voluntary',
          'GSTR-1 and GSTR-3B monthly or quarterly filing',
          'GSTR-2A automated ITC reconciliation',
          'Annual GSTR-9 and GSTR-9C audit filing',
        ],
      },
      {
        title: 'Income Tax - Corporate & Individual',
        bullets: [
          'Advance tax quarterly estimates and planning',
          'ITR filing across forms ITR-1 through ITR-7',
          'Tax audit preparation: Form 3CA, 3CB, and 3CD',
          'Assessment and appellate representation',
        ],
      },
      {
        title: 'PF & ESI Labour Compliance',
        bullets: [
          'Employer code registration under the EPF Act',
          'Monthly ECR filing and contribution reconciliation',
          'ESI registration, challan, and muster roll maintenance',
          'EPFO and ESIC inspection representation',
        ],
      },
      {
        title: 'MCA / ROC Compliance',
        bullets: [
          'Company incorporation: Pvt Ltd, OPC, and LLP',
          'Annual filings AOC-4 and MGT-7',
          'Director KYC, DIN, and digital signature management',
          'EPF and ESI registration, filing, and representation',
        ],
      },
      {
        title: 'Virtual CFO Advisory',
        bullets: [
          'Budget variance tracking with corrective commentary',
          '13-week cash flow modelling',
          'Multi-year financial forecasting',
          'Treasury and capital optimisation strategies',
        ],
      },
    ],
  },
  USA: {
    title: 'United States - IRS, State Tax, Payroll & GAAP Compliance',
    intro:
      'Governed by the Internal Revenue Code, SEC regulations, and US GAAP (FASB). Federal filings flow through the IRS, while payroll is administered under FLSA rules.',
    cards: [
      {
        title: 'US GAAP Bookkeeping',
        bullets: [
          'Full-cycle bookkeeping under US GAAP multi-currency',
          'QuickBooks Online and Xero setup and configuration',
          'Chart of accounts for LLC, C-Corp, and S-Corp entities',
          'Monthly close reporting for Balance Sheet, P&L, and Cash Flow',
        ],
      },
      {
        title: 'Federal & State Tax Compliance',
        bullets: [
          'Form 1120, 1120-S, 1065, and 1040 preparation',
          'State income and franchise tax returns',
          'Quarterly estimated tax payments',
          'Sales and use tax nexus analysis and filings',
        ],
      },
      {
        title: 'Cross-Border & Transfer Pricing',
        bullets: [
          'FBAR (FinCEN 114) and FATCA Form 8938 filing',
          'Form 5471 and 5472 foreign subsidiary reporting',
          'Transfer pricing documentation',
          'India-USA DTAA structuring',
        ],
      },
      {
        title: 'Payroll & HR Compliance',
        bullets: [
          'Federal payroll tax Form 941 quarterly filing',
          'FUTA and SUTA state unemployment filings',
          'W-2 and 1099 preparation and distribution',
          'LLC, C-Corp, S-Corp, DE and WY formation support',
        ],
      },
      {
        title: 'Entity Formation & Advisory',
        bullets: [
          'LLC, C-Corp, S-Corp, Delaware and Wyoming formation',
          'EIN registration and operating agreement support',
          'Registered agent and annual state filings',
          'Entity structure review for cross-border groups',
        ],
      },
      {
        title: 'Cloud Accounting & Offshore Teams',
        bullets: [
          'Dedicated offshore teams for US CPA firms',
          'Ledger cleanup and migration across QBO, Xero, and Zoho',
          'Month-end close acceleration',
          'Real-time dashboard reporting',
        ],
      },
    ],
  },
  UK: {
    title: 'United Kingdom - HMRC, Companies House & MTD Compliance',
    intro:
      'Governed by the Income Tax Act 2007, Corporation Tax Act 2010, Companies Act 2006, and VAT Act 1994. Reporting runs through HMRC, Companies House, and the Pensions Regulator under UK GAAP and IFRS.',
    cards: [
      {
        title: 'Limited Companies Bookkeeping',
        bullets: [
          'Full-cycle bookkeeping under UK GAAP (FRS 102/105) for Limited Companies',
          'Xero and QuickBooks Making Tax Digital (MTD) ready configuration',
          'Statutory accounts preparation for Companies House filing',
          'Multi-currency ledger management across GBP, USD, and EUR',
        ],
      },
      {
        title: 'HMRC Corporation Tax (CT600)',
        bullets: [
          'Annual Corporation Tax Return (CT600) preparation and HMRC filing',
          'Quarterly instalment payment tracking and corporation tax planning',
          'R&D tax relief claims (SME and RDEC schemes)',
          'Capital allowances claims, AIA, and full expensing optimisation',
        ],
      },
      {
        title: 'HMRC Self-Assessment (SA100)',
        bullets: [
          'Self-Assessment tax return (SA100) for directors, landlords, and partners',
          'Non-domicile tax planning and remittance basis calculations',
          'Capital Gains Tax (CGT) property and share transaction reporting',
          'UK-India DTAA advice for dual-resident tax status',
        ],
      },
      {
        title: 'HMRC VAT & CIS Compliance',
        bullets: [
          'VAT registration and quarterly VAT submissions via Making Tax Digital (MTD)',
          'Construction Industry Scheme (CIS) contractor and subcontractor returns',
          'VAT scheme advice: standard, flat rate, and cash accounting',
          'HMRC VAT inspection support and penalty mitigation',
        ],
      },
      {
        title: 'Companies House Compliance',
        bullets: [
          'Limited Company (Ltd), LLP, and UK Branch incorporation',
          'Confirmation Statement (CS01) annual filing and registry updates',
          'Share allocation, structure changes, and PSC register maintenance',
          'Companies House regulatory filing and corporate secretary services',
        ],
      },
      {
        title: 'UK Payroll & Auto-Enrolment',
        bullets: [
          'Real Time Information (RTI) payroll submissions to HMRC',
          'PAYE and National Insurance (NI) calculations and payments',
          'Auto-enrolment workplace pension compliance with Nest and others',
          'P60, P11D benefits-in-kind, P45 processing, and CIS payroll alignment',
        ],
      },
    ],
  },
  UAE: {
    title: 'UAE - FTA VAT, Corporate Tax, ESR & WPS Compliance',
    intro:
      'Governed by the FTA for VAT and Corporate Tax. Free Zone entities follow DIFC, ADGM, and JAFZA regulations, with reporting under IFRS.',
    cards: [
      {
        title: 'UAE VAT Compliance',
        bullets: [
          'VAT registration on the FTA EmaraTax portal',
          'Quarterly VAT return preparation and submission (VAT201)',
          'Input tax credit reconciliation and Voluntary Disclosure management',
          'FTA audit defence and representation',
        ],
      },
      {
        title: 'Corporate Tax (CT) Readiness',
        bullets: [
          'CT registration with the FTA',
          'Taxable income computation for standard and free zone entities',
          'CT return filing (CIT100)',
          'Small Business Relief and transfer pricing disclosure support',
        ],
      },
      {
        title: 'UAE-Standard Bookkeeping',
        bullets: [
          'IFRS-compliant bookkeeping for mainland and branches',
          'Free Zone entity accounting for DIFC, ADGM, and JAFZA',
          'Multi-currency general ledger in AED, USD, GBP, and INR',
          'Annual financial statements and audit packages',
        ],
      },
      {
        title: 'Payroll & WPS Compliance',
        bullets: [
          'Monthly payroll aligned to MOHRE WPS requirements',
          'WPS SIF file generation and bank submission',
          'ESR notification and annual ESR report preparation',
          'UAE Beneficial Owner register and AML / FATF advisory',
        ],
      },
      {
        title: 'Economic Substance Regulations (ESR)',
        bullets: [
          'ESR notification to licensing authority',
          'Annual ESR report and substance test analysis',
          'Relevant activity determination',
          'Penalty mitigation advisory',
        ],
      },
      {
        title: 'Cross-Border & Structuring',
        bullets: [
          'UAE-India DTAA planning',
          'Free zone versus mainland CT optimisation',
          'Beneficial Owner (UBO) register compliance',
          'AML and FATF compliance advisory',
        ],
      },
    ],
  },
} as const

const industryVerticals = [
  'E-commerce & Marketplaces',
  'IT & Cross-Border Services',
  'SaaS & Tech Ventures',
  'Retail & Distribution',
  'Manufacturing & Logistics',
  'Healthcare & Diagnostics',
  'Real Estate & Infrastructure',
  'Unlisted Public & Private Corporations',
]

const technologyPlatforms = [
  {
    name: 'QuickBooks Online',
    description: 'Reliable SMB and mid-market accounting workflows with clean automation and reporting layers.',
    icon: (
      <svg className="h-6 w-6 text-emerald-500 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: 'Xero',
    description: 'Cloud-led collaboration for distributed finance teams, advisors, and operators.',
    icon: (
      <svg className="h-6 w-6 text-sky-500 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    name: 'Zoho Books',
    description: 'Integrated financial control for businesses that want governance and speed in one stack.',
    icon: (
      <svg className="h-6 w-6 text-amber-500 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
]

const differentiators = [
  {
    title: 'Multi-Jurisdiction Expertise',
    text: 'Practical execution across India, USA, UK, and UAE with a single accountable operating model.',
  },
  {
    title: 'Compliance-First Approach',
    text: 'Controls, deadlines, and documentation are designed around audit readiness and regulatory clarity.',
  },
  {
    title: 'Cloud Accounting Infrastructure',
    text: 'Modern finance stacks with structured data, secure processes, and executive-level visibility.',
  },
  {
    title: 'Dedicated Strategic Advisory',
    text: 'Direct access to senior professionals who can translate complexity into actionable guidance.',
  },
]

const stats = [
  { value: '8+', label: 'Years Experience' },
  { value: '5', label: 'Countries Served', desc: 'IN, US, UK, AU, UAE' },
  { value: '3', label: 'Core Services', desc: 'Accounting, Taxation, Business Advisory' },
  { value: '1 Day', label: 'Response Time', desc: 'SLA Commitment' },
]

const serviceTabs = Object.keys(jurisdictions) as Array<keyof typeof jurisdictions>

function SectionHeading({
  eyebrow,
  title,
  text,
  inverse = false,
  center = false,
}: {
  eyebrow: string
  title: string
  text?: string
  inverse?: boolean
  center?: boolean
}) {
  const eyebrowClass = inverse ? 'text-[#C9A44C]' : 'text-[#C9A44C]'
  const titleClass = inverse ? 'text-white' : 'text-[#0A2540]'
  const textClass = inverse ? 'text-white/80' : 'text-[#1A1A1A]/70'

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}
    >
      <p className={`mb-4 text-xs font-medium uppercase tracking-[0.35em] ${eyebrowClass}`}>
        {eyebrow}
      </p>
      <h2 className={`font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-4xl lg:text-5xl ${titleClass}`}>
        {title}
      </h2>
      {text ? <p className={`mt-4 text-base leading-8 sm:text-lg ${textClass}`}>{text}</p> : null}
    </motion.div>
  )
}

function SurfaceCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#E5E7EB] bg-white ${className}`}>{children}</div>
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 25 } },
}

function InteractiveWidget({ serviceName, jurisdiction }: { serviceName: string; jurisdiction: string }) {
  const name = serviceName.toLowerCase()
  const country = jurisdiction.toLowerCase()

  if (name.includes('accounting') || name.includes('bookkeeping')) {
    // Transaction Ledger widget
    let txs = [
      { id: 1, desc: 'Stripe Transfer', amt: '$12,450.00', status: 'Settled', date: 'Today' },
      { id: 2, desc: 'Chase Bank Feed Sync', amt: 'Balanced', status: 'Verified', date: 'Today' },
      { id: 3, desc: 'ACH Vendor Payout', amt: '$3,800.00', status: 'Settled', date: 'Yesterday' },
    ]

    if (country === 'australia') {
      txs = [
        { id: 1, desc: 'Stripe Payout AUD', amt: '$8,450.00', status: 'Settled', date: 'Today' },
        { id: 2, desc: 'Xero Bank Feed Sync', amt: 'Balanced', status: 'Verified', date: 'Today' },
        { id: 3, desc: 'Superannuation Clearing', amt: '$2,100.00', status: 'Settled', date: 'Yesterday' },
      ]
    } else if (country === 'india') {
      txs = [
        { id: 1, desc: 'UPI Invoice payout', amt: '₹1,45,000.00', status: 'Settled', date: 'Today' },
        { id: 2, desc: 'HDFC Corporate Wire', amt: '₹8,50,000.00', status: 'Settled', date: 'Yesterday' },
        { id: 3, desc: 'Reconciled GST Ledger', amt: 'Balanced', status: 'Verified', date: 'Just Now' },
      ]
    } else if (country === 'uk') {
      txs = [
        { id: 1, desc: 'BACS Vendor Transfer', amt: '£4,250.00', status: 'Settled', date: 'Today' },
        { id: 2, desc: 'Barclays Bank Feed', amt: 'Balanced', status: 'Verified', date: 'Today' },
        { id: 3, desc: 'VAT Refund Claim', amt: '£1,890.00', status: 'Settled', date: 'Yesterday' },
      ]
    } else if (country === 'uae') {
      txs = [
        { id: 1, desc: 'WPS Payroll Transfer', amt: 'AED 38,400.00', status: 'Settled', date: 'Today' },
        { id: 2, desc: 'Emirates NBD Wire', amt: 'AED 1,20,000.00', status: 'Settled', date: 'Yesterday' },
        { id: 3, desc: 'Corporate Tax Reserve', amt: 'Balanced', status: 'Verified', date: 'Just Now' },
      ]
    }

    return (
      <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">Real-Time Ledger</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-2.5">
          {txs.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-1 rounded-xl bg-white/[0.02] border border-white/5 p-2.5 hover:border-white/10 transition-colors text-left"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white truncate max-w-[130px]">{tx.desc}</span>
                <span className="text-[#C9A44C] font-semibold">{tx.amt}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] text-white/50">
                <span>{tx.date}</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 font-semibold uppercase tracking-wider">{tx.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (name.includes('tax') || name.includes('gst') || name.includes('vat')) {
    // Tax filing timeline widget
    let steps = [
      { id: 1, title: 'Form 1120 Compilation', status: 'complete' },
      { id: 2, title: 'State Franchise Tax Check', status: 'complete' },
      { id: 3, title: 'IRS E-Filing Submission', status: 'active' },
    ]

    if (country === 'australia') {
      steps = [
        { id: 1, title: 'Quarterly GST Reconciliation', status: 'complete' },
        { id: 2, title: 'Superannuation Contribution Check', status: 'complete' },
        { id: 3, title: 'BAS Lodgement via Portal', status: 'active' },
      ]
    } else if (country === 'india') {
      steps = [
        { id: 1, title: 'GSTR-1 & 3B Reconciliation', status: 'complete' },
        { id: 2, title: 'Form 3CD Tax Audit Prep', status: 'complete' },
        { id: 3, title: 'GSTN Portal Filing', status: 'active' },
      ]
    } else if (country === 'uk') {
      steps = [
        { id: 1, title: 'HMRC VAT Reconciliation', status: 'complete' },
        { id: 2, title: 'CT600 Corp Tax Form Prep', status: 'complete' },
        { id: 3, title: 'HMRC Gateway Submission', status: 'active' },
      ]
    } else if (country === 'uae') {
      steps = [
        { id: 1, title: 'FTA VAT Return Prep', status: 'complete' },
        { id: 2, title: 'UAE Corporate Tax Check', status: 'complete' },
        { id: 3, title: 'EmaraTax Portal Submission', status: 'active' },
      ]
    }

    return (
      <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">Filing Pipeline</span>
          <span className="rounded bg-[#C9A44C]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#C9A44C] uppercase">Q2 Active</span>
        </div>
        <div className="relative pl-6 space-y-4 text-left">
          {/* Timeline bar */}
          <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-white/10" />

          {steps.map((step, idx) => {
            const isActive = step.status === 'active'
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="relative flex flex-col gap-1"
              >
                <div
                  className={`absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 ${isActive ? 'border-[#C9A44C] bg-black animate-ping' : 'border-emerald-500 bg-emerald-500'
                    }`}
                />
                <div
                  className={`absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 ${isActive ? 'border-[#C9A44C] bg-black' : 'border-emerald-500 bg-emerald-500'
                    }`}
                />
                <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {step.title}
                </span>
                <span className="text-[9px] text-white/40">
                  {step.status === 'complete' ? 'Reconciled & Locked' : 'Pending Authorization'}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  if (name.includes('cfo') || name.includes('advisory') || name.includes('structure') || name.includes('pricing') || name.includes('cross-border')) {
    // Projections chart widget
    let data = [
      { year: 'Y1', value: '$100k', height: 51 },
      { year: 'Y2', value: '$119k', height: 60 },
      { year: 'Y3', value: '$140k', height: 71 },
      { year: 'Y4', value: '$166k', height: 84 },
      { year: 'Y5', value: '$197k', height: 100 },
    ]
    let yoy = '+18.5%'

    if (country === 'australia') {
      yoy = '+19.2%'
      data = [
        { year: 'Y1', value: '$90k', height: 53 },
        { year: 'Y2', value: '$108k', height: 63 },
        { year: 'Y3', value: '$128k', height: 75 },
        { year: 'Y4', value: '$153k', height: 90 },
        { year: 'Y5', value: '$170k', height: 100 },
      ]
    } else if (country === 'india') {
      yoy = '+22.4%'
      data = [
        { year: 'Y1', value: '₹50L', height: 45 },
        { year: 'Y2', value: '₹61L', height: 55 },
        { year: 'Y3', value: '₹75L', height: 67 },
        { year: 'Y4', value: '₹92L', height: 82 },
        { year: 'Y5', value: '₹112L', height: 100 },
      ]
    } else if (country === 'uk') {
      yoy = '+14.2%'
      data = [
        { year: 'Y1', value: '£80k', height: 59 },
        { year: 'Y2', value: '£91k', height: 67 },
        { year: 'Y3', value: '£104k', height: 76 },
        { year: 'Y4', value: '£119k', height: 88 },
        { year: 'Y5', value: '£136k', height: 100 },
      ]
    } else if (country === 'uae') {
      yoy = '+16.8%'
      data = [
        { year: 'Y1', value: 'AED 200k', height: 54 },
        { year: 'Y2', value: 'AED 234k', height: 63 },
        { year: 'Y3', value: 'AED 273k', height: 73 },
        { year: 'Y4', value: 'AED 319k', height: 86 },
        { year: 'Y5', value: 'AED 372k', height: 100 },
      ]
    }

    return (
      <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">Projection Engine</span>
          <span className="text-[9px] text-[#C9A44C] font-semibold">{yoy} YoY</span>
        </div>
        <div className="flex h-36 items-end justify-between gap-2 pt-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
              {/* Value label */}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.4 }}
                className="text-[9px] font-bold text-[#C9A44C] mb-1"
              >
                {item.value}
              </motion.span>

              {/* Bar container with fixed height */}
              <div className="relative w-full h-20 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.height}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#C9A44C]/30 to-[#C9A44C] shadow-[0_4px_15px_rgba(201,164,76,0.2)]"
                />
              </div>

              {/* Year label */}
              <span className="text-[8px] font-semibold text-white/40 mt-1.5">{item.year}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default Fallback: Security / Regulatory Status Card
  let complianceLabel = 'Full-Scale Governance'
  let complianceDesc = 'Monitored regulatory channels across global corporate jurisdictions.'

  if (country === 'australia') {
    complianceLabel = 'ATO & ASIC Governance'
    complianceDesc = 'Aligned with STP, BAS, Superannuation and corporate secretarial regulations.'
  } else if (country === 'india') {
    complianceLabel = 'MCA & Labour compliance'
    complianceDesc = 'Aligned with ROC, EPFO, ESIC and statutory audit requirements.'
  } else if (country === 'uk') {
    complianceLabel = 'Companies House filings'
    complianceDesc = 'Ensuring FRS standards compliance and active confirmation statement filing.'
  } else if (country === 'uae') {
    complianceLabel = 'ESR & FTA alignment'
    complianceDesc = 'Adhering to UAE Economic Substance rules and tax registrations.'
  } else if (country === 'usa') {
    complianceLabel = 'IRS & State Governance'
    complianceDesc = 'Structured for SEC filings, Delaware Franchise compliance, and W-2/1099 compliance.'
  }

  return (
    <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg backdrop-blur-md text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A44C]/10 text-[#C9A44C]">
        <Lock className="h-6 w-6" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">Compliance Shield</span>
      <p className="mt-2 text-xs font-semibold text-white">{complianceLabel}</p>
      <p className="mt-1 text-[9px] text-white/50 leading-relaxed">
        {complianceDesc}
      </p>
      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#C9A44C]/10 py-1.5 text-[9px] font-semibold text-[#C9A44C] uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C] animate-pulse" />
        Audit Ready Status
      </div>
    </div>
  )
}

function CountryFlag({ country, className = "h-6 w-6" }: { country: string; className?: string }) {
  const getFlag = () => {
    switch (country) {
      case 'India':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="indiaClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#indiaClip)">
              <rect x="0" y="0" width="100" height="33.33" fill="#FF9933" />
              <rect x="0" y="33.33" width="100" height="33.33" fill="#FFFFFF" />
              <rect x="0" y="66.66" width="100" height="33.34" fill="#138808" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="#000080" strokeWidth="1" />
              <circle cx="50" cy="50" r="1.5" fill="#000080" />
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 8 * Math.cos((i * Math.PI) / 4)}
                  y2={50 + 8 * Math.sin((i * Math.PI) / 4)}
                  stroke="#000080"
                  strokeWidth="0.75"
                />
              ))}
            </g>
          </svg>
        )
      case 'USA':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="usaClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#usaClip)">
              {[...Array(13)].map((_, i) => (
                <rect
                  key={i}
                  x="0"
                  y={(i * 100) / 13}
                  width="100"
                  height={100 / 13}
                  fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
                />
              ))}
              <rect x="0" y="0" width="50" height="53.8" fill="#3C3B6E" />
              <circle cx="10" cy="11" r="1.5" fill="#FFFFFF" />
              <circle cx="25" cy="11" r="1.5" fill="#FFFFFF" />
              <circle cx="40" cy="11" r="1.5" fill="#FFFFFF" />
              <circle cx="17.5" cy="22" r="1.5" fill="#FFFFFF" />
              <circle cx="32.5" cy="22" r="1.5" fill="#FFFFFF" />
              <circle cx="10" cy="33" r="1.5" fill="#FFFFFF" />
              <circle cx="25" cy="33" r="1.5" fill="#FFFFFF" />
              <circle cx="40" cy="33" r="1.5" fill="#FFFFFF" />
              <circle cx="17.5" cy="44" r="1.5" fill="#FFFFFF" />
              <circle cx="32.5" cy="44" r="1.5" fill="#FFFFFF" />
            </g>
          </svg>
        )
      case 'UK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="ukClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#ukClip)">
              <rect x="0" y="0" width="100" height="100" fill="#00247D" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="0" y1="0" x2="50" y2="50" stroke="#CF142B" strokeWidth="4" />
              <line x1="100" y1="100" x2="50" y2="50" stroke="#CF142B" strokeWidth="4" />
              <line x1="100" y1="0" x2="50" y2="50" stroke="#CF142B" strokeWidth="4" />
              <line x1="0" y1="100" x2="50" y2="50" stroke="#CF142B" strokeWidth="4" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#FFFFFF" strokeWidth="20" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="20" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#CF142B" strokeWidth="12" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#CF142B" strokeWidth="12" />
            </g>
          </svg>
        )
      case 'Australia':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="ausClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#ausClip)">
              <rect x="0" y="0" width="100" height="100" fill="#00008B" />
              <g opacity="0.95">
                <rect x="0" y="0" width="50" height="50" fill="#00247D" />
                <line x1="0" y1="0" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="6" />
                <line x1="50" y1="0" x2="0" y2="50" stroke="#FFFFFF" strokeWidth="6" />
                <line x1="0" y1="0" x2="25" y2="25" stroke="#CF142B" strokeWidth="2" />
                <line x1="50" y1="50" x2="25" y2="25" stroke="#CF142B" strokeWidth="2" />
                <line x1="50" y1="0" x2="25" y2="25" stroke="#CF142B" strokeWidth="2" />
                <line x1="0" y1="50" x2="25" y2="25" stroke="#CF142B" strokeWidth="2" />
                <line x1="25" y1="0" x2="25" y2="50" stroke="#FFFFFF" strokeWidth="10" />
                <line x1="0" y1="25" x2="50" y2="25" stroke="#FFFFFF" strokeWidth="10" />
                <line x1="25" y1="0" x2="25" y2="50" stroke="#CF142B" strokeWidth="6" />
                <line x1="0" y1="25" x2="50" y2="25" stroke="#CF142B" strokeWidth="6" />
              </g>
              <path d="M25 68 L27 74 L34 74 L28 78 L30 84 L25 80 L20 84 L22 78 L16 74 L23 74 Z" fill="#FFFFFF" />
              <circle cx="75" cy="20" r="2" fill="#FFFFFF" />
              <circle cx="62" cy="45" r="2" fill="#FFFFFF" />
              <circle cx="88" cy="50" r="2" fill="#FFFFFF" />
              <circle cx="75" cy="80" r="3" fill="#FFFFFF" />
              <circle cx="80" cy="60" r="1" fill="#FFFFFF" />
            </g>
          </svg>
        )
      case 'UAE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="uaeClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#uaeClip)">
              <rect x="25" y="0" width="75" height="33.33" fill="#00732F" />
              <rect x="25" y="33.33" width="75" height="33.33" fill="#FFFFFF" />
              <rect x="25" y="66.66" width="75" height="33.34" fill="#000000" />
              <rect x="0" y="0" width="25" height="100" fill="#FF0000" />
            </g>
          </svg>
        )
      case 'Canada':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <clipPath id="canadaClip">
              <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath="url(#canadaClip)">
              <rect x="0" y="0" width="25" height="100" fill="#FF0000" />
              <rect x="25" y="0" width="50" height="100" fill="#FFFFFF" />
              <rect x="75" y="0" width="25" height="100" fill="#FF0000" />
              <path d="M50 28 L53 38 L63 35 L60 45 L68 50 L58 53 L55 65 L50 60 L45 65 L42 53 L32 50 L40 45 L37 35 L47 38 Z M50 60 L50 72" fill="#FF0000" stroke="#FF0000" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <span className={`inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm border ${className}`}>
      {getFlag()}
    </span>
  )
}

function JurisdictionTabs() {
  const [active, setActive] = useState<keyof typeof jurisdictions>('Australia')
  const [activeService, setActiveService] = useState(0)

  const current = jurisdictions[active]
  const selectedCard = current.cards[activeService] || current.cards[0]
  const bullets = selectedCard ? selectedCard.bullets : []

  const handleActiveChange = (key: keyof typeof jurisdictions) => {
    setActive(key)
    setActiveService(0)
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-[#12365A]/20 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
      {/* Top Jurisdiction Pills */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-5">
        {serviceTabs.map((key) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              suppressHydrationWarning
              onClick={() => handleActiveChange(key)}
              className="relative rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 focus:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-[#C9A44C] shadow-[0_4px_15px_rgba(201,164,76,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2.5 ${isActive ? 'text-[#0A2540]' : 'text-white/60 hover:text-white'}`}>
                <CountryFlag
                  country={key}
                  className={`h-6 w-6 border-2 transition-all ${isActive ? 'border-[#0A2540]/30 shadow-md bg-white/20' : 'border-white/15 bg-white/5'}`}
                />
                {key}
              </span>
            </button>
          )
        })}
      </div>

      {/* Split Showcase Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch">
        {/* Left Column: Selector */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm mb-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A44C]">Jurisdiction Landscape</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{current.intro}</p>
          </div>

          <div className="flex flex-col gap-2">
            {current.cards.map((item, idx) => {
              const isSelected = activeService === idx
              return (
                <button
                  key={item.title}
                  suppressHydrationWarning
                  onClick={() => setActiveService(idx)}
                  className={`group relative flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 ${isSelected
                    ? 'border-[#C9A44C]/45 bg-[#12365A]/50 shadow-md'
                    : 'border-white/5 bg-[#12365A]/10 hover:border-white/10 hover:bg-[#12365A]/30'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-[#C9A44C]' : 'text-white/40 group-hover:text-white/60'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                      {item.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{ x: isSelected ? 4 : 0 }}
                    className={`flex items-center justify-center ${isSelected ? 'text-[#C9A44C]' : 'text-white/30 group-hover:text-white/60'}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Detail Showcase */}
        <div className="rounded-2xl border border-white/5 bg-[#12365A]/35 backdrop-blur-sm p-6 sm:p-8 min-h-[460px] flex flex-col justify-between shadow-xl relative overflow-hidden text-left h-full">
          {/* Decorative background glow */}
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-[#C9A44C]/5 blur-3xl pointer-events-none" />

          <div>
            <span className="inline-block rounded-full bg-[#C9A44C]/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C] mb-4">
              Interactive Explorer
            </span>
            <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">
              {selectedCard.title}
            </h3>

            <div className="grid gap-6 md:grid-cols-[0.55fr_0.45fr] md:items-start">
              {/* Details list */}
              <div className="flex flex-col gap-3 text-sm">
                {bullets.map((bullet, index) => (
                  <motion.div
                    key={bullet}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 hover:border-[#C9A44C]/30 hover:bg-[#12365A]/45 transition-all duration-300 text-white/80 cursor-default"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A44C]/10 text-[#C9A44C] border border-[#C9A44C]/20 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540] group-hover:border-transparent transition-all duration-300">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed font-medium transition-colors group-hover:text-white">{bullet}</span>
                  </motion.div>
                ))}
              </div>

              {/* Interactive visual widget */}
              <div className="flex justify-center items-center pt-4 md:pt-0">
                <InteractiveWidget serviceName={selectedCard.title} jurisdiction={active} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-8 flex justify-between items-center text-xs text-white/40">
            <span>Active Audit Ready: Compliance Standard 100%</span>
            <span>Secure Framework</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionBand({ children }: { children: React.ReactNode }) {
  return <section className="border-b border-[#E5E7EB] bg-white">{children}</section>
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[75vh] lg:min-h-[620px] items-center justify-center overflow-hidden border-b border-[#051329] bg-black text-white px-6 pt-24 pb-16">
      {/* Background Video */}
      <video
        src="/bv.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-0"
      />

      {/* Dark legibility overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80 z-10"
      />
      {/* Subtle radial gold glow to keep design brand-aligned */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,164,76,0.14),transparent_60%)] z-10 animate-pulse-glow"
      />

      <div className="relative z-20 mx-auto w-full max-w-7xl">
        {/* Main Content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl mx-auto text-center py-8"
        >
          {/* Eyebrow Pill */}
          <span className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A44C] backdrop-blur-md">
            Multi-Disciplinary · Global · Trusted
          </span>

          {/* Heading */}
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white mb-6">
            <span className="block">Your outsourced accounting team —</span>
            <span className="block text-[#C9A44C]">Accurate books & lower taxes.</span>
            <span className="block">Zero compliance stress.</span>
          </h1>

          {/* Description */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl mx-auto">
            Helping Australian, UK & Indian businesses save tax, stay compliant, and grow with proactive accounting.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A44C] px-8 py-3.5 text-sm font-semibold text-[#0A2540] transition-all duration-300 hover:bg-[#ddb860] hover:scale-[1.02] shadow-[0_12px_30px_rgba(201,164,76,0.3)]"
            >
              Book a Free Consultation <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/16"
            >
              Get a Fixed Fee Quote <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
            </a>
          </div>

          {/* Trust Partner Credentials (subtle indicators) */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/50 uppercase tracking-[0.15em] mt-4">
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[#C9A44C]" /> Xero Certified Advisor</span>
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[#C9A44C]" /> QuickBooks ProAdvisor</span>
            <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[#C9A44C]" /> ACCA Qualified Partner</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors duration-300">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex h-7 w-4 justify-center rounded-full border border-white/30 p-1"
        >
          <div className="h-1.5 w-1 rounded-full bg-[#C9A44C]" />
        </motion.div>
      </div>
    </section>
  )
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white text-[#1A1A1A]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.08),transparent_35%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">Experience Snapshot</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#1A1A1A]/70">
              A quick view of the firm&apos;s reach, delivery model, and operating depth.
            </p>
          </motion.div>
        </div>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#E5E7EB] bg-gradient-to-b from-[#F9FAFB] to-[#F5F7FA] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A44C]/45 hover:shadow-[0_20px_40px_rgba(10,37,64,0.08)]"
            >
              <p className="text-5xl font-extrabold font-[family-name:var(--font-display)] text-[#0A2540] tracking-tight">{stat.value}</p>
              <p className="mt-3.5 text-xs font-bold uppercase tracking-[0.25em] text-[#C9A44C]">{stat.label}</p>
              {stat.desc && (
                <p className="mt-2.5 text-xs text-slate-500 font-semibold leading-relaxed">{stat.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutCompanySection() {
  return (
    <section id="about" className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.12),transparent_40%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,164,76,0.04),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center flex flex-col items-center">
        {/* Centered Heading */}
        <SectionHeading
          eyebrow="About Company"
          title="A specialist consultancy built for modern enterprise finance"
          text="Corplex Global Accounting is a full-service accounting and tax consultancy founded in 2018. The practice supports businesses through disciplined, multi-jurisdiction compliance frameworks aligned with global standards."
          inverse={true}
          center={true}
        />

        {/* 2-Column Split Details below heading */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start mt-16 text-left w-full">

          {/* Left Column: Mission, Vision, and Our Story cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-6 w-full"
          >
            {/* Mission Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12365A]/40 backdrop-blur-md p-8 transition-all duration-300 hover:border-[#C9A44C]/35 hover:bg-[#12365A]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C9A44C]/20 bg-[#C9A44C]/10 text-[#C9A44C] transition-all duration-300 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C9A44C] transition-colors">
                    Mission
                  </p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/80 transition-colors group-hover:text-white/95">
                  Support businesses through seamless multi-jurisdictional financial compliance frameworks aligned with global standards.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12365A]/40 backdrop-blur-md p-8 transition-all duration-300 hover:border-[#C9A44C]/35 hover:bg-[#12365A]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C9A44C]/20 bg-[#C9A44C]/10 text-[#C9A44C] transition-all duration-300 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C9A44C] transition-colors">
                    Vision
                  </p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/80 transition-colors group-hover:text-white/95">
                  Tailored corporate bookkeeping, governance and tax solutions that free executive leadership to scale with confidence.
                </p>
              </div>
            </motion.div>

            {/* Our Story Card */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12365A]/40 backdrop-blur-md p-8 transition-all duration-300 hover:border-[#C9A44C]/35 hover:bg-[#12365A]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C9A44C]/20 bg-[#C9A44C]/10 text-[#C9A44C] transition-all duration-300 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C9A44C] transition-colors">
                    Our Story
                  </p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/80 transition-colors group-hover:text-white/95">
                  Founded in 2018, CGA combines process discipline, technology-enabled workflows, and partner-led advisory to help businesses operate with authority across multiple tax and governance environments. We empower enterprises to transcend borders with reliable financial control.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Corporate Image & CTA button */}
          <div className="flex flex-col w-full">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl lg:aspect-square xl:aspect-[4/3]"
            >
              <Image
                src="/images/about-team.png"
                alt="Corporate Finance Team"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Subtle overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 via-transparent to-transparent" />

              {/* Floating 2018 founding highlight centered at bottom of image */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-max">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-[#C9A44C]/30 bg-[#0A2540]/95 backdrop-blur-sm px-5 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
                  <span className="text-3xl font-black text-[#C9A44C]">2018</span>
                  <div className="h-8 w-px bg-[#C9A44C]/25" />
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Founded</p>
                    <p className="text-[10px] text-white/60">Ghaziabad, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button below image */}
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#C9A44C] px-8 py-4 text-sm font-bold text-[#0A2540] hover:bg-[#ddb860] hover:scale-[1.01] transition-all duration-300 shadow-[0_8px_30px_rgba(201,164,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,164,76,0.3)] text-center"
              >
                Book a Free Consultation
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

const verticalIcons = [
  // E-commerce & Marketplaces
  <svg key="ecommerce" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>,
  // IT & Cross-Border Services
  <svg key="it" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>,
  // SaaS & Tech Ventures
  <svg key="saas" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>,
  // Retail & Distribution
  <svg key="retail" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>,
  // Manufacturing & Logistics
  <svg key="manufacturing" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  // Healthcare & Diagnostics
  <svg key="healthcare" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  // Real Estate & Infrastructure
  <svg key="realestate" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>,
  // Unlisted Public & Private Corporations
  <svg key="corporations" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
]

export function IndustryVerticalsSection() {
  const verticals = [
    { name: 'E-commerce & Marketplaces', sub: 'Digital Commerce & Tax' },
    { name: 'IT & Cross-Border Services', sub: 'Technology & Transfer Pricing' },
    { name: 'SaaS & Tech Ventures', sub: 'Cloud & Subscription Models' },
    { name: 'Retail & Distribution', sub: 'Inventory & Trade Compliance' },
    { name: 'Manufacturing & Logistics', sub: 'Operations & Supply Chain' },
    { name: 'Healthcare & Diagnostics', sub: 'Regulated & Clinical Finance' },
    { name: 'Construction, Property & Real Estate', sub: 'Project & Joint Venture Accounting' },
    { name: 'Unlisted Public & Private Corporations', sub: 'Corporate Governance & ROC' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white text-[#1A1A1A]">
      {/* Background Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,37,64,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,37,64,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,164,76,0.06),transparent_35%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Industry Verticals"
          title="Premium coverage across the sectors that demand precision"
          text="Our engagement model adapts to operating complexity, entity structure, and reporting expectations across growth-stage and established businesses."
          inverse={false}
          center={true}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {verticals.map((vertical, index) => (
            <motion.div
              key={vertical.name}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-[#D5E1ED] bg-gradient-to-br from-[#F2F6FA] to-[#E5EDF4] p-6 shadow-sm transition-all duration-300 hover:border-[#C9A44C] hover:bg-white hover:shadow-[0_15px_30px_rgba(10,37,64,0.06)] hover:-translate-y-1 cursor-default"
            >
              {/* Inner ambient hover glow */}
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(201,164,76,0.04),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-[#C9A44C]/[0.03] to-transparent pointer-events-none" />

              <div className="flex items-center justify-between">
                {/* Icon with ping dot */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C5D5E5] bg-[#F0F4F8] text-[#0A2540] transition-all duration-300 group-hover:scale-110 group-hover:border-[#C9A44C]/35 group-hover:bg-[#0A2540] group-hover:text-white">
                  {verticalIcons[index] || (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {/* Ping indicator on hover */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A44C] opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C9A44C]" />
                  </span>
                </div>
                <span className="text-xs font-semibold tracking-wider text-[#0A2540]/30 transition-colors duration-300 group-hover:text-[#C9A44C]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <p className="mt-6 text-base font-bold leading-6 text-[#0A2540] transition-colors duration-300 group-hover:text-[#C9A44C]">
                {vertical.name}
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-[#0A2540]/50 group-hover:text-[#C9A44C]/70 transition-colors duration-300 uppercase tracking-widest">
                {vertical.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function GlobalServicesSection() {
  return (
    <section id="global-reach" className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.12),transparent_35%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="International Coverage"
          title="Trusted Across Five Jurisdictions"
          text="Our team understands the tax regulations, payroll systems, and compliance frameworks of each country we serve — not just the numbers, but the rules behind them."
          inverse
          center
        />
        <div className="mt-10">
          <JurisdictionTabs />
        </div>

        {/* Action-Oriented Repeating CTAs */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-8">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#C9A44C] px-6 py-3.5 text-xs font-semibold text-[#0A2540] hover:bg-[#ddb860] transition-all duration-300 hover:scale-[1.02]"
          >
            Get a Fixed Fee Quote
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-xs font-semibold text-white hover:bg-white/10 transition-all duration-300"
          >
            Talk to an Accountant Today
          </a>
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 backdrop-blur-sm">
              <span className="text-2xl font-black text-[#C9A44C]">01</span>
              <h4 className="mt-2 font-bold text-white text-base">Local Knowledge</h4>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Deep statutory understanding of each country&apos;s tax codes, compliance frameworks, and local corporate filing standards.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 backdrop-blur-sm">
              <span className="text-2xl font-black text-[#C9A44C]">02</span>
              <h4 className="mt-2 font-bold text-white text-base">Single Point of Contact</h4>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                One dedicated relationship team managing all of your global entities, ensuring absolute operational accountability.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 backdrop-blur-sm">
              <span className="text-2xl font-black text-[#C9A44C]">03</span>
              <h4 className="mt-2 font-bold text-white text-base">8+ Years Advisory</h4>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Hands-on cross-border experience delivering robust financial strategy and clean book records to high-growth firms.
              </p>
            </div>
          </div>
        </div>

        {/* Global expansion banner card matching user screenshot */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-16 rounded-[32px] p-8 sm:p-12 text-center bg-gradient-to-r from-[#0B223F] via-[#164275] to-[#0B223F] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />
          
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Expanding globally
          </h4>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/80 max-w-2xl mx-auto">
            Don&apos;t see your country listed? We are continuously expanding our international coverage. Reach out and we&apos;ll let you know how we can help.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E2B743] hover:bg-[#c9a44c] px-6 py-3 text-xs sm:text-sm font-bold text-[#0A2540] transition-all duration-300 hover:scale-[1.02] shadow-md cursor-pointer"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function TechnologyPlatformsSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      {/* Background Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.12),transparent_40%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,164,76,0.04),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {/* Centered Heading */}
        <div className="text-center flex flex-col items-center">
          <SectionHeading
            eyebrow="Technology Platforms"
            title="Cloud accounting systems designed for reliable control"
            text="We structure finance operations around leading platforms so management has timely visibility and cleaner data for decision-making."
            inverse={true}
            center={true}
          />
        </div>

        {/* Side-by-Side 2-column layout (equal height) */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-stretch">

          {/* Left Column: 3 Platform cards stacked vertically, equal height */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-rows-3 gap-4 h-full"
          >
            {technologyPlatforms.map((platform) => (
              <motion.div
                key={platform.name}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/10 bg-[#12365A]/40 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-[#C9A44C]/45 hover:bg-[#12365A]/60 flex items-start gap-4 cursor-default"
              >
                {/* Icon wrapper */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#C9A44C] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540] group-hover:border-transparent group-hover:shadow-md">
                  {platform.icon}
                </div>

                <div className="flex-1 text-left">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A44C] font-bold">Platform</p>
                  <p className="mt-0.5 text-base font-bold text-white group-hover:text-[#C9A44C] transition-colors duration-300">{platform.name}</p>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/70 group-hover:text-white/90 transition-colors duration-300">{platform.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Booking Box & Image (down), equal height */}
          <div className="grid grid-cols-1 gap-4 lg:grid-rows-2 lg:h-full">
            {/* Booking Box */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl border border-white/10 bg-[#12365A]/40 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between text-left lg:h-full"
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#C9A44C] font-bold mb-2">Stack Setup</p>
                <h4 className="text-base font-bold text-white leading-tight">Need Expert Accounting Software Setup?</h4>
                <p className="mt-2 text-xs leading-relaxed text-white/70">Our certified specialists configure, migrate, and optimize Xero, QuickBooks, and Zoho Books with secure data migration, custom chart of accounts, and multi-currency support—ensuring a smooth transition with minimal business disruption.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href="#contact"
                  suppressHydrationWarning
                  className="inline-flex items-center justify-center rounded-full bg-[#C9A44C] px-5 py-2.5 text-[#0A2540] hover:bg-[#b08e3d] transition-colors shadow-md"
                >
                  Book a Free Consultation
                </a>
                <a
                  href="#contact"
                  suppressHydrationWarning
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10 transition-colors"
                >
                  Schedule a 15-Minute Call
                </a>
              </div>
            </motion.div>

            {/* Dashboard Image (Down) — fills remaining height */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="relative min-h-[200px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-full"
            >
              <div className="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(201,164,76,0.12),transparent_60%)] blur-2xl opacity-60 pointer-events-none" />
              <Image
                src="/images/tech-integration-premium-dashboard.png"
                alt="Cloud Accounting Stack Integration Dashboard"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 via-transparent to-transparent" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}



// Redundant founderPillars array removed

export function FounderSection() {
  return (
    <section id="founder" className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      {/* Background Decorative Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.1),transparent_35%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
          {/* Left Column: Founder Profile Card (increased height) */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="group relative max-w-sm mx-auto w-full rounded-[40px] bg-[#12365A]/35 border border-white/10 p-6 flex flex-col gap-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
          >
            {/* Main photo frame - increased height to aspect-[3/4.6] and restored clear founder-portrait.png */}
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl aspect-[3/4.6] flex items-center justify-center border border-white/10 bg-[#091F37]">
              <img
                src="/founder-portrait.png"
                alt="Aman Raj - Founding Partner"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* Top-left badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#0A2540]/80 backdrop-blur-sm border border-[#C9A44C]/30 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Founding Partner</span>
              </div>
            </div>

            {/* Name & Credentials below the photo */}
            <div className="text-center">
              <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Aman Raj
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A44C] mt-1">
                Founding Partner
              </p>
              
              {/* Degrees capsules with premium icons */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  { name: 'B.COM', icon: <svg className="w-3 h-3 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg> },
                  { name: 'M.COM', icon: <svg className="w-3 h-3 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                  { name: 'MBA', icon: <svg className="w-3 h-3 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                  { name: 'ACCA', icon: <svg className="w-3 h-3 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg> }
                ].map((deg) => (
                  <span key={deg.name} className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#C9A44C] rounded-md bg-[#C9A44C]/10 border border-[#C9A44C]/25">
                    {deg.icon}
                    {deg.name}
                  </span>
                ))}
              </div>
            </div>

            {/* LinkedIn CTA below the name */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href="https://www.linkedin.com/in/aman-raj-a928a8a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0077B5] hover:bg-[#006297] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 shadow-md hover:scale-[1.01]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Strategic Practice details and metrics cards */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">
              Founding Partner
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white tracking-tight">
              Aman Raj
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base sm:leading-8">
              A qualified financial professional holding advanced credentials in <span className="text-[#C9A44C] font-bold">B.COM</span>, <span className="text-[#C9A44C] font-bold">M.COM</span>, <span className="text-[#C9A44C] font-bold">MBA</span>, and <span className="text-[#C9A44C] font-bold">ACCA</span>. Since founding CGA in 2018, Aman has built a diversified practice managing tax structuring, corporate reporting, and full-cycle bookkeeping under US GAAP, UK FRS/GAAP, Australian AASB, and Indian statutory standards for high-growth enterprises.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E5D57] to-[#12365A] hover:from-[#24736C] hover:to-[#1A4876] px-6 py-3.5 text-white transition-all duration-300 hover:scale-[1.02] shadow-md"
              >
                Book a Free Consultation
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-white transition-all duration-300"
              >
                Explore Services
              </a>
            </div>

            {/* Three columns metrics cards grid with stagger animations */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {/* Card 1: Experience & Scope */}
              <motion.div 
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h1.68M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Experience & Scope</p>
                    <p className="text-xl font-black text-white mt-0.5">8+ Years</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/70">Supporting clients internationally across:</p>
                <div className="mt-3 flex flex-wrap gap-2 flex-1 content-start">
                  {[
                    { name: 'India', flag: 'India' },
                    { name: 'Australia', flag: 'Australia' },
                    { name: 'UAE', flag: 'UAE' },
                    { name: 'United States', flag: 'USA' },
                    { name: 'United Kingdom', flag: 'UK' }
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/90 transition-all hover:bg-white/10">
                      <CountryFlag 
                        country={p.flag} 
                        className="h-3.5 w-3.5 border border-white/20" 
                      />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-wider text-[#C9A44C] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C]" />
                  Cross-Border Scope
                </div>
              </motion.div>

              {/* Card 2: Industries Served */}
              <motion.div 
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Industries Served</p>
                    <p className="text-xl font-black text-white mt-0.5">10 Key Sectors</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/70">Deep operational expertise across:</p>
                <div className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                  {['E-commerce', 'IT & Tech Services', 'SaaS Ventures', 'Retail & Trade', 'Manufacturing', 'Professional Services'].map((p) => (
                    <span key={p} className="px-2.5 py-1 text-[10px] font-semibold text-white/90 bg-white/5 border border-white/10 rounded-md">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-wider text-[#C9A44C] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C]" />
                  Multi-Sector Operations
                </div>
              </motion.div>

              {/* Card 3: Software Platforms */}
              <motion.div 
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Software Platforms</p>
                    <p className="text-xl font-black text-white mt-0.5">Advanced Stacks</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/70">Proficient in cloud finance systems:</p>
                <div className="mt-3 flex flex-wrap gap-1.5 flex-1 content-start">
                  {['QuickBooks Online', 'Xero', 'Zoho Books', 'TallyPrime', 'NetSuite'].map((p) => (
                    <span key={p} className="px-2.5 py-1 text-[10px] font-semibold text-white/90 bg-white/5 border border-white/10 rounded-md">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[9px] font-bold uppercase tracking-wider text-[#C9A44C] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C]" />
                  Real-Time Cloud Flow
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>

        {/* Horizontal row for Why Corplex, Expertise, Philosophy, Client Communication */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A44C] mb-8 text-center">Founder&apos;s Strategic Practice Matrix</p>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Point 1: Why I Started Corplex */}
            <motion.div 
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col justify-between hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C] mb-4 shadow-inner">
                  {/* Real Rocket/Launch Icon */}
                  <svg className="w-5 h-5 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Why I Started Corplex</p>
                <p className="mt-3 text-xs text-white/70 leading-relaxed">
                  I founded Corplex in 2018 because I saw high-growth businesses struggling with slow, compliance across borders. I wanted to build a single accountable hub that pairs modern cloud tech with proactive partner-led oversight.
                </p>
              </div>
            </motion.div>

            {/* Point 2: My Expertise */}
            <motion.div 
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col justify-between hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C] mb-4 shadow-inner">
                  {/* Real Shield Check Certificate Icon */}
                  <svg className="w-5 h-5 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">My Expertise</p>
                <p className="mt-3 text-xs text-white/70 leading-relaxed">
                  Leveraging advanced B.COM, M.COM, MBA, and ACCA credentials, I specialize in multi-jurisdiction compliance (Australia AASB, UK FRS, US GAAP, Indian Statutory) and active international tax planning.
                </p>
              </div>
            </motion.div>

            {/* Point 3: My Philosophy */}
            <motion.div 
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col justify-between hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C] mb-4 shadow-inner">
                  {/* Real Balance Scale/Wisdom Icon */}
                  <svg className="w-5 h-5 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">My Philosophy</p>
                <p className="mt-3 text-xs text-white/70 leading-relaxed">
                  Accounting is more than just history tracking. It is about forward-looking tax mitigation and enabling clean financial operations so executives can make decisions and scale with total peace of mind.
                </p>
              </div>
            </motion.div>

            {/* Point 4: Client Communication */}
            <motion.div 
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-[#12365A]/20 p-6 flex flex-col justify-between hover:border-[#C9A44C]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C] mb-4 shadow-inner">
                  {/* Real Chat Bubble Icon */}
                  <svg className="w-5 h-5 text-[#C9A44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A44C]">Client Communication</p>
                <p className="mt-3 text-xs text-white/70 leading-relaxed">
                  Professional services are built on trust. We provide direct communication lines to leadership, scheduled strategic check-ins, and commit to responding to any client query within one business day.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const whyChooseIcons = [
  // Multi-Jurisdiction Expertise
  <svg key="globe" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h1.68M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>,
  // Compliance-First
  <svg key="shield" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  // Cloud Accounting
  <svg key="cloud" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>,
  // Strategic Advisory
  <svg key="advisory" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>,
]

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,37,64,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,37,64,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,164,76,0.05),transparent_40%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built for trust, continuity, and executive confidence"
          text="Every engagement is built around partner-led oversight, documented workflows, and proactive governance — not reactive support."
          inverse={false}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 grid gap-6 lg:grid-cols-4"
        >
          {differentiators.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2540] to-[#071B30] p-8 shadow-[0_16px_36px_rgba(10,37,64,0.16)] transition-all duration-300 hover:border-[#C9A44C]/50 hover:shadow-[0_20px_45px_rgba(201,164,76,0.12)] cursor-default"
            >
              {/* Hover ambient glow */}
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.06),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A44C]/25 bg-[#C9A44C]/10 text-[#C9A44C] transition-all duration-300 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540] group-hover:border-transparent group-hover:scale-110">
                {whyChooseIcons[idx]}
              </div>

              <h3 className="mt-6 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/75 group-hover:text-white/90 transition-colors">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function ConsultationSection() {
  return (
    <section id="consultation" className="border-b border-[#0A2540] bg-[#0A2540]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#12365A]/50 to-[#0A2540]/80 backdrop-blur-md p-8 shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:grid-cols-[1fr_auto] lg:p-12 hover:border-[#C9A44C]/30 transition-all duration-500">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">Consultation CTA</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-white sm:text-4xl">
              Talk to an Accountant Today
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
              Discuss your accounting, tax and compliance requirements with our experts. Get a fixed fee quote. Replies within 1 business day.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-[#C9A44C] px-8 py-3.5 text-sm font-semibold text-[#0A2540] shadow-[0_12px_30px_rgba(201,164,76,0.22)] transition-all duration-300 hover:bg-[#ddb860] hover:scale-[1.02]"
          >
            Get a Fixed Fee Quote
          </a>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="border-b border-[#0A2540] bg-[#0A2540]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.65 }}
          >
            <SectionHeading
              eyebrow="Contact"
              title="Connect with the team in Ghaziabad"
              text="We support clients across India, USA, UK, UAE, and Australia from a client service model designed for reliability and discretion."
              inverse
            />

            <div className="mt-10 grid gap-4 text-white">
              {[
                { label: 'Office Address', value: 'UG-CS-32, Ansal Plaza, Sector 1, Vaishali, Ghaziabad - 201010, Uttar Pradesh, India' },
                { label: 'Direct Contact', value: '+91 87503 27783' },
                { label: 'Email', value: 'aman@corplexsolutions.in' },
                { label: 'Website', value: 'corplexsolutions.in' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A44C]/30 bg-[#12365A] text-xs font-semibold text-[#C9A44C]">
                    {item.label.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#C9A44C]">{item.label}</p>
                    <p className="mt-2 text-sm leading-7 text-white/80">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.65 }}
            className="w-full max-w-[560px] self-start justify-self-start rounded-[28px] border border-white/15 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-8 lg:justify-self-end"
          >
            <div className="mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#C9A44C]">Contact Form</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#0A2540]">Tell us your requirement</h3>
              </div>
            </div>
            <ContactForm />
          </motion.div>
        </div>

        {/* Full-width Google Map card at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A44C]">Google Maps Integration</p>
          </div>
          <iframe
            title="Corplex Global Accounting location map"
            src="https://www.google.com/maps?q=Ghaziabad%2C%20Uttar%20Pradesh%2C%20India&output=embed"
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}

const ReduceTaxIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="6" width="10" height="3" rx="0.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
    <circle cx="8.5" cy="12.5" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="12" cy="12.5" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="15.5" cy="12.5" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="8.5" cy="16.5" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M11 16.5h3.5" stroke="#C9A44C" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 6.5h2" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 14.5v4.5h-4.5" stroke="#C9A44C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 14c2.5 0 4.5 2 5.5 4.5" stroke="#C9A44C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PenaltyShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="6" width="10" height="9" rx="1.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 9h10" stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M10 5v2" stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M14 5v2" stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M12 13.5l1.5 1.5 3.5-3.5" stroke="#C9A44C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 17.5c2.1-0.9 3.5-2.8 3.5-4.5v-3l-6.5-2.5L5.5 10v3c0 1.7 1.4 3.6 3.5 4.5" stroke="#C9A44C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BASHelpIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="3" y="5" width="12" height="12" rx="2" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />
    <line x1="3" y1="9" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="7" y1="5" x2="7" y2="17" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.5" />
    <rect x="9" y="9" width="12" height="12" rx="2" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="9" y1="13" x2="21" y2="13" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="13" y1="9" x2="13" y2="21" stroke="#FFFFFF" strokeWidth="1.2" />
    <path d="M16 2L10 11H15L13 19L21 8.5H15L16 2Z" fill="#C9A44C" stroke="#0A2540" strokeWidth="1" strokeLinejoin="round" />
  </svg>
)

const PayrollIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <circle cx="8" cy="8" r="3.5" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.5" />
    <path d="M2 17.5a6 6 0 0112 0" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="10" y="11" width="11" height="8" rx="1.5" fill="#0A2540" stroke="#C9A44C" strokeWidth="1.5" />
    <rect x="12" y="13" width="2" height="1.5" rx="0.3" fill="#C9A44C" />
    <line x1="16" y1="16.5" x2="19" y2="16.5" stroke="#C9A44C" strokeWidth="1" />
    <path d="M10 6.5h7.5a2.5 2.5 0 012.5 2.5v2M20 11.5l1.5-1.5M20 11.5L18.5 10" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ResponseSLAIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M17 8.5v-3A1.5 1.5 0 0015.5 4H3.5A1.5 1.5 0 002 5.5v7A1.5 1.5 0 003.5 14h2v2.5l3-2.5h2" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 17.5L7 20v-7.5A1.5 1.5 0 018.5 11h11a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5H12L9.5 17.5z" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="14" x2="17" y2="14" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="16.5" x2="15" y2="16.5" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function PainPointsSection() {
  const painPoints = [
    {
      problem: 'How do I reduce tax?',
      solution: 'We review your operations and structure transactions proactively, making sure you leverage state/federal concessions legally.',
      icon: <ReduceTaxIcon />,
    },
    {
      problem: 'How do I avoid ATO penalties?',
      solution: 'We maintain a strict regulatory calendar for ATO, HMRC, and GST. Our systems are built around audit-ready file preparation.',
      icon: <PenaltyShieldIcon />,
    },
    {
      problem: 'I need BAS help.',
      solution: 'Our dedicated tax team will reconstruct ledger gaps, reconcile reconciliations, and file error-free returns on time.',
      icon: <BASHelpIcon />,
    },
    {
      problem: 'I need payroll.',
      solution: 'From Single Touch Payroll (STP) to pension auto-enrolment, we manage employer obligations and employee payouts securely.',
      icon: <PayrollIcon />,
    },
    {
      problem: 'I need someone who replies.',
      solution: 'No more waiting for weeks. We commit to a strict SLA: direct partner communication and replies within 1 business day.',
      icon: <ResponseSLAIcon />,
    },
  ]
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-[#F5F7FA]">
      {/* Decorative backgrounds */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,37,64,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,37,64,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.08),transparent_40%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(10,37,64,0.02),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center flex flex-col items-center">
        <SectionHeading
          eyebrow="Client Challenges We Solve"
          title="Structure your finances around outcomes, not stress"
          text="We focus on outcomes. If you are facing any of these typical bottlenecks, our team is equipped to resolve them immediately."
          inverse={false}
          center={true}
        />
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-left w-full">
          {painPoints.map((point, idx) => (
            <motion.a
              key={idx}
              href="#contact"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: idx * 0.08 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E7EB] bg-gradient-to-b from-white to-[#F9FAFB] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C9A44C]/50 hover:shadow-[0_20px_45px_rgba(10,37,64,0.07)] w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-h-[290px] cursor-pointer"
            >
              {/* Premium hover top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A44C] to-[#ddb860] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div>
                {/* Icon wrapper */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2540] text-white shadow-md border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#C9A44C]/15">
                  {point.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] transition-colors group-hover:text-[#C9A44C]">
                  {point.problem}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/70 group-hover:text-[#1A1A1A]/80 transition-colors">{point.solution}</p>
              </div>

              <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-xs font-semibold text-[#C9A44C] uppercase tracking-wider flex items-center justify-between">
                <span>Active Resolution</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#0A2540] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  Resolve <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

const BookkeepingDashboard = () => (
  <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-950/20 rounded-2xl">
    {/* Header row */}
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Automated Ledger Sync</span>
      </div>
      <span className="text-[9px] font-extrabold text-[#C9A44C] bg-[#C9A44C]/10 border border-[#C9A44C]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Xero API Connected</span>
    </div>

    {/* Cashflow Chart (Ultra-professional) */}
    <div className="my-3 flex-1 relative flex flex-col justify-end bg-white/[0.01] border border-white/5 rounded-xl p-3">
      {/* Chart Header */}
      <div className="absolute top-2.5 left-3 flex justify-between items-start w-[calc(100%-24px)]">
        <div className="flex flex-col">
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Cash Flow Runway</span>
          <span className="text-xl font-black text-white tracking-tight">$48,250.00 <span className="text-xs text-emerald-400 font-semibold font-sans ml-1">+12.4%</span></span>
        </div>
        <div className="flex gap-1 text-[8px] font-bold text-white/40 bg-white/5 rounded px-1.5 py-0.5">
          <span>1W</span>
          <span className="text-[#C9A44C]">1M</span>
          <span>3M</span>
        </div>
      </div>

      {/* Chart SVG */}
      <div className="w-full h-20 mt-6 relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A44C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C9A44C" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Subtle grid lines */}
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="1 3" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="1 3" />

          {/* Area Fill */}
          <path d="M0 25 Q15 20 30 22 T60 12 T85 4 T100 6 L100 30 L0 30 Z" fill="url(#chartGrad)" />
          {/* Main Stroke */}
          <path d="M0 25 Q15 20 30 22 T60 12 T85 4 T100 6" fill="none" stroke="#C9A44C" strokeWidth="1.5" strokeLinecap="round" />
          {/* Target circle */}
          <circle cx="85" cy="4" r="3.5" fill="#FFFFFF" fillOpacity="0.2" />
          <circle cx="85" cy="4" r="1.5" fill="#C9A44C" />
        </svg>
      </div>

      {/* Chart Axis Labels */}
      <div className="flex justify-between text-[8px] font-bold text-white/30 px-1 pt-1.5 border-t border-white/5 mt-1">
        <span>May 01</span>
        <span>May 10</span>
        <span>May 20</span>
        <span>May 30</span>
      </div>
    </div>

    {/* Floating transaction cards */}
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/15">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans text-[10px] font-bold">
            STR
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white leading-tight">Stripe Invoice #2804</span>
            <span className="text-[9px] text-white/40 font-semibold">Today, 14:32 • Ref_X82</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className="text-[11px] font-extrabold text-[#C9A44C] leading-none">+$12,450.00</span>
          <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/15 border border-emerald-500/20 px-1.5 py-0.5 rounded">Reconciled</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/15">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans text-[10px] font-bold">
            OFF
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white leading-tight">HQ Lease Payment</span>
            <span className="text-[9px] text-white/40 font-semibold">Yesterday, 09:15 • Ref_P31</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className="text-[11px] font-extrabold text-white/80 leading-none">-$3,200.00</span>
          <span className="text-[8px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/15 border border-amber-500/20 px-1.5 py-0.5 rounded">Matching (98%)</span>
        </div>
      </div>
    </div>
  </div>
)

const TaxComplianceDashboard = () => (
  <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-950/20 rounded-2xl">
    {/* Header row */}
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A44C] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A44C]"></span>
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Compliance Registry</span>
      </div>
      <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Zero Penalty Guarantee</span>
    </div>

    {/* Center visual: 2-column Calendar and Progress Circular Gauge */}
    <div className="grid grid-cols-5 gap-4 my-3 items-center flex-1">
      {/* Compliance Circular Progress Gauge (2/5 cols) */}
      <div className="col-span-2 flex flex-col items-center justify-center relative bg-white/[0.01] border border-white/5 rounded-xl p-3 h-full justify-center">
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90 overflow-visible">
            {/* Base circle background */}
            <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" fill="transparent" />
            {/* Golden animated progress circle */}
            <circle cx="40" cy="40" r="32" stroke="#C9A44C" strokeWidth="5.5" fill="transparent"
              strokeDasharray="201.06" strokeDashoffset="20.1" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(201,164,76,0.3)]" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-base font-black text-white leading-none">90%</span>
            <span className="text-[7px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Compliant</span>
          </div>
        </div>
        <span className="text-[8px] text-[#C9A44C] font-extrabold uppercase tracking-wider mt-2.5 text-center leading-relaxed">Filing SLA Achieved</span>
      </div>

      {/* Compliance Task Checklists (3/5 cols) */}
      <div className="col-span-3 space-y-1.5">
        <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2 transition-all hover:bg-white/[0.04]">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white leading-none">ATO BAS Lodgement</span>
            <span className="text-[8px] text-white/40 mt-0.5 font-semibold">Q3 Lodged • Completed May 21</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2 transition-all hover:bg-white/[0.04]">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white leading-none">HMRC VAT Return</span>
            <span className="text-[8px] text-white/40 mt-0.5 font-semibold">Filed • Confirmed Jun 07</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2 border-l-amber-500 border-l-2 transition-all hover:bg-white/[0.04]">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <svg className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white leading-none">MCA Annual Return</span>
            <span className="text-[8px] text-amber-400 mt-0.5 font-bold">Action Required • Due in 18d</span>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Jurisdictions pill bar */}
    <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
      <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider">Regions Monitored:</span>
      <div className="flex gap-1">
        {['AU', 'IN', 'UK', 'US'].map((j) => (
          <span key={j} className="text-[8px] font-extrabold bg-white/5 px-2 py-0.5 rounded text-white/70 border border-white/5">
            {j}
          </span>
        ))}
      </div>
    </div>
  </div>
)

const PayrollAdvisoryDashboard = () => (
  <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-950/20 rounded-2xl">
    {/* Header row */}
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Payroll Processing Engine</span>
      </div>
      <span className="text-[9px] font-extrabold text-[#C9A44C] bg-[#C9A44C]/10 border border-[#C9A44C]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">1-Day SLA Active</span>
    </div>

    {/* Metrics Bar Charts */}
    <div className="my-3 flex-1 flex flex-col justify-center gap-3.5 bg-white/[0.01] border border-white/5 rounded-xl p-3">
      <div>
        <div className="flex items-center justify-between text-[9px] font-bold text-white/50 mb-1">
          <span>Gross Wages & STP Payout</span>
          <span className="text-white font-extrabold">$32,840.00 <span className="text-white/30 font-semibold">(42 Staff)</span></span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#C9A44C] w-[75%] shadow-[0_0_8px_rgba(201,164,76,0.3)]" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-[9px] font-bold text-white/50 mb-1">
          <span>Pension & Superannuation Clearing</span>
          <span className="text-white font-extrabold">$3,284.00 <span className="text-white/30 font-semibold">(Processed)</span></span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#C9A44C] w-[60%] shadow-[0_0_8px_rgba(201,164,76,0.2)]" />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white leading-tight">3-Way Cashflow Advisory</span>
            <span className="text-[8px] text-white/40 mt-0.5 font-semibold">Interactive ledger models forecast +18% runway growth</span>
          </div>
        </div>
      </div>
    </div>

    {/* Staff profile avatars strip and total payroll label */}
    <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          <div className="h-5.5 w-5.5 rounded-full border border-[#0A2540] bg-slate-600 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">LH</div>
          <div className="h-5.5 w-5.5 rounded-full border border-[#0A2540] bg-amber-700 flex items-center justify-center text-[7px] font-bold text-white shadow-sm">SJ</div>
          <div className="h-5.5 w-5.5 rounded-full border border-[#0A2540] bg-[#C9A44C] flex items-center justify-center text-[7px] font-bold text-[#0A2540] shadow-sm">MK</div>
        </div>
        <span className="text-[9px] text-white/60 font-bold uppercase tracking-wider">Payroll Disbursed</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">SLA Compliant</span>
    </div>
  </div>
)

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0)

  const services = [
    {
      title: 'Bookkeeping & Reconciliation',
      description: 'Accurate daily ledger management, bank feed reconciliations, and month-end reporting on Xero & QuickBooks — so your books are always audit-ready.',
      includes: [
        'Daily bank feed reconciliation (Xero / QuickBooks)',
        'Accounts payable & receivable management',
        'Fixed asset register & depreciation schedules',
        'Monthly trial balance & P&L reporting',
        'Receipt attachment & documentation mapping',
        'Multi-currency transaction processing',
      ],
      highlight: 'Xero & QuickBooks Certified',
      cta: 'Schedule a 15-Minute Discovery Call',
      dashboard: <BookkeepingDashboard />
    },
    {
      title: 'Tax Filing & Compliance',
      description: 'End-to-end tax compliance across India, UK, Australia, USA & UAE — from corporate returns to VAT/GST filings, with proactive deadline management.',
      includes: [
        'Corporate tax returns (CT600, ITR, 1120)',
        'VAT / GST registration & quarterly submissions',
        'BAS / IAS lodgements & ATO compliance',
        'Self-assessment returns (SA100, ITR-U)',
        'Companies House / ASIC annual filings',
        'CIS monthly returns & contractor statements',
      ],
      highlight: 'Zero Penalty Guarantee',
      cta: 'Get a Fixed Fee Quote',
      dashboard: <TaxComplianceDashboard />
    },
    {
      title: 'Payroll & Advisory',
      description: 'Localized payroll processing with pension/superannuation compliance, plus strategic CFO advisory to drive profitability and smart capital allocation.',
      includes: [
        'Staff payslips, PAYE & superannuation processing',
        'HMRC RTI submissions & auto-enrolment setup',
        'Superannuation clearing house administration',
        'Cashflow forecast projections (3-Way model)',
        'Strategic CFO meetings & business reviews',
        'Entity structuring & tax-saving strategies',
      ],
      highlight: 'ACCA & CA Qualified Team',
      cta: 'Talk to an Accountant Today',
      dashboard: <PayrollAdvisoryDashboard />
    },
  ]

  return (
    <section id="services" className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      {/* Decorative backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,76,0.12),transparent_40%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,164,76,0.06),transparent_45%)]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SectionHeading
          eyebrow="Our Core Services"
          title="What We Provide"
          text="Three specialized service areas backed by qualified accountants across 5 countries. Every engagement includes a dedicated account manager, fixed-fee pricing, and 1-day response SLA."
          inverse={true}
          center={true}
        />

        {/* Dynamic Tab Selector Headers */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-4 border-b border-white/10 pb-4 max-w-2xl mx-auto">
          {services.map((service, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              suppressHydrationWarning
              className={`relative px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-xl outline-none ${activeTab === idx ? 'text-[#C9A44C]' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                }`}
            >
              {service.title.split(' & ')[0]} {/* Bookkeeping, Tax, Payroll */}
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A44C] shadow-[0_0_8px_rgba(201,164,76,0.5)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="mt-16">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid gap-12 lg:grid-cols-5 items-center text-left"
          >
            {/* Left side text details (3/5 columns) */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              {/* Highlight Badge */}
              <div className="inline-flex self-start items-center gap-2 rounded-full border border-[#C9A44C]/30 bg-[#C9A44C]/10 px-4 py-1.5 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A44C] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A44C]">{services[activeTab].highlight}</span>
              </div>

              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                {services[activeTab].title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                {services[activeTab].description}
              </p>

              {/* Included Checklist (2 columns) */}
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">What&apos;s Included</p>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {services[activeTab].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-xs leading-relaxed text-white/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <a
                href="#contact"
                className="mt-10 inline-flex self-start items-center justify-center gap-2 rounded-xl border border-[#C9A44C]/30 bg-[#C9A44C]/10 px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#C9A44C] transition-all duration-300 hover:bg-[#C9A44C] hover:text-[#0A2540] hover:border-[#C9A44C] group"
              >
                {services[activeTab].cta}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
            </div>

            {/* Right side live rendering dashboard (2/5 columns) */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-[#C9A44C]/45 hover:bg-white/[0.04] h-[360px] flex flex-col justify-center">
                {/* Top glow border */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A44C] to-[#ddb860] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Dashboard content */}
                <div className="h-[320px] flex flex-col justify-between">
                  {services[activeTab].dashboard}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Row */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          {[
            { metric: '150+', label: 'Businesses Served', sub: 'Across 5 countries' },
            { metric: '100%', label: 'Filing Accuracy', sub: 'Zero penalties to date' },
            { metric: '1 Day', label: 'Response SLA', sub: 'Guaranteed turnaround' },
            { metric: '8+ Years', label: 'Industry Experience', sub: 'Accounting & advisory' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#C9A44C]/50 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(201,164,76,0.08)] border-t-2 border-t-[#C9A44C]/40 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-h-[110px] flex flex-col justify-center"
            >
              <p className="text-2xl font-extrabold font-[family-name:var(--font-display)] text-[#C9A44C]">{item.metric}</p>
              <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-white/80">{item.label}</p>
              <p className="mt-1 text-[10px] text-white/40">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Corplex has transformed our accounting structure. Moving to Xero and automated bank feeds was seamless, and we now save hours each month on our BAS filings.",
      author: "Liam Henderson",
      role: "Founder, E-commerce Group",
      location: "Sydney, Australia",
      rating: 5,
    },
    {
      quote: "Exceptional UK accounting service. They prepare our CT600, manage payroll submissions under RTI, and advise on Capital Allowances with professional precision.",
      author: "Sarah Jenkins",
      role: "Director, SaaS Venture",
      location: "London, United Kingdom",
      rating: 5,
    },
    {
      quote: "Highly responsive and reliable. Having direct communication channels to the founding partner gives us huge confidence in our compliance status.",
      author: "Rajesh Sharma",
      role: "Managing Director, IT Exports",
      location: "Delhi, India",
      rating: 5,
    },
  ]
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-left">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="Testimonials & Evidence"
            title="What our clients say about Corplex"
            text="We support businesses across borders. Read how we provide trust, accurate bookkeeping, and peace of mind."
            inverse={false}
          />
          <div className="flex items-center gap-3 bg-[#F5F7FA] border border-[#E5E7EB] rounded-2xl p-4 shrink-0 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-extrabold text-xl">
              G
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#0A2540] text-sm">4.9 / 5.0</span>
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold mt-0.5">80+ Verified Google Reviews</p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] p-8 shadow-sm hover:border-[#C9A44C]/30 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                    Google Review
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#1A1A1A]/80 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 border-t border-[#E5E7EB] pt-4">
                <p className="text-sm font-bold text-[#0A2540]">{t.author}</p>
                <p className="text-xs text-[#1A1A1A]/60 mt-0.5">{t.role} · {t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Discovery Call',
      desc: 'Schedule a free 15-minute call. We analyze your ledger status, compliance requirements, and business objectives.',
    },
    {
      num: '02',
      title: 'Custom Mapping',
      desc: 'We draft a customized service proposal and compliance calendar outlining responsibilities, deadlines, and fixed fees.',
    },
    {
      num: '03',
      title: 'Ledger Migration',
      desc: 'Our cloud team configures your charts of accounts on Xero or QuickBooks, migrating historic data securely.',
    },
    {
      num: '04',
      title: 'Continuous Management',
      desc: 'We perform regular bookkeeping, run payroll, compile tax filings, and meet for proactive CFO advisory reviews.',
    },
  ]
  return (
    <section id="workflow" className="relative overflow-hidden border-b border-[#051329] bg-[#0A2540] text-white">
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center flex flex-col items-center">
        <SectionHeading
          eyebrow="Our Workflow"
          title="How we work together"
          text="We implement a structured onboarding process to ensure transitions are smooth, zero-downtime, and completely auditable."
          inverse={true}
          center={true}
        />
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-center w-full">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: idx * 0.08 }}
              className="relative rounded-3xl border border-white/10 bg-[#12365A]/35 p-8 hover:border-[#C9A44C]/30 transition-all group flex flex-col items-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <span className="text-4xl font-black text-[#C9A44C]/30 group-hover:text-[#C9A44C] transition-colors block mb-4">
                {s.num}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#C9A44C] transition-colors">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CoreValuesSection() {
  const values = [
    {
      title: 'Integrity & Compliance',
      desc: 'We uphold the highest ethical and regulatory standards, ensuring your books are audit-ready and fully compliant.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Financial Innovation',
      desc: 'Leveraging modern cloud technology like Xero and QuickBooks to automate reconciliations and streamline reporting.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Strategic Partnership',
      desc: 'We serve as your virtual CFO and advisory team, aligning every balance sheet decision with your growth ambitions.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Operational Excellence',
      desc: 'A strict commitment to zero-downtime ledger migration and precise, error-free tax filing.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Client Empathy',
      desc: 'We listen deeply to understand your business model, offering proactive support and transparent flat-fee pricing.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Absolute Accountability',
      desc: 'We stand behind every CT600, BAS, and payroll submission, guaranteeing prompt replies within one business day.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center flex flex-col items-center">
        <SectionHeading
          eyebrow="Our Core Values"
          title="Our Core Values"
          text="The principles that guide every decision we make and every solution we deliver."
          inverse={false}
          center={true}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full text-left">
          {values.map((v, idx) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: idx * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A44C]/45 hover:bg-white hover:shadow-[0_12px_24px_rgba(10,37,64,0.04)] cursor-default flex flex-col justify-between min-h-[200px]"
            >
              <div>
                {/* Small round box icon container */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A44C]/10 text-[#C9A44C] transition-all duration-300 group-hover:bg-[#C9A44C] group-hover:text-[#0A2540] mb-5">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] group-hover:text-[#C9A44C] transition-colors duration-300">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#1A1A1A]/70 group-hover:text-[#1A1A1A]/95 transition-colors duration-300">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const faqs = [
    {
      q: "What is your pricing approach?",
      a: "We believe in upfront, transparent, and fixed pricing. We do not charge surprise hourly fees. After reviewing your requirements and transaction volumes, we provide a tailored monthly flat-fee quote covering all agreed deliverables.",
    },
    {
      q: "What is your response time commitment?",
      a: "Professional services build on trust. We commit to a strict Service Level Agreement (SLA): we reply to all emails, messages, and calls within one business day.",
    },
    {
      q: "Can you help migrate our historic bookkeeping to Xero or QuickBooks?",
      a: "Yes. We specialize in ledger migrations. Whether you are moving from spreadsheets, old desktop software, or a previous accountant, we will map, clean, and upload all historical entries into modern cloud platforms.",
    },
    {
      q: "Which global jurisdictions do you cover?",
      a: "We provide dedicated, native compliance services for businesses operating in Australia, the United Kingdom, the United States, the United Arab Emirates, and India.",
    },
    {
      q: "How do you ensure data security?",
      a: "Data protection is central to our operation. We use encrypted cloud accounting databases (Xero, QuickBooks), multi-factor authentication, secure file-sharing portals, and strictly enforce internal confidentiality agreements.",
    },
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faqs" className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-left">
        <div className="text-center flex flex-col items-center">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently Asked Questions"
            text="Everything you need to know about our accounting, pricing model, and operations."
            inverse={false}
          />
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-[#0A2540] hover:text-[#C9A44C] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-xs">
                    {isOpen ? '-' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-[#1A1A1A]/70 border-t border-[#E5E7EB]/50 pt-4 bg-white/50">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Still have questions? Action-Oriented Repeating CTAs */}
        <div className="mt-16 text-center rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] p-8 shadow-sm">
          <h4 className="text-lg font-bold text-[#0A2540]">Still have questions?</h4>
          <p className="mt-2 text-sm text-[#1A1A1A]/70">Connect with an advisor to get your questions resolved in a personal consultation.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-[#0A2540] px-6 py-3 text-white hover:bg-[#12365A] transition-colors shadow-[0_4px_12px_rgba(10,37,64,0.15)]"
            >
              Book a Free Consultation
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-6 py-3 text-[#0A2540] hover:bg-[#F5F7FA] transition-colors"
            >
              Schedule a 15-Minute Discovery Call
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const seoArticles = [
  {
    title: "Bookkeeping for Australian Small Businesses: A BAS & Payroll Guide",
    excerpt: "Learn how to manage Single Touch Payroll (STP), reconcile accounts in Xero, and stay compliant with BAS Services Australia & PAYG requirements.",
    category: "Australia Tax",
    readTime: "5 min read",
    tags: ["BAS Services Australia", "Bookkeeping for Australian Small Businesses", "Payroll Services Australia"],
    slug: "bookkeeping-australian-small-businesses-bas-payroll",
    content: `
      <h4 class="font-bold text-lg text-[#0A2540] mb-2">Strategic Bookkeeping for Australian Small Businesses</h4>
      <p class="mb-4">Managing finances in Australia requires a clear understanding of the regulatory landscape governed by the Australian Taxation Office (ATO) and the Australian Securities and Investments Commission (ASIC).</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">1. Getting Started with BAS Services Australia</h5>
      <p class="mb-4">A Business Activity Statement (BAS) is used to report and pay goods and services tax (GST), pay-as-you-go (PAYG) instalments, PAYG withholding tax, and other tax obligations. Businesses registered for GST must file a BAS quarterly or monthly. Hiring registered BAS Agents ensures accurate reporting and avoids ATO penalties.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">2. Single Touch Payroll (STP) & Payroll Services Australia</h5>
      <p class="mb-4">Single Touch Payroll (STP) is an ATO requirement where employers report employee salary and wages, PAYG withholding, and superannuation details directly to the ATO each time they run payroll. Modern cloud accounting systems like Xero automate this, sending real-time data securely.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">3. Superannuation Guarantee (SG) Obligations</h5>
      <p class="mb-4">Employers must pay superannuation contributions for eligible employees into their designated super funds or a clearing house. The SG rate is paid quarterly. Failure to pay on time triggers a Superannuation Guarantee Charge (SGC) statement and severe interest penalties.</p>
    `
  },
  {
    title: "Navigating UK CIS Accounting & VAT Registration UK",
    excerpt: "A comprehensive guide on Construction Industry Scheme (CIS) deductions, HMRC filings, and registration rules for VAT Registration UK.",
    category: "UK Tax",
    readTime: "6 min read",
    tags: ["UK CIS Accounting", "VAT Registration UK"],
    slug: "uk-cis-accounting-vat-registration-guide",
    content: `
      <h4 class="font-bold text-lg text-[#0A2540] mb-2">Understanding UK Construction Industry & VAT Compliance</h4>
      <p class="mb-4">The UK tax system administered by HM Revenue and Customs (HMRC) has specific rules for construction contractors and VAT thresholds.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">1. UK CIS Accounting Requirements</h5>
      <p class="mb-4">Under the Construction Industry Scheme (CIS), contractors deduct money from a subcontractor's payments and pass it to HMRC. The deductions count as advance payments towards the subcontractor's tax and National Insurance. CIS returns must be filed monthly to avoid HMRC late-filing fines.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">2. Thresholds for VAT Registration UK</h5>
      <p class="mb-4">Businesses must register for VAT if their VAT taxable turnover is more than £85,000 in a rolling 12-month period. Registering for VAT allows you to reclaim VAT spent on business purchases, but requires you to charge VAT on your taxable sales and submit Making Tax Digital (MTD) compliant returns quarterly.</p>
    `
  },
  {
    title: "Step-by-Step Company Registration India & GST Setup",
    excerpt: "A detailed workflow covering MCA private limited incorporation, GST Registration India, and statutory board resolutions.",
    category: "India Tax",
    readTime: "5 min read",
    tags: ["Company Registration India", "GST Registration India"],
    slug: "company-registration-india-gst-setup-guide",
    content: `
      <h4 class="font-bold text-lg text-[#0A2540] mb-2">Launching a Business Entity in India</h4>
      <p class="mb-4">India is a rapidly growing market, but establishing a business involves multiple statutory approvals through the Ministry of Corporate Affairs (MCA) and tax portals.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">1. Company Registration India Process</h5>
      <p class="mb-4">To register a Private Limited Company, founders must obtain Digital Signature Certificates (DSC), reserve a name via the SPICe+ web form, submit the Articles of Association (AOA) and Memorandum of Association (MOA), and obtain a Corporate Identification Number (CIN) alongside PAN and TAN.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">2. Mandates for GST Registration India</h5>
      <p class="mb-4">Goods and Services Tax (GST) is a unified tax structure. Any business selling goods with a turnover exceeding ₹40 Lakhs (or ₹20 Lakhs for services/special category states) must obtain a GSTIN. GST Registration India is also mandatory for e-commerce operators and interstate suppliers.</p>
    `
  },
  {
    title: "Why High-Growth Companies Outsource Monthly Accounting Services",
    excerpt: "Comparing hourly billing against fixed Monthly Accounting Services. Learn how predictable pricing keeps books clean and avoids year-end stress.",
    category: "Advisory",
    readTime: "4 min read",
    tags: ["Monthly Accounting Services"],
    slug: "outsourcing-monthly-accounting-services-benefits",
    content: `
      <h4 class="font-bold text-lg text-[#0A2540] mb-2">The Case for Monthly Accounting Services</h4>
      <p class="mb-4">Many businesses treat accounting as a once-a-year tax season task. However, successful operators run bookkeeping on a continuous, monthly cycle.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">1. Real-Time Cash Flow Clarity</h5>
      <p class="mb-4">Monthly bank feeds reconciliation and accrual-based adjustments give executives an accurate view of operational margins and cash runways. Waiting until the end of the year to clean up transactions leads to inaccurate management decisions.</p>
      
      <h5 class="font-bold text-base text-[#0A2540] mb-2 mt-4">2. Fixed Monthly Fees vs. Hourly Bills</h5>
      <p class="mb-4">Predictable monthly pricing structures align the interests of the business and the accountant. Unlike hourly billing, fixed Monthly Accounting Services encourage ongoing communication, regular check-ins, and proactive tax-saving strategies without the fear of unexpected invoices.</p>
    `
  }
]

export function ResourcesSection() {
  const [activeArticle, setActiveArticle] = useState<typeof seoArticles[0] | null>(null)

  return (
    <section id="resources" className="relative overflow-hidden border-b border-[#E5E7EB] bg-[#F5F7FA]">
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center flex flex-col items-center">
        <SectionHeading
          eyebrow="Resources & Insights"
          title="Tax compliance and accounting updates"
          text="Explore regulatory changes, bookkeeping best practices, and international tax frameworks."
          inverse={false}
          center={true}
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {seoArticles.map((art, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:border-[#C9A44C]/30 hover:shadow-md transition-all h-full text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-[#C9A44C] uppercase tracking-wider">{art.category}</span>
                  <span className="text-[#1A1A1A]/40">{art.readTime}</span>
                </div>
                <h4
                  className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-[#0A2540] hover:text-[#C9A44C] transition-colors cursor-pointer"
                  onClick={() => setActiveArticle(art)}
                >
                  {art.title}
                </h4>
                <p className="mt-3 text-xs leading-relaxed text-[#1A1A1A]/70">
                  {art.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {art.tags.map((tag) => (
                    <span key={tag} className="text-[9px] bg-[#F5F7FA] text-[#0A2540]/60 px-2 py-0.5 rounded border border-[#E5E7EB] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-[#E5E7EB] pt-4">
                <button
                  onClick={() => setActiveArticle(art)}
                  suppressHydrationWarning
                  className="text-xs font-bold text-[#C9A44C] hover:text-[#b08e3d] flex items-center gap-1 group"
                >
                  Read Article
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reader Modal Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0 cursor-pointer bg-black/40"
            onClick={() => setActiveArticle(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-3xl rounded-3xl bg-white p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[85vh] text-[#1A1A1A] z-10"
          >
            <button
              onClick={() => setActiveArticle(null)}
              suppressHydrationWarning
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F5F7FA] text-sm text-[#0A2540] hover:bg-[#E5E7EB] transition-colors focus:outline-none font-bold"
            >
              ✕
            </button>
            <div className="text-xs font-semibold text-[#C9A44C] uppercase tracking-widest">
              {activeArticle.category} · {activeArticle.readTime}
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-extrabold text-[#0A2540] leading-tight">
              {activeArticle.title}
            </h2>
            <div className="mt-4 flex flex-wrap gap-1.5 border-b border-[#E5E7EB] pb-6">
              {activeArticle.tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-[#F5F7FA] text-[#0A2540] px-2.5 py-1 rounded-lg border border-[#E5E7EB] font-bold">
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="mt-6 text-sm leading-relaxed text-[#1A1A1A]/80 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: activeArticle.content }}
            />
            <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex justify-end gap-3 text-xs font-semibold">
              <button
                onClick={() => setActiveArticle(null)}
                suppressHydrationWarning
                className="rounded-full border border-[#E5E7EB] px-5 py-2.5 hover:bg-[#F5F7FA] transition-colors"
              >
                Close
              </button>
              <a
                href="#contact"
                onClick={() => setActiveArticle(null)}
                className="rounded-full bg-[#C9A44C] px-5 py-2.5 text-[#0A2540] hover:bg-[#ddb860] transition-colors"
              >
                Talk to an Accountant Today
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

export function CorporateLandingPage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PainPointsSection />
      <AboutCompanySection />
      <ProcessSection />
      <CoreValuesSection />
      <GlobalServicesSection />
      <IndustryVerticalsSection />
      <TechnologyPlatformsSection />
      <ResourcesSection />
      <FAQSection />
      <FounderSection />
      <TestimonialsSection />
      <ConsultationSection />
      <ContactSection />
    </div>
  )
}
