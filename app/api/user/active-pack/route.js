import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Sets which pack drives the dashboard + study queue. null = the built-in
// 1500-word corpus pack.
export async function PATCH(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const packId = body.packId ?? null

  if (packId) {
    const { data: pack } = await supabase
      .from('vocab_packs')
      .select('id')
      .eq('id', packId)
      .eq('user_id', user.id)
      .maybeSingle()
    if (!pack) return NextResponse.json({ error: 'pack not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, active_pack_id: packId }, { onConflict: 'user_id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, activePackId: packId })
}
