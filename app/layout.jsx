import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  metadataBase: new URL('https://mostcommonspanish.com'),
  title: {
    default: 'Neuro — Spanish worth keeping',
    template: '%s | Neuro',
  },
  description: 'Learn the most common Spanish words ranked by real-world frequency. Master 3,000 high-frequency words and understand 95% of spoken Spanish — fast.',
  openGraph: {
    siteName: 'Neuro',
    images: ['/og-default.svg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#F2EDE4" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Cabinet+Grotesk:wght@300;400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5PBVCJEM6E" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5PBVCJEM6E');
        `}</Script>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
