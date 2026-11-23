'use client'

import { useState } from 'react'

export default function FlashcardFlip({ card, size = 'md' }) {
  const [flipped, setFlipped] = useState(false)
  const { rank, article, word, pos, meaning, es, en } = card

  return (
    <button
      type="button"
      className={`fp-card fp-${size}`}
      data-flipped={flipped || undefined}
      aria-pressed={flipped}
      aria-label={flipped ? `${word}: ${meaning}. Show the Spanish side` : `${article ? `${article} ` : ''}${word}. Show the meaning`}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="fp-inner">
        <span className="fp-face fp-front" aria-hidden={flipped}>
          <span className="fp-top"><span className="fp-rk tab">#{rank}</span><span>{pos}</span></span>
          <span className="fp-word" lang="es">{article && <span className="fp-art">{article} </span>}{word}</span>
          <span className="fp-hint">Tap to flip</span>
        </span>
        <span className="fp-face fp-back" aria-hidden={!flipped}>
          <span className="fp-top"><span className="fp-rk tab">#{rank}</span><span lang="es">{word}</span></span>
          <span className="fp-mean">{meaning}</span>
          <span className="fp-ex"><span lang="es">{es}</span><span className="fp-en">{en}</span></span>
        </span>
      </span>
    </button>
  )
}
