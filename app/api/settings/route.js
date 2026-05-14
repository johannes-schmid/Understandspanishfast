import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const patch = {}

  if (body.card_front !== undefined) {
    if (!['spanish', 'english'].includes(body.card_front)) {
      return NextResponse.json({ error: 'Invalid card_front' }, { status: 400 })
    }
    patch.card_front = body.card_front
  }

  if (body.tts_enabled !== undefined) {
    patch.tts_enabled = !!body.tts_enabled
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...patch })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
