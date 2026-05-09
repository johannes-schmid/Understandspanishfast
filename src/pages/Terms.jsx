import SEO from '../components/SEO'

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of service for Most Common Spanish."
        canonical="https://mostcommonspanish.com/terms"
      />
      <main className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Use of the site</h2>
            <p>Most Common Spanish is a language learning tool currently in early access. By using this site you agree to use it for lawful purposes only.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Intellectual property</h2>
            <p>All content on this site — including vocabulary data, example sentences, and written articles — is the property of Most Common Spanish. Do not reproduce or redistribute without permission.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Disclaimer</h2>
            <p>The site is provided "as is" without warranties of any kind. We make no guarantees about learning outcomes or availability of the service.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Changes</h2>
            <p>We may update these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
            <p>Questions? Email <a href="mailto:hello@mostcommonspanish.com" className="underline">hello@mostcommonspanish.com</a>.</p>
          </div>
        </section>
      </main>
    </>
  )
}
