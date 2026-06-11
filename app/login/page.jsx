import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignInButton } from '@/components/AuthButton'

export const metadata = {
  title: 'Sign in | Most Common Spanish',
  robots: { index: false },
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--white-matter)',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid var(--cream-dark)',
        boxShadow: '0 8px 40px rgba(28,26,58,0.07)',
        textAlign: 'center',
      }}>

        <p style={{ fontSize: '13px', color: 'var(--cortex)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Most Common Spanish
        </p>

        <h1 style={{
          fontFamily: 'Fraunces',
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--deep-mind)',
          letterSpacing: '-0.5px',
          lineHeight: 1.15,
          marginBottom: '10px',
        }}>
          Welcome back
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--cortex)', lineHeight: 1.6, marginBottom: '36px' }}>
          Sign in to pick up where you left off.
        </p>

        <SignInButton className="btn-google" style={{ width: '100%', justifyContent: 'center' }}>
          <GoogleIcon />
          Sign in with Google
        </SignInButton>

        <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--cortex)' }}>
          No account yet?{' '}
          <a href="/get-started" style={{ color: 'var(--synapse)', fontWeight: 600, textDecoration: 'none' }}>
            Get started free →
          </a>
        </p>

      </div>
    </main>
  )
}
