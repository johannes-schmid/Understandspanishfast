'use client'

import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'

export function SignInButton({ className, children }) {
  async function handleSignIn() {
    trackEvent('sign_up')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button onClick={handleSignIn} className={className}>
      {children ?? 'Sign in with Google'}
    </button>
  )
}

export function SignOutButton({ className, children }) {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button onClick={handleSignOut} className={className}>
      {children ?? 'Sign out'}
    </button>
  )
}
