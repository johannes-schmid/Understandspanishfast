'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fit, readReach } from '@/lib/watchFit'

export default function ShowYourFit({ show }) {
  const [reach, setReach] = useState(null)
  useEffect(() => { setReach(readReach()) }, [])
  if (reach == null) {
    return <p className="sh-you">How much would you follow? <Link className="tlink" href="/level-test">Take the 2-minute vocabulary test</Link> and we show your number on every title.</p>
  }
  const f = fit(show, reach)
  return (
    <p className="sh-you">
      With your <b>~{reach.toLocaleString('en')} words</b> you recognise <b>{Math.round(f.value)}%</b> of {show.title}: <span className={`sx-tag sx-${f.key}`}>{f.label}</span> {f.hint}.
    </p>
  )
}
