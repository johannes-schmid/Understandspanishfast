import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Fraunces, Inter } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  metadataBase: new URL('https://mostcommonspanish.com'),
  title: {
    default: 'Most Common Spanish Words — Frequency-Ranked Vocabulary List',
    template: '%s | Most Common Spanish',
  },
  description: 'Learn the most common Spanish words ranked by real-world frequency. The top 1,000 cover ~74% of everyday Spanish; 1,500 gets you to ~80% — the fastest path to real comprehension.',
  openGraph: {
    siteName: 'Most Common Spanish',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta name="theme-color" content="#F2EDE4" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5PBVCJEM6E" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5PBVCJEM6E');
        `}</Script>
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wr0vqt3izm");
        `}</Script>
        <Script id="material-symbols" strategy="afterInteractive">{`
          var l=document.createElement('link');l.rel='stylesheet';
          l.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
          document.head.appendChild(l);
        `}</Script>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
