'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Navbar() {
  const pathname = usePathname()

  const linkCls = (href) =>
    `font-medium transition-all ${pathname === href ? 'text-[#FF8C00]' : 'text-slate-500 hover:text-slate-800'}`

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-orange-100/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img src="/icon.svg" alt="" width="32" height="32" className="rounded-lg" />
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Most Common <span className="text-[#FF8C00]">Spanish</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkCls('/')}>Method</Link>
          <Link href="/level-test" className={linkCls('/level-test')}>Level Test</Link>
          <Link href="/words/most-common-spanish-words" className={linkCls('/words/most-common-spanish-words')}>1000 Words</Link>
          <Link href="/blog" className={linkCls('/blog')}>Blog</Link>
        </div>
        <Link href="/#waitlist" className="bg-[#FF8C00] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm active:scale-[0.98] transition-transform hover:bg-[#E67E00] shadow-md shadow-orange-200/50 no-underline">
          Join Waitlist
        </Link>
      </div>
    </nav>
  )
}
