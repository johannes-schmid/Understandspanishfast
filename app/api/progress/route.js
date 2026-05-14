import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { computeSRS, RATING } from '@/lib/srs'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { word_rank, status } = await request.json()
  if (!word_rank || !['again', 'hard', 'good', 'easy'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('user_word_progress')
    .select('interval, ease_factor, repetitions')
    .eq('user_id', user.id)
    .eq('word_rank', word_rank)
    .maybeSingle()

  const srs = computeSRS(
    existing?.interval ?? 1,
    existing?.ease_factor ?? 2.5,
    existing?.repetitions ?? 0,
    RATING[status]
  )

  const { error } = await supabase
    .from('user_word_progress')
    .upsert(
      { user_id: user.id, word_rank, status, ...srs },
      { onConflict: 'user_id,word_rank' }
    )

  if (error) {
    if (error.code === '23514') return NextResponse.json({ ok: true, pending_migration: true })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update study_activity for today — try with cards_reviewed, fall back to date-only
  const todayIso = new Date().toISOString().slice(0, 10)

  const { data: todayRow, error: fetchErr } = await supabase
    .from('study_activity')
    .select('cards_reviewed')
    .eq('user_id', user.id)
    .eq('date', todayIso)
    .maybeSingle()

  if (fetchErr) {
    console.error('[study_activity] fetch error:', fetchErr.message, fetchErr.code)
  }

  const newCount = (todayRow?.cards_reviewed ?? 0) + 1
  const { error: upsertErr } = await supabase
    .from('study_activity')
    .upsert(
      { user_id: user.id, date: todayIso, cards_reviewed: newCount },
      { onConflict: 'user_id,date' }
    )

  if (upsertErr) {
    console.error('[study_activity] upsert error:', upsertErr.message, upsertErr.code)
    // Fallback: try without cards_reviewed in case column doesn't exist yet
    if (upsertErr.code === '42703') {
      const { error: fallbackErr } = await supabase
        .from('study_activity')
        .upsert({ user_id: user.id, date: todayIso }, { onConflict: 'user_id,date' })
      if (fallbackErr) {
        console.error('[study_activity] fallback error:', fallbackErr.message, fallbackErr.code)
      }
    }
  }

  return NextResponse.json({ ok: true, activity: { date: todayIso, cards_reviewed: newCount } })
}
