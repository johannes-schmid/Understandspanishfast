import { createAdminClient } from '@/lib/supabase/admin'

// Ephemeral inter-step storage for raw text / candidate lists that must NOT be
// exposed to the LLM. Keyed by (build_id, kind). Written/read via the service role.

export async function putArtifact(buildId, kind, data) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('pack_build_artifacts')
    .upsert({ build_id: buildId, kind, data }, { onConflict: 'build_id,kind' })
  if (error) throw new Error(`putArtifact(${kind}): ${error.message}`)
}

export async function getArtifact(buildId, kind) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('pack_build_artifacts')
    .select('data')
    .eq('build_id', buildId)
    .eq('kind', kind)
    .maybeSingle()
  if (error) throw new Error(`getArtifact(${kind}): ${error.message}`)
  return data?.data ?? null
}
