import './globals.css'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Lexend } from "next/font/google";
import { cn } from "@/lib/utils";

const lexend = Lexend({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  metadataBase: new URL('https://mostcommonspanish.com'),
  title: {
    default: 'Most Common Spanish Words — Master 1,500, Understand 80%',
    template: '%s | Most Common Spanish',
  },
  description: 'Learn the most common Spanish words ranked by real-world frequency. Master 1,500 high-frequency words and understand 80% of everyday Spanish — fast.',
  openGraph: {
    siteName: 'Most Common Spanish',
    images: ['/og-default.svg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", lexend.variable)}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#FF8C00" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400..700,0..1,-50..200&display=swap" rel="stylesheet" />
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
