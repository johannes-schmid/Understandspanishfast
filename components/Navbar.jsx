import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import NavbarClient from '@/components/NavbarClient'
import MobileTabBar from '@/components/MobileTabBar'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <NavbarClient user={user} />
      {user && <MobileTabBar />}
    </>
  )
}
