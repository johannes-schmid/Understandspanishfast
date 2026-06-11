'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AppRedirect() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const redirectUrl = searchParams.get('redirectUrl')
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }, [searchParams])

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <p style={{ fontSize: '48px', marginBottom: '16px' }}>✓</p>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 800,
        color: 'var(--deep-mind, #1C1A3A)',
        marginBottom: '10px',
        letterSpacing: '-0.5px',
      }}>
        You're signed in
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--cortex, #6A6A8A)', lineHeight: 1.6, maxWidth: '280px' }}>
        Returning you to the app…
      </p>
    </main>
  )
}

export default function AppRedirectPage() {
  return (
    <Suspense>
      <AppRedirect />
    </Suspense>
  )
}
