'use client'

import { useEffect } from 'react'

export default function AudioDelegate() {
  useEffect(() => {
    let audio = null
    let active = null

    function stop() {
      if (audio) { audio.pause(); audio.onended = null }
      if (active) { active.classList.remove('on'); active.setAttribute('aria-pressed', 'false') }
      audio = null
      active = null
    }

    function onClick(e) {
      const btn = e.target.closest('button[data-say]')
      if (!btn) return
      const same = btn === active
      stop()
      if (same) return
      active = btn
      btn.classList.add('on')
      btn.setAttribute('aria-pressed', 'true')
      audio = new Audio(`/audio/${encodeURIComponent(btn.dataset.say)}`)
      audio.onended = stop
      audio.play().catch(stop)
    }

    document.addEventListener('click', onClick)
    return () => { document.removeEventListener('click', onClick); stop() }
  }, [])

  return null
}
