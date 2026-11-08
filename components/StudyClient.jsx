'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { computeSRS } from '@/lib/srs'
import { loadState, saveState, todayIso } from '@/lib/localProgress'
import { trackEvent } from '@/lib/analytics'
import WorkbookCover from '@/components/WorkbookCover'

export const SAMPLE_SIZE = 10
const FORWARD_MS = 4000
const RATINGS = [
  { key: 'again', label: 'Again', value: 0, hotkey: '1' },
  { key: 'hard', label: 'Hard', value: 1, hotkey: '2' },
  { key: 'good', label: 'Good', value: 2, hotkey: '3' },
  { key: 'easy', label: 'Easy', value: 3, hotkey: '4' },
]
const POS = { 'v.': 'verb', 'n.m.': 'noun · masculine', 'n.f.': 'noun · feminine', 'n.': 'noun', 'adj.': 'adjective', 'adv.': 'adverb', 'pron.': 'pronoun', 'prep.': 'preposition', 'conj.': 'conjunction', 'det.': 'determiner', 'num.': 'number', 'intj.': 'interjection' }

let audioEl = null
function play(file, fallbackText) {
  if (typeof window === 'undefined') return
  if (audioEl) { audioEl.pause(); audioEl.currentTime = 0 }
  window.speechSynthesis?.cancel()
  if (file) {
    audioEl = new Audio(`/audio/${encodeURIComponent(file)}`)
    audioEl.play().catch(() => {})
  } else if (fallbackText && window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(fallbackText)
    u.lang = 'es-ES'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }
}
function stopAudio() {
  if (audioEl) { audioEl.pause(); audioEl.currentTime = 0 }
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
}

export default function StudyClient() {
  const router = useRouter()
  const [deck, setDeck] = useState(null)
  const [state, setState] = useState(null)
  const [queue, setQueue] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const sentenceTimer = useRef(null)

  useEffect(() => {
    const s = loadState()
    setState(s)
    fetch('/deck.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => { setDeck(d); setQueue(d.slice(s.sampleCount, SAMPLE_SIZE).map((w) => ({ ...w }))) })
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => { if (state) saveState(state) }, [state])
  useEffect(() => () => { clearTimeout(sentenceTimer.current); stopAudio() }, [])

  const done = state ? state.sampleCount >= SAMPLE_SIZE : false
  const card = done ? null : queue[0] ?? null
  const audioOn = state?.settings.audio ?? true

  useEffect(() => {
    if (!justFinished) return
    trackEvent('sample_completed')
    const t = setTimeout(() => router.push('/workbook?from=sample'), FORWARD_MS)
    return () => clearTimeout(t)
  }, [justFinished, router])

  const flip = useCallback(() => {
    if (!card || flipped) return
    setFlipped(true)
    if (state.sampleCount === 0) trackEvent('session_started')
    if (audioOn) {
      play(card.audio, card.word)
      clearTimeout(sentenceTimer.current)
      if (card.example_es) sentenceTimer.current = setTimeout(() => play(card.sentence_audio, card.example_es), 1400)
    }
  }, [card, flipped, audioOn, state])

  const answer = useCallback((ratingKey) => {
    if (!card || !flipped) return
    const rating = RATINGS.find((r) => r.key === ratingKey)
    clearTimeout(sentenceTimer.current)
    stopAudio()
    trackEvent('card_reviewed', { rating: ratingKey, word_rank: card.rank })
    setState((prev) => {
      const entry = prev.progress[card.rank]
      const next = computeSRS(entry?.i ?? 1, entry?.ef ?? 2.5, entry?.n ?? 0, rating.value)
      const day = todayIso()
      const sampleCount = prev.sampleCount + 1
      return {
        ...prev,
        sampleCount,
        progress: { ...prev.progress, [card.rank]: { s: ratingKey, i: next.interval, ef: next.ease_factor, n: next.repetitions, due: next.next_review } },
        activity: { ...prev.activity, [day]: (prev.activity[day] ?? 0) + 1 },
      }
    })
    if (state.sampleCount + 1 >= SAMPLE_SIZE) setJustFinished(true)
    setQueue(([current, ...rest]) => (ratingKey === 'again' || ratingKey === 'hard') && rest.length ? [...rest, current] : rest.length ? rest : [current])
    setFlipped(false)
  }, [card, flipped, state])

  useEffect(() => {
    function onKey(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (!flipped && card) { e.preventDefault(); flip() }
        return
      }
      const r = RATINGS.find((x) => x.hotkey === e.key)
      if (r && flipped) answer(r.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flip, answer, flipped, card])

  function toggleAudio() {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, audio: !audioOn } }))
    if (audioOn) stopAudio()
  }

  if (loadError) {
    return (
      <div className="card study-msg">
        <h1>Couldn't load the cards</h1>
        <p>Check your connection and reload the page.</p>
        <button className="btn btn-navy" onClick={() => location.reload()}>Reload</button>
      </div>
    )
  }

  if (!deck || !state) return <div className="study-grid" aria-busy="true" aria-label="Loading cards"><div className="card study-skel" /><div className="card study-skel side" /></div>

  const count = Math.min(state.sampleCount, SAMPLE_SIZE)

  return (
    <div className="study-grid">
      <section aria-label="Flashcards">
        <div className="study-top">
          <div>
            <h1 className="study-h1">Try 10 cards for free</h1>
            <p className="study-sub">The ten most common Spanish words, with native audio. Rate each one honestly.</p>
          </div>
          <button className={`study-tool${audioOn ? ' on' : ''}`} onClick={toggleAudio} aria-pressed={audioOn} aria-label={audioOn ? 'Mute audio' : 'Turn audio on'}>
            <SpeakerIcon muted={!audioOn} />
          </button>
        </div>

        <div className="study-steps" aria-label={`${count} of ${SAMPLE_SIZE} cards done`}>
          {Array.from({ length: SAMPLE_SIZE }, (_, i) => <i key={i} className={i < count ? 'on' : undefined} />)}
        </div>

        {done ? (
          <SampleDone forwarding={justFinished} />
        ) : card ? (
          <>
            <div className={`card study-card${flipped ? ' flipped' : ''}`} onClick={flip} role="button" tabIndex={0} aria-label={flipped ? 'Card answer' : 'Reveal answer'}>
              <div className="study-meta"><span className="mono">CARD {count + 1} OF {SAMPLE_SIZE}</span><span className="mono">#{card.rank} MOST COMMON</span></div>
              <div className="study-inner" key={`${card.rank}-${flipped}`}>
                <div className="study-word">{card.word}</div>
                {card.pos && <div className="study-pos">{POS[card.pos] || card.pos}</div>}
                {!flipped ? (
                  <div className="study-hint">Say the meaning out loud, then tap to check</div>
                ) : (
                  <>
                    <div className="study-answer">{card.meanings.slice(0, 2).join(' · ')}</div>
                    {card.example_es && (
                      <div className="study-example">
                        <p className="es">{card.example_es}</p>
                        {card.example_en && <p className="en">{card.example_en}</p>}
                      </div>
                    )}
                  </>
                )}
              </div>
              {flipped && audioOn && (
                <button className="study-replay" onClick={(e) => { e.stopPropagation(); play(card.audio, card.word) }} aria-label="Play pronunciation again">
                  <SpeakerIcon />
                </button>
              )}
            </div>

            {flipped ? (
              <div className="study-ratings">
                {RATINGS.map((r) => (
                  <button key={r.key} className={`study-rating ${r.key}`} onClick={() => answer(r.key)}>
                    {r.label}<span className="mono">{r.hotkey}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button className="btn btn-navy study-reveal" onClick={flip}>Show answer <span className="mono">SPACE</span></button>
            )}
          </>
        ) : null}
      </section>

      <aside className="study-side" aria-label="The workbook">
        <div className="card study-book">
          <WorkbookCover size="sm" />
          <div>
            <h2>All 1,500 words, on paper</h2>
            <p>The full list in 30 units, with exercises, mini-stories and review tests. Printable PDF.</p>
            <Link className="link" href="/workbook">Workbook · €5 <Arrow /></Link>
          </div>
        </div>
        <div className="card study-keys">
          <div><kbd>Space</kbd> show answer</div>
          <div><kbd>1</kbd>–<kbd>4</kbd> rate the card</div>
        </div>
      </aside>
    </div>
  )
}

function SampleDone({ forwarding }) {
  return (
    <div className="card study-done">
      <WorkbookCover />
      <div>
        <h2>That was the free sample</h2>
        <p>These ten words alone appear in a large share of everyday sentences. The workbook takes you through all 1,500, the words that cover about 80% of everyday Spanish, with a method that makes them stick.</p>
        <div className="cta-row">
          <Link className="btn btn-coral" href="/workbook?from=sample">Get the workbook · €5 <Arrow /></Link>
          <Link className="btn btn-ghost" href="/words/most-common-spanish-words">Browse the word list</Link>
        </div>
        {forwarding && <p className="study-forward" role="status">Taking you to the workbook in a moment…</p>}
      </div>
    </div>
  )
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function SpeakerIcon({ muted = false }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
    </svg>
  )
}
