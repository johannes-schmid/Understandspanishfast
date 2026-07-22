'use client'

import Link from 'next/link'
import { useState } from 'react'

const FALLBACK_GRADIENTS = [
  'linear-gradient(150deg,#E7D4AD,#CBB489 55%,#8F7FAE)',
  'linear-gradient(150deg,#B7B0CF,#6F8A72 60%,#3F5A55)',
  'linear-gradient(150deg,#E6A35C,#C76B52 55%,#4A3F6B)',
]

function hashSlug(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

function ArticleImage({ slug }) {
  const [errored, setErrored] = useState(false)
  const gradient = FALLBACK_GRADIENTS[hashSlug(slug) % FALLBACK_GRADIENTS.length]

  return (
    <div style={{ width: '100%', height: '96px', background: gradient, flexShrink: 0 }}>
      {!errored && (
        <img
          src={`/article-images/${slug}.webp`}
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

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--white-matter)',
        borderRadius: '14px',
        border: '1px solid rgba(28,26,58,.07)',
        overflow: 'hidden',
        opacity: isAccessible ? 1 : 0.72,
        transition: 'opacity 0.3s, transform 0.2s, box-shadow 0.2s',
      }}
    >
      <ArticleImage slug={article.slug} />

      <div style={{ padding: '13px 15px 15px' }}>
        <div style={{
          fontSize: '9.5px', fontWeight: 600, letterSpacing: '.06em',
          color: isAccessible ? 'var(--signal)' : 'var(--sand)', marginBottom: '6px',
        }}>
          {readiness}% READY
        </div>

        <div style={{ height: '4px', background: 'var(--lilac)', borderRadius: '2px', marginBottom: '11px' }}>
          <div style={{
            width: `${readiness}%`, height: '100%', borderRadius: '2px',
            background: readiness >= 80 ? 'var(--signal)' : 'var(--gold)',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <div style={{
          fontFamily: 'var(--font-fraunces), serif', fontWeight: 700,
          fontSize: '15px', color: 'var(--deep-mind)', lineHeight: 1.3,
        }}>
          {article.title}
        </div>
        <div style={{ fontSize: '12px', color: '#8B8676', marginTop: '3px', lineHeight: 1.4 }}>
          {article.description}
        </div>
      </div>
    </Link>
  )
}
