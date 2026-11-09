'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const LINKS = [
  { href: '/words/most-common-spanish-words', label: 'Word lists', match: '/words' },
  { href: '/level-test', label: 'Level test', match: '/level-test' },
  { href: '/shop', label: 'Shop', match: ['/shop', '/workbook', '/anki-spanish-deck', '/thanks'], isNew: true },
  { href: '/blog', label: 'Blog', match: '/blog' },
]

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="2" width="4" height="14" rx="1.5" fill="#fcfcff" /><rect x="7" y="7" width="4" height="9" rx="1.5" fill="#fcfcff" opacity=".7" /><rect x="13" y="11" width="4" height="5" rx="1.5" fill="#f26b3a" /></svg>
    </span>
  )
}

export default function NavbarClient() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setOpen(false) }, [path])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (match) => [].concat(match).some((m) => path.startsWith(m))

  return (
    <>
      <nav className={`neuro-nav cl${scrolled ? ' neuro-nav--scrolled' : ''}`}>
        <Link href="/" className="neuro-nav-logo">
          <BrandMark />
          Most Common Spanish
        </Link>

        <ul className="neuro-nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActive(l.match) ? 'page' : undefined} className={[isActive(l.match) && 'is-active', l.isNew && 'new'].filter(Boolean).join(' ') || undefined}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/study" className="neuro-nav-cta">Start for free</Link>
          </li>
        </ul>

        <div className="mobile-nav-right">
          <Link href="/study" className="neuro-nav-cta mobile-cta">Start for free</Link>
          <button
            className="burger-btn"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`burger-bar ${open ? 'open' : ''}`} />
            <span className={`burger-bar ${open ? 'open' : ''}`} />
            <span className={`burger-bar ${open ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu cl ${open ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-menu-link">{l.label}</Link>
          ))}
          <div className="mobile-menu-actions">
            <Link href="/study" className="mobile-menu-btn-primary">Start for free</Link>
          </div>
        </nav>
      </div>

      {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
