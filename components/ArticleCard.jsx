'use client'

import Link from 'next/link'
import { useState } from 'react'

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function UnlockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

function ArticleImage({ slug }) {
  const [errored, setErrored] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '140px',
      borderRadius: '12px 12px 0 0',
      overflow: 'hidden',
      background: 'var(--fog)',
      flexShrink: 0,
    }}>
      {!errored && (
        <img
          src={`/article-images/${slug}.png`}
          alt=""
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </div>
  )
}

export default function ArticleCard({ article, knownCount }) {
  const wordTokens = article.content.filter(t => t.type === 'word')
  const uniqueRanks = new Set(wordTokens.filter(t => t.rank !== null).map(t => t.rank))
  const totalUnique = uniqueRanks.size

  const knownInArticle = [...uniqueRanks].filter(r => knownCount >= r).length
  const readiness = totalUnique > 0 ? Math.round((knownInArticle / totalUnique) * 100) : 0
  const isAccessible = readiness >= 30

  const saturation = Math.max(15, readiness)
  const cardOpacity = isAccessible ? 1 : 0.55 + (readiness / 100) * 0.38

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        background: 'var(--white-matter)',
        borderRadius: '14px',
        border: `1px solid ${isAccessible ? 'var(--cream-dark)' : '#E0DCDC'}`,
        opacity: cardOpacity,
        filter: `saturate(${saturation}%)`,
        transition: 'opacity 0.3s, filter 0.3s',
        overflow: 'hidden',
      }}
    >
      <ArticleImage slug={article.slug} />

      <div style={{ padding: '14px 16px 16px' }}>
        {/* Readiness bar */}
        <div style={{ height: '3px', background: '#EEE', borderRadius: '2px', marginBottom: '12px' }}>
          <div style={{
            height: '100%',
            borderRadius: '2px',
            background: readiness >= 80 ? 'var(--signal)' : readiness >= 50 ? '#E8A838' : 'var(--synapse)',
            width: `${readiness}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
          <span style={{ color: isAccessible ? 'var(--signal)' : 'var(--cortex)' }}>
            {isAccessible ? <UnlockIcon /> : <LockIcon />}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: isAccessible ? 'var(--signal)' : 'var(--cortex)',
          }}>
            {readiness}% ready
          </span>
        </div>

        <p style={{ fontFamily: 'Fraunces', fontSize: '15px', fontWeight: 700, color: 'var(--deep-mind)', lineHeight: 1.3, marginBottom: '4px' }}>
          {article.title}
        </p>

        <p style={{ fontSize: '11px', color: 'var(--cortex)', lineHeight: 1.4, marginBottom: '10px' }}>
          {article.description}
        </p>

        <p style={{ fontSize: '11px', color: 'var(--cortex)' }}>
          {knownInArticle}/{totalUnique} words known
        </p>
      </div>
    </Link>
  )
}
