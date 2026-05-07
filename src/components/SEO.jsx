import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, canonical, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} | Most Common Spanish` : 'Most Common Spanish — Master 1500 Words, Unlock 80% of Everyday Spanish'
  const desc = description || 'Track every Spanish word you learn and unlock real-world content faster. Data-driven vocabulary for adult learners.'
  const url = canonical ? `https://mostcommonspanish.com${canonical}` : 'https://mostcommonspanish.com/'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
