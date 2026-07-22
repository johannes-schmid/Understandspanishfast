import { createClient } from '@supabase/supabase-js'

// Service-role client for code that runs outside a request/cookie context
// (workflow steps, crons). Bypasses RLS — always filter by user_id explicitly.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
