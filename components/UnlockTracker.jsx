'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function UnlockTracker() {
  useEffect(() => { trackEvent('purchase_complete') }, [])
  return null
}
