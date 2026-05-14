'use client'

import { useState, useEffect } from 'react'
import ArticleReader from '@/components/ArticleReader'
import { trackEvent } from '@/lib/analytics'

export default function ReadingClient({ articles, initialArticle, knownRanks, seenRanks }) {
  const [selected, setSelected] = useState(initialArticle)

  useEffect(() => { trackEvent('reading_started') }, [])

  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontFamily: 'Fraunces', fontSize: '24px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '12px' }}>
          Keep studying to unlock reading
        </p>
        <p style={{ color: 'var(--cortex)', fontSize: '15px', marginBottom: '28px' }}>
          Articles unlock as you learn more words. Come back after your next study session.
        </p>
        <a href="/study" style={{
          background: 'var(--synapse)', color: '#fff',
          borderRadius: '12px', padding: '14px 28px',
          fontWeight: 500, textDecoration: 'none', fontSize: '15px'
        }}>
          Study now →
        </a>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '28px',
      alignItems: 'start'
    }}>
      {/* Article list */}
      <div>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cortex)', marginBottom: '14px' }}>
          Articles
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {articles.map(a => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: '12px',
                border: `1px solid ${selected?.id === a.id ? 'var(--synapse)' : 'var(--cream-dark)'}`,
                background: selected?.id === a.id ? 'var(--fog)' : 'var(--white-matter)',
                cursor: 'pointer', display: 'block', width: '100%'
              }}
            >
              <p style={{ fontWeight: 600, color: 'var(--deep-mind)', fontSize: '14px', marginBottom: '3px' }}>
                {a.title}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--cortex)' }}>{a.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Article reader */}
      <div style={{ gridColumn: 'span 2' }}>
        {selected ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--cortex)', marginBottom: '6px' }}>
                {selected.topic}
              </p>
              <h1 style={{ fontFamily: 'Fraunces', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700, color: 'var(--deep-mind)' }}>
                {selected.title}
              </h1>
            </div>
            <ArticleReader
              article={selected}
              knownRanks={knownRanks}
              seenRanks={seenRanks}
            />
          </div>
        ) : (
          <p style={{ color: 'var(--cortex)', fontSize: '15px', paddingTop: '40px' }}>
            Select an article to start reading.
          </p>
        )}
      </div>
    </div>
  )
}
