import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PackBuilderClient from '@/components/PackBuilderClient'
import { canBuildPack } from '@/lib/packLimit'

export const metadata = { title: 'New Pack | Most Common Spanish' }
export const dynamic = 'force-dynamic'

export default async function NewPackPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const params = await searchParams
  const initialTab = params?.tab ?? 'url'
  const { unlocked, count } = await canBuildPack(supabase, user.id)

  return <PackBuilderClient unlocked={unlocked} packCount={count} initialTab={initialTab} />
}
