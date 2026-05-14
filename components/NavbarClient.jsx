'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignInButton, SignOutButton } from '@/components/AuthButton'

export default function NavbarClient({ user }) {
  const path = usePathname()

  return (
    <nav className="neuro-nav">
      <Link href="/" className="neuro-nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Image src="/logo-element.png" alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
        neuro<span>.</span>
      </Link>
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
          <li>
            <a href="/get-started" className="neuro-nav-cta">Start free</a>
          </li>
        )}
      </ul>
    </nav>
  )
}
