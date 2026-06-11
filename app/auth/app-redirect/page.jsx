'use client'

import { useEffect } from 'react'

export default function AppRedirectPage() {
  useEffect(() => {
    // Open the app via deep link
    window.location.href = 'mostcommonspanish://auth-success'
    // Fallback: if app isn't installed, redirect to App Store after delay
    setTimeout(() => {
      window.location.href = 'https://mostcommonspanish.com'
    }, 2500)
  }, [])

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
