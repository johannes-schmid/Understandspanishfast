// Increments today's study_activity count for a user. Shared by /api/progress and
// /api/pack-progress so streak/activity logic stays identical. Uses the caller's
// (authenticated) Supabase client; study_activity RLS restricts to own rows.
export async function bumpStudyActivity(supabase, userId) {
  const todayIso = new Date().toISOString().slice(0, 10)

  const { data: todayRow } = await supabase
    .from('study_activity')
    .select('cards_reviewed')
    .eq('user_id', userId)
    .eq('date', todayIso)
    .maybeSingle()

  const newCount = (todayRow?.cards_reviewed ?? 0) + 1
  const { error } = await supabase
    .from('study_activity')
    .upsert({ user_id: userId, date: todayIso, cards_reviewed: newCount }, { onConflict: 'user_id,date' })

  // Fallback: if the cards_reviewed column doesn't exist yet, upsert date-only.
  if (error && error.code === '42703') {
    await supabase
      .from('study_activity')
      .upsert({ user_id: userId, date: todayIso }, { onConflict: 'user_id,date' })
  }

  return { date: todayIso, cards_reviewed: newCount }
}
