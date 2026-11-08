export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Most Common Spanish.',
  alternates: { canonical: 'https://mostcommonspanish.com/terms' },
}

export default function Terms() {
  return (
    <main className="cl cl-home">
      <div className="wrap ct-legal">
        <header className="ct-legal-head">
          <h1 className="post-title">Terms of Service</h1>
          <p className="post-meta">Last updated: November 2026</p>
        </header>

        <section className="card post-sheet">
          <div className="post-body">
            <h2>Use of the site</h2>
            <p>Most Common Spanish offers free Spanish word lists, a free flashcard sample and a printable workbook. By using this site you agree to use it for lawful purposes only.</p>

            <h2>Intellectual property</h2>
            <p>All content on this site, including vocabulary data, example sentences, and written articles, is the property of Most Common Spanish. Do not reproduce or redistribute without permission.</p>

            <h2>Disclaimer</h2>
            <p>The site is provided &ldquo;as is&rdquo; without warranties of any kind. We make no guarantees about learning outcomes or availability of the service.</p>

            <h2>Changes</h2>
            <p>We may update these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>

            <h2>Contact</h2>
            <p>Questions? Email <a href="mailto:hello@mostcommonspanish.com">hello@mostcommonspanish.com</a>.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
