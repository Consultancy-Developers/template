import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-[88vh] text-center px-6">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
          Welcome
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Simple. Fast. Template.
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-10">
          A production-ready site skeleton — pages, contact form, email, and admin dashboard all wired up.
        </p>
        <Link
          href="/contact"
          className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
        >
          Get in Touch
        </Link>
      </section>

      <section className="border-t border-gray-100 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Template gives teams a solid, honest foundation. No bloat, no magic — just well-structured code you can build on.
          </p>
          <Link
            href="/about"
            className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </>
  )
}
