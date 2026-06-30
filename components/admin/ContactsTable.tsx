import type { Contact } from '@/types'

interface Props {
  contacts: Contact[]
}

export default function ContactsTable({ contacts }: Props) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center">
        <p className="text-sm text-[#1A1A1A]/60">No contacts found</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F5F7FA]">
              {['Name', 'Email', 'Phone', 'Company', 'Country', 'Service', 'Date', 'Message'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#1A1A1A]/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F5F7FA]">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#1A1A1A]">{c.name}</td>
                <td className="px-4 py-3 text-[#1A1A1A]/70">{c.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#1A1A1A]/70">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-[#1A1A1A]/70">{c.company}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[#1A1A1A]/70">{c.country}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-[#F5F7FA] px-2 py-0.5 text-xs text-[#0A2540]">
                    {c.service_required}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#1A1A1A]/70">
                  {new Date(c.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-[#1A1A1A]/70" title={c.message}>
                  {c.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
