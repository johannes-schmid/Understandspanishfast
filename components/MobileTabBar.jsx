'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/dashboard', label: 'Study', icon: 'school', match: (p) => p === '/dashboard' || p.startsWith('/study') },
  { href: '/packs', label: 'Packs', icon: 'layers', match: (p) => p.startsWith('/packs') },
  { href: '/reading', label: 'Reading', icon: 'menu_book', match: (p) => p.startsWith('/reading') },
  { href: '/profile', label: 'Profile', icon: 'person', match: (p) => p.startsWith('/profile') },
]

export default function MobileTabBar() {
  const path = usePathname()

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {TABS.map((tab) => {
        const active = tab.match(path)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mobile-tab ${active ? 'mobile-tab--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="mobile-tab-icon material-symbols-rounded">{tab.icon}</span>
            <span className="mobile-tab-label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
