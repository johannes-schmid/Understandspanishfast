'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const LINKS = [
  { href: '/words/most-common-spanish-words', label: 'Word list', match: '/words' },
  { href: '/level-test', label: 'Level test', match: '/level-test' },
  { href: '/blog', label: 'Blog', match: '/blog' },
]

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

  const isActive = (match) => path.startsWith(match)

  return (
    <>
      <nav className={`neuro-nav${scrolled ? ' neuro-nav--scrolled' : ''}`}>
        <Link href="/" className="neuro-nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src="/icon.svg" alt="" width={28} height={28} style={{ objectFit: 'contain' }} priority />
          <span>Most Common Spanish</span>
        </Link>

        <ul className="neuro-nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActive(l.match) ? 'page' : undefined} className={isActive(l.match) ? 'is-active' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/study" className="neuro-nav-cta">Start free</Link>
          </li>
        </ul>

        <div className="mobile-nav-right">
          <Link href="/study" className="neuro-nav-cta mobile-cta">Start free</Link>
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

      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-menu-link">{l.label}</Link>
          ))}
          <div className="mobile-menu-actions">
            <Link href="/study" className="mobile-menu-btn-primary">Start the first 100 words →</Link>
          </div>
        </nav>
      </div>

      {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
