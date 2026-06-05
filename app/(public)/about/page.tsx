const pillars = [
  {
    title: 'Mission',
    text: 'Empower teams to ship faster without sacrificing quality or maintainability.',
  },
  {
    title: 'Values',
    text: 'Simplicity, transparency, and developer experience above all else.',
  },
  {
    title: 'Team',
    text: 'A small distributed team of builders who care deeply about craft.',
  },
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        About Us
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Built for builders
      </h1>
      <p className="text-lg text-gray-500 mb-16 max-w-2xl">
        Template was created to give teams a starting point that is honest and minimal — nothing you don't need, everything you do.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map(({ title, text }) => (
          <div
            key={title}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
