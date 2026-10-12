'use client'

import { useState } from 'react'
import Link from 'next/link'

const CARDS = [
  { rank: 1, es: 'ser', en: 'to be', pos: 'verb', ex: 'Mi hermano es médico.' },
  { rank: 7, es: 'hacer', en: 'to do · to make', pos: 'verb', ex: '¿Qué vas a hacer hoy?' },
  { rank: 21, es: 'aquí', en: 'here', pos: 'adverb', ex: 'Te espero aquí.' },
]

export default function HeroCard() {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = CARDS[i]

  function onClick() {
    if (!flipped) return setFlipped(true)
    setFlipped(false)
    setI((n) => (n + 1) % CARDS.length)
  }

  return (
    <div className="hero-card-wrap">
      <button
        type="button"
        className={`hero-card${flipped ? ' is-flipped' : ''}`}
        onClick={onClick}
        aria-label={flipped ? 'Next word' : `Reveal the meaning of ${card.es}`}
      >
        <span className="hero-card-glow" aria-hidden="true" />
        <span className="hero-card-meta">
          <span>Español</span>
          <span className="tabular">#{card.rank} of 1,500</span>
        </span>
        <span className="hero-card-body" key={`${i}-${flipped}`}>
          {!flipped ? (
            <>
              <span className="hero-card-word">{card.es}</span>
              <span className="hero-card-pos">{card.pos}</span>
            </>
          ) : (
            <>
              <span className="hero-card-answer">{card.en}</span>
              <span className="hero-card-ex">{card.ex}</span>
            </>
          )}
        </span>
        <span className="hero-card-cta">{flipped ? 'Tap for the next word' : 'Tap to flip'}</span>
      </button>
      <Link href="/study" className="hero-card-chip">
        <span className="hero-card-chip-num">100</span>
        <span>words free.<br />No account.</span>
      </Link>
    </div>
  )
}
