import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('[auth/callback] code present:', !!code, '| cookies:', request.cookies.getAll().map(c => c.name))

  if (code) {
    const pendingCookies = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) { pendingCookies.push(...cookiesToSet) },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[auth/callback] exchange error:', error?.message ?? 'none', '| pending cookies:', pendingCookies.map(c => c.name))

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`)
      pendingCookies.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      )
      return response
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
