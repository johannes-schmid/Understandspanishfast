import { Helmet } from 'react-helmet-async'

const DEFAULT_TITLE = 'Most Common Spanish Words — Master 1,500, Understand 80%'
const DEFAULT_DESC = 'Learn the most common Spanish words ranked by real-world frequency. Master 1,500 high-frequency words and understand 80% of everyday Spanish — fast.'
const DEFAULT_IMAGE = 'https://mostcommonspanish.com/og-default.svg'

export default function SEO({ title, description, canonical, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} | Most Common Spanish` : DEFAULT_TITLE
  const desc = description || DEFAULT_DESC
  const url = canonical ? `https://mostcommonspanish.com${canonical}` : 'https://mostcommonspanish.com/'
  const ogImage = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Most Common Spanish" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
