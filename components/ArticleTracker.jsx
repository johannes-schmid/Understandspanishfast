'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function ArticleTracker({ slug }) {
  useEffect(() => { trackEvent('article_opened', { slug }) }, [])
  return null
}
