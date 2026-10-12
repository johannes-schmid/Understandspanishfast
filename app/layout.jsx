import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Fraunces } from 'next/font/google'
import localFont from 'next/font/local'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  display: 'swap',
  variable: '--font-fraunces',
})

const cabinet = localFont({
  src: [
    { path: './fonts/CabinetGrotesk-300.woff2', weight: '300' },
    { path: './fonts/CabinetGrotesk-400.woff2', weight: '400' },
    { path: './fonts/CabinetGrotesk-500.woff2', weight: '500' },
    { path: './fonts/CabinetGrotesk-700.woff2', weight: '700' },
    { path: './fonts/CabinetGrotesk-800.woff2', weight: '800' },
  ],
  display: 'swap',
  variable: '--font-cabinet',
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
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${cabinet.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta name="theme-color" content="#F2EDE4" />
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
