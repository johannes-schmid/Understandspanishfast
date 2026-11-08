export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Most Common Spanish. Learn how we collect and use your data.',
  alternates: { canonical: 'https://mostcommonspanish.com/privacy' },
}

export default function Privacy() {
  return (
    <main className="cl cl-home">
      <div className="wrap ct-legal">
        <header className="ct-legal-head">
          <h1 className="post-title">Privacy Policy</h1>
          <p className="post-meta">Last updated: November 2026</p>
        </header>

        <section className="card post-sheet">
          <div className="post-body">
            <h2>What we collect</h2>
            <p>There are no accounts on this site, so we don&rsquo;t store a profile, password or payment details. We collect three things:</p>
            <ul>
              <li><b>Your email address</b>, only if you enter it in the free PDF download form.</li>
              <li><b>Flashcard progress</b>, which is saved in your own browser (localStorage) so the free sample remembers where you left off. It never leaves your device and you can clear it by clearing your browser data.</li>
              <li><b>Usage analytics.</b> We use Google Analytics to understand how visitors use the site (pages viewed, time on site) and Microsoft Clarity to see, in aggregate, how people interact with pages. No personally identifiable information is shared with these tools.</li>
            </ul>

            <h2>How we use your data</h2>
            <p>If you request the free PDF, your email address is stored with our email provider, Resend, and used to send you the PDF and occasional updates about Most Common Spanish. We do not sell or share your email with third parties.</p>

            <h2>Cookies</h2>
            <p>We use cookies for analytics (Google Analytics and Microsoft Clarity). You can disable cookies in your browser settings at any time.</p>

            <h2>Your rights</h2>
            <p>You can request deletion of your data at any time by emailing us at <a href="mailto:hello@mostcommonspanish.com">hello@mostcommonspanish.com</a>.</p>

            <h2>Contact</h2>
            <p>Questions? Email <a href="mailto:hello@mostcommonspanish.com">hello@mostcommonspanish.com</a>.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
