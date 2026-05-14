'use client'

import { useState, useMemo } from 'react'
import { words as allWords } from '@/data/words'

// Build lookup: lowercase Spanish word → {rank, meanings, pos}
const wordMap = new Map(allWords.map(w => [w.word.toLowerCase(), w]))

function tokenize(text) {
  // Split into word tokens and non-word tokens (spaces, punctuation)
  return text.split(/(\s+|[.,;:!?¡¿"«»—–()\[\]]+)/).filter(Boolean)
}

function cleanToken(token) {
  return token.replace(/^[¿¡"«(]+|[.,;:!?"»)]+$/g, '').toLowerCase()
}

export default function ArticleReader({ article, knownRanks, seenRanks }) {
  const knownSet = useMemo(() => new Set(knownRanks), [knownRanks])
  const seenSet = useMemo(() => new Set(seenRanks), [seenRanks])
  const [tooltip, setTooltip] = useState(null) // { word, rank, meanings, pos }
  const [tooltipToken, setTooltipToken] = useState(null)

  const tokens = useMemo(() => tokenize(article.text), [article.text])

  const knownCount = useMemo(() => {
    const matched = new Set()
    tokens.forEach(t => {
      const clean = cleanToken(t)
      const entry = wordMap.get(clean)
      if (entry && knownSet.has(entry.rank)) matched.add(entry.rank)
    })
    return matched.size
  }, [tokens, knownSet])

  const totalVocabTokens = useMemo(() => {
    const matched = new Set()
    tokens.forEach(t => {
      const clean = cleanToken(t)
      const entry = wordMap.get(clean)
      if (entry) matched.add(entry.rank)
    })
    return matched.size
  }, [tokens])

  const knownPct = totalVocabTokens > 0 ? Math.round((knownCount / totalVocabTokens) * 100) : 0

  function getTokenStyle(token) {
    const clean = cleanToken(token)
    if (!clean || /^\s+$/.test(token)) return null
    const entry = wordMap.get(clean)
    if (!entry) return null
    if (knownSet.has(entry.rank)) return { color: '#2D7A5F', fontWeight: 500, cursor: 'pointer', borderBottom: '1.5px solid #2D7A5F' }
    if (seenSet.has(entry.rank)) return { color: '#C07050', fontWeight: 500, cursor: 'pointer', borderBottom: '1.5px dashed #EACFBB' }
    return { color: 'var(--cortex)', cursor: 'pointer', borderBottom: '1.5px dashed #ccc' }
  }

  function handleWordClick(token) {
    const clean = cleanToken(token)
    const entry = wordMap.get(clean)
    if (!entry) return
    if (tooltipToken === token) {
      setTooltip(null)
      setTooltipToken(null)
      return
    }
    setTooltip(entry)
    setTooltipToken(token)
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) { setTooltip(null); setTooltipToken(null) } }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2D7A5F', display: 'inline-block' }} />
          <span style={{ color: 'var(--cortex)' }}>Known ({knownCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C07050', display: 'inline-block' }} />
          <span style={{ color: 'var(--cortex)' }}>Seen</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
          <span style={{ color: 'var(--cortex)' }}>New</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 600, color: 'var(--signal)' }}>
          {knownPct}% of tracked words known
        </div>
      </div>

      {/* Article text */}
      <div style={{
        fontSize: '16px', lineHeight: 1.85, color: 'var(--deep-mind)',
        fontFamily: 'Cabinet Grotesk, sans-serif', position: 'relative'
      }}>
        {tokens.map((token, i) => {
          const style = getTokenStyle(token)
          if (!style) return <span key={i}>{token}</span>
          return (
            <span
              key={i}
              style={{ ...style, position: 'relative' }}
              onClick={() => handleWordClick(token)}
            >
              {token}
              {tooltip && tooltipToken === token && (
                <span style={{
                  position: 'absolute', bottom: '120%', left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--deep-mind)', color: '#fff',
                  borderRadius: '10px', padding: '10px 14px',
                  fontSize: '13px', whiteSpace: 'nowrap',
                  zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  minWidth: '160px', textAlign: 'left'
                }}>
                  <strong style={{ fontFamily: 'Fraunces', fontSize: '15px', display: 'block', marginBottom: '3px', color: 'var(--purple-mid)' }}>
                    {tooltip.word}
                  </strong>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    {tooltip.pos} · #{tooltip.rank}
                  </span>
                  {tooltip.meanings.slice(0, 2).map((m, j) => (
                    <span key={j} style={{ display: 'block', color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>{m}</span>
                  ))}
                </span>
              )}
            </span>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '24px', padding: '14px 16px', borderRadius: '10px',
        background: 'var(--fog)', fontSize: '12px', color: 'var(--cortex)'
      }}>
        Tap any highlighted word to see its meaning. Only top-1500 frequency words are tracked.
      </div>
    </div>
  )
}
