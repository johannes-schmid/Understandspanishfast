export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Most Common Spanish. Learn how we collect and use your data.',
  alternates: { canonical: 'https://mostcommonspanish.com/privacy' },
}

export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What we collect</h2>
          <p>When you sign up for early access, we collect your email address. We use Google Analytics to understand how visitors use the site (pages viewed, time on site). No personally identifiable information is shared with analytics.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">How we use your data</h2>
          <p>Your email is used only to send product updates and early access invitations. We do not sell or share your email with third parties.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cookies</h2>
          <p>We use cookies for analytics (Google Analytics). You can disable cookies in your browser settings at any time.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your rights</h2>
          <p>You can request deletion of your data at any time by emailing us at <a href="mailto:hello@mostcommonspanish.com" className="underline">hello@mostcommonspanish.com</a>.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
          <p>Questions? Email <a href="mailto:hello@mostcommonspanish.com" className="underline">hello@mostcommonspanish.com</a>.</p>
        </div>
      </section>
    </main>
  )
}
