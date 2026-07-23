import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PacksList from '@/components/PacksList'
import { resolveActivePack } from '@/lib/activePack'
import { canBuildPack } from '@/lib/packLimit'

export const metadata = { title: 'Packs | Most Common Spanish' }
export const dynamic = 'force-dynamic'

export default async function PacksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: packs }, activePack, { allowed }] = await Promise.all([
    supabase
      .from('vocab_packs')
      .select('id, title, source_type, word_count, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    resolveActivePack(supabase, user.id),
    canBuildPack(supabase, user.id),
  ])

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '96px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
        <PacksList packs={packs ?? []} activePackId={activePack.id ?? null} canBuild={allowed} />
      </div>
    </main>
  )
}
