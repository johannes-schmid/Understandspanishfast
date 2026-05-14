import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { articles } from '@/data/articles'
import WordToken from '@/components/WordToken'
import Link from 'next/link'

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) return {}
  return { title: `${article.title} | Neuro` }
}

function getWordStatus(rank, knownSet, learningSet) {
  if (rank === null) return 'null'
  if (knownSet.has(rank)) return 'known'
  if (learningSet.has(rank)) return 'learning'
  return 'unseen'
}

export default async function ArticlePage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  const { data: progress } = await supabase
    .from('user_word_progress')
    .select('word_rank, status')
    .eq('user_id', user.id)

  const allProgress = progress ?? []
  const knownSet = new Set(
    allProgress.filter(r => ['good', 'easy'].includes(r.status)).map(r => r.word_rank)
  )
  const learningSet = new Set(
    allProgress.filter(r => ['again', 'hard'].includes(r.status)).map(r => r.word_rank)
  )

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>

        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--cortex)', fontSize: '13px', textDecoration: 'none',
          marginBottom: '24px',
        }}>
          ← Back to dashboard
        </Link>

        <h1 style={{ fontFamily: 'Fraunces', fontSize: '32px', fontWeight: 700, color: 'var(--deep-mind)', marginBottom: '8px' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--cortex)', marginBottom: '32px' }}>
          {article.description}
        </p>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: '16px', flexWrap: 'wrap',
          marginBottom: '24px', padding: '12px 16px',
          background: 'var(--white-matter)', borderRadius: '10px',
          border: '1px solid var(--cream-dark)',
        }}>
          {[
            { color: '#4D8D74', bg: 'rgba(77,141,116,0.08)', label: 'Known' },
            { color: '#E8A838', bg: 'rgba(232,168,56,0.10)', label: 'Learning' },
            { color: 'var(--deep-mind)', bg: 'transparent', label: 'Unseen — tap to see meaning' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '13px',
                color: item.color,
                background: item.bg,
                borderBottom: `2px solid ${item.color}`,
                padding: '0 4px',
                borderRadius: '3px',
              }}>
                hola
              </span>
              <span style={{ fontSize: '12px', color: 'var(--cortex)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Article body */}
        <div style={{
          background: 'var(--white-matter)', borderRadius: '16px',
          padding: '28px 32px', border: '1px solid var(--cream-dark)',
          fontSize: '18px', lineHeight: '1.9', color: 'var(--deep-mind)',
          fontFamily: 'Cabinet Grotesk',
        }}>
          {article.content.map((token, i) => {
            if (token.type === 'space') return <span key={i}> </span>
            if (token.type === 'punct') return <span key={i}>{token.text}</span>
            if (token.type === 'newline') return <br key={i} />
            if (token.type === 'word') {
              const status = getWordStatus(token.rank, knownSet, learningSet)
              return (
                <WordToken
                  key={i}
                  es={token.es}
                  en={token.en}
                  status={status}
                />
              )
            }
            return null
          })}
        </div>

      </div>
    </main>
  )
}
