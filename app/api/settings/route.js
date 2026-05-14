import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { card_front } = await request.json()
  if (!['spanish', 'english'].includes(card_front)) {
    return NextResponse.json({ error: 'Invalid card_front value' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, card_front })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
