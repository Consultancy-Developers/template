import ContactForm from '@/components/ContactForm'

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
        Contact
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in touch</h1>
      <p className="text-gray-500 mb-10">
        Fill out the form below and we&apos;ll respond as soon as possible.
      </p>
      <ContactForm />
    </div>
  )
}
