import { redirect } from 'next/navigation'

// The themed-session feature is merged into the pack builder's "Topic" mode.
export default function SeedPage() {
  redirect('/packs/new?tab=topic')
}
