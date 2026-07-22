import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ThemedSeedClient from '@/components/ThemedSeedClient'

export const metadata = { title: 'Themed Session | Neuro' }

export default async function SeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('unlocked, card_front, tts_enabled')
    .eq('user_id', user.id)
    .maybeSingle()

  const unlocked = settings?.unlocked ?? false
  const cardFront = settings?.card_front ?? 'spanish'
  const ttsEnabled = settings?.tts_enabled ?? true

  return (
    <main style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #1C1A3A 0%, #2A1F4A 40%, #1A2842 100%)',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(127,119,221,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '60px', left: '-100px',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(83,74,183,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '60%',
        width: '200px', height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,100,200,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <ThemedSeedClient
          unlocked={unlocked}
          cardFront={cardFront}
          ttsEnabled={ttsEnabled}
        />
      </div>
    </main>
  )
}
