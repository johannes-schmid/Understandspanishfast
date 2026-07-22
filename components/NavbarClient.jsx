'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SignInButton, SignOutButton } from '@/components/AuthButton'

export default function NavbarClient({ user }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [path])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className="neuro-nav">
        <Link href="/" className="neuro-nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src="/logo-element.png" alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
          comprendo<span>.</span>
        </Link>

        {/* Desktop links */}
        <ul className="neuro-nav-links">
          <li><Link href="/blog" style={{ color: path.startsWith('/blog') ? 'var(--deep-mind)' : undefined }}>Blog</Link></li>
          <li><Link href="/level-test" style={{ color: path === '/level-test' ? 'var(--deep-mind)' : undefined }}>Level test</Link></li>
          <li><Link href="/words/most-common-spanish-words" style={{ color: path.startsWith('/words') ? 'var(--deep-mind)' : undefined }}>Word list</Link></li>
          {user ? (
            <>
              <li>
                <Link href="/dashboard" style={{ color: path.startsWith('/dashboard') || path.startsWith('/study') ? 'var(--deep-mind)' : undefined }}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reading" style={{ color: path.startsWith('/reading') ? 'var(--deep-mind)' : undefined }}>
                  Reading
                </Link>
              </li>
              <li>
                <SignOutButton className="neuro-nav-cta" style={{ background: 'transparent', border: '1px solid var(--cortex)', color: 'var(--cortex)' }}>
                  Sign out
                </SignOutButton>
              </li>
            </>
          ) : (
            <>
              <li>
                <SignInButton className="neuro-nav-login">Log in</SignInButton>
              </li>
              <li>
                <a href="/practice" className="neuro-nav-cta">Start free</a>
              </li>
            </>
          )}
        </ul>

        {/* Mobile: right side — CTA + burger */}
        <div className="mobile-nav-right">
          <a href="/practice" className="neuro-nav-cta mobile-cta">Start free</a>
          <button
            className="burger-btn"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className={`burger-bar ${open ? 'open' : ''}`} />
            <span className={`burger-bar ${open ? 'open' : ''}`} />
            <span className={`burger-bar ${open ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu-links">
          <Link href="/words/most-common-spanish-words" className="mobile-menu-link">Word list</Link>
          <Link href="/level-test" className="mobile-menu-link">Level test</Link>
          <Link href="/blog" className="mobile-menu-link">Blog</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="mobile-menu-link">Dashboard</Link>
              <Link href="/reading" className="mobile-menu-link">Reading</Link>
              <div style={{ marginTop: '8px' }}>
                <SignOutButton className="mobile-menu-btn-outline">Sign out</SignOutButton>
              </div>
            </>
          ) : (
            <div className="mobile-menu-actions">
              <SignInButton className="mobile-menu-btn-outline">Log in</SignInButton>
              <a href="/practice" className="mobile-menu-btn-primary">Start free →</a>
            </div>
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {open && <div className="mobile-menu-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}
