import type { Contact } from '@/types'

interface Props {
  contacts: Contact[]
}

export default function ContactsTable({ contacts }: Props) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-sm">No contacts found</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Name', 'Email', 'Phone', 'Subject', 'Date', 'Message'].map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
              <td className="px-4 py-3 text-gray-500">{c.email}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.phone ?? '—'}</td>
              <td className="px-4 py-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                  {c.subject}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(c.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td
                className="px-4 py-3 text-gray-500 max-w-xs truncate"
                title={c.message}
              >
                {c.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
