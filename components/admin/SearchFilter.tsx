'use client'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  serviceFilter: string
  onServiceChange: (v: string) => void
  dateFilter: string
  onDateChange: (v: string) => void
  services: string[]
}

const selectClass =
  'rounded-md border border-[#E5E7EB] bg-[#F5F7FA] px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0A2540]'

export default function SearchFilter({
  search, onSearchChange,
  serviceFilter, onServiceChange,
  dateFilter, onDateChange,
  services,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <input
        type="text"
        placeholder="Search name, email, company..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="min-w-48 flex-1 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/45 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
      />
      <select value={serviceFilter} onChange={e => onServiceChange(e.target.value)} className={selectClass}>
        <option value="">All Services</option>
        {services.map(s => (
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
