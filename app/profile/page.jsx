import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { coveragePct } from '@/lib/userStats'
import { resolveActivePack, computePackStats } from '@/lib/activePack'
import ProfileClient from '@/components/ProfileClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Profile | Most Common Spanish' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('card_front, tts_enabled, unlocked')
    .eq('user_id', user.id)
    .maybeSingle()

  const unlocked = settings?.unlocked ?? false
  const cardFront = settings?.card_front ?? 'spanish'
  const ttsEnabled = settings?.tts_enabled ?? true

  const activePack = await resolveActivePack(supabase, user.id)
  const packStats = await computePackStats(supabase, user.id, activePack, { unlocked })

  return (
    <ProfileClient
      name={user.user_metadata?.full_name ?? null}
      email={user.email}
      avatarUrl={user.user_metadata?.avatar_url ?? null}
      unlocked={unlocked}
      cardFront={cardFront}
      ttsEnabled={ttsEnabled}
      known={packStats.known}
      total={packStats.total}
      coverage={coveragePct(packStats.known)}
    />
  )
}
