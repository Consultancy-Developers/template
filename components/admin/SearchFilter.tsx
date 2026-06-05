'use client'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  subjectFilter: string
  onSubjectChange: (v: string) => void
  dateFilter: string
  onDateChange: (v: string) => void
  subjects: string[]
}

const selectClass =
  'border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900'

export default function SearchFilter({
  search, onSearchChange,
  subjectFilter, onSubjectChange,
  dateFilter, onDateChange,
  subjects,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 mb-4 flex-wrap">
      <input
        type="text"
        placeholder="Search name, email, subject..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <select value={subjectFilter} onChange={e => onSubjectChange(e.target.value)} className={selectClass}>
        <option value="">All Subjects</option>
        {subjects.map(s => (
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
