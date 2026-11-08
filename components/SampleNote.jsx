'use client'

import { useSearchParams } from 'next/navigation'

export default function SampleNote() {
  const params = useSearchParams()
  if (params.get('from') !== 'sample') return null
  return <p className="wb-note"><span className="dot" />You finished the 10-card sample. Here is the rest.</p>
}
