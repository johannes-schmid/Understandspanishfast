// Free accounts may create ONE AI-generated pack. Buying the one-time €5 unlock
// (user_settings.unlocked) lifts the limit. There is no subscription tier.

export const FREE_PACK_LIMIT = 1

// Pass any Supabase client scoped to the user (cookie client in a request, or an
// admin client with explicit user_id filtering). Returns whether another pack is
// allowed plus the numbers behind the decision.
export async function canBuildPack(supabase, userId) {
  const [{ data: settings }, { count }] = await Promise.all([
    supabase.from('user_settings').select('unlocked').eq('user_id', userId).maybeSingle(),
    supabase.from('vocab_packs').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])
  const unlocked = settings?.unlocked ?? false
  const packCount = count ?? 0
  return {
    unlocked,
    count: packCount,
    allowed: unlocked || packCount < FREE_PACK_LIMIT,
  }
}
