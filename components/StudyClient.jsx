'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { computeSRS } from '@/lib/srs'
import { coveragePct, MILESTONES, FREE_WORDS, TOTAL_WORDS } from '@/lib/coverage'
import { loadState, saveState, todayIso, streakFrom, isKnown } from '@/lib/localProgress'
import { trackEvent } from '@/lib/analytics'

const NEW_PER_SESSION = 10
const RATINGS = [
  { key: 'again', label: 'Again', value: 0, hotkey: '1' },
  { key: 'hard', label: 'Hard', value: 1, hotkey: '2' },
  { key: 'good', label: 'Good', value: 2, hotkey: '3' },
  { key: 'easy', label: 'Easy', value: 3, hotkey: '4' },
]

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

function formatInterval(rating, entry) {
  if (rating === 0) return '10 min'
  const { interval } = computeSRS(entry?.i ?? 1, entry?.ef ?? 2.5, entry?.n ?? 0, rating)
  if (interval < 7) return `${interval} day${interval === 1 ? '' : 's'}`
  if (interval < 30) return `${Math.round(interval / 7)} wk`
  return `${Math.round(interval / 30)} mo`
}

function buildQueue(deck, state, extraNew = 0) {
  const now = Date.now()
  const due = deck
    .filter((w) => state.progress[w.rank] && new Date(state.progress[w.rank].due).getTime() <= now)
    .sort((a, b) => new Date(state.progress[a.rank].due) - new Date(state.progress[b.rank].due))
    .map((w) => ({ ...w, isNew: false }))
  const fresh = deck
    .filter((w) => !state.progress[w.rank])
    .slice(0, NEW_PER_SESSION + extraNew)
    .map((w) => ({ ...w, isNew: true }))
  return [...due, ...fresh]
}

export default function StudyClient() {
  const [deck, setDeck] = useState(null)
  const [state, setState] = useState(null)
  const [queue, setQueue] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [loadError, setLoadError] = useState(false)
  const sentenceTimer = useRef(null)

  useEffect(() => {
    const s = loadState()
    setState(s)
    fetch('/deck.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => { setDeck(d); setQueue(buildQueue(d, s)) })
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => { if (state) saveState(state) }, [state])
  useEffect(() => () => { clearTimeout(sentenceTimer.current); stopAudio() }, [])

  const card = queue[0] ?? null
  const locked = !!card && !state?.unlocked && card.rank > FREE_WORDS
  const front = state?.settings.front ?? 'spanish'
  const audioOn = state?.settings.audio ?? true

  const knownCount = useMemo(
    () => (state ? Object.values(state.progress).filter(isKnown).length : 0),
    [state]
  )
  const streak = state ? streakFrom(state.activity) : 0
  const todayCount = state?.activity[todayIso()] ?? 0

  const flip = useCallback(() => {
    if (!card || flipped || locked) return
    setFlipped(true)
    if (reviewed === 0) trackEvent('session_started')
    if (audioOn) {
      play(card.audio, card.word)
      clearTimeout(sentenceTimer.current)
      if (card.example_es) sentenceTimer.current = setTimeout(() => play(card.sentence_audio, card.example_es), 1400)
    }
  }, [card, flipped, locked, audioOn, reviewed])

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
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [card.rank]: { s: ratingKey, i: next.interval, ef: next.ease_factor, n: next.repetitions, due: next.next_review },
        },
        activity: { ...prev.activity, [day]: (prev.activity[day] ?? 0) + 1 },
      }
    })

    setQueue(([current, ...rest]) => {
      if (ratingKey === 'again') {
        const at = Math.min(3, rest.length)
        return [...rest.slice(0, at), { ...current, isNew: false }, ...rest.slice(at)]
      }
      if (ratingKey === 'hard') return [...rest, { ...current, isNew: false }]
      return rest
    })
    setReviewed((n) => n + 1)
    setFlipped(false)
  }, [card, flipped])

  useEffect(() => {
    function onKey(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (!flipped) { e.preventDefault(); flip() }
        return
      }
      const r = RATINGS.find((x) => x.hotkey === e.key)
      if (r && flipped) answer(r.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flip, answer, flipped])

  function setSetting(key, value) {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }))
    if (key === 'audio' && !value) stopAudio()
    if (key === 'front') setFlipped(false)
  }

  function unlock() {
    setState((prev) => ({ ...prev, unlocked: true }))
    trackEvent('deck_unlocked')
  }

  function continueSession() {
    setQueue(buildQueue(deck, state))
    setReviewed(0)
  }

  if (loadError) {
    return (
      <div className="study-empty">
        <h1 className="study-empty-title">Couldn't load the deck.</h1>
        <p>Check your connection and reload the page.</p>
        <button className="btn-primary" onClick={() => location.reload()}>Reload</button>
      </div>
    )
  }

  if (!deck || !state) return <StudySkeleton />

  const pct = coveragePct(knownCount)
  const next = MILESTONES.find((m) => m.words > knownCount)
  const prevWords = [...MILESTONES].reverse().find((m) => m.words <= knownCount)?.words ?? 0
  const toNext = next ? (knownCount - prevWords) / (next.words - prevWords) : 1
  const remainingNew = deck.filter((w) => !state.progress[w.rank]).length

  return (
    <div className="study-grid">
      <section aria-label="Flashcards">
        <div className="study-toolbar">
          <div className="study-count">
            <span className="tabular">{knownCount}</span> of {TOTAL_WORDS.toLocaleString()} words known
          </div>
          <div className="study-tools">
            <button
              className={`study-tool${audioOn ? ' is-on' : ''}`}
              onClick={() => setSetting('audio', !audioOn)}
              aria-pressed={audioOn}
              aria-label={audioOn ? 'Mute audio' : 'Turn audio on'}
            >
              <SpeakerIcon muted={!audioOn} />
            </button>
            <button
              className="study-tool study-tool--text"
              onClick={() => setSetting('front', front === 'spanish' ? 'english' : 'spanish')}
              aria-label="Switch card direction"
            >
              {front === 'spanish' ? 'ES → EN' : 'EN → ES'}
            </button>
          </div>
        </div>

        <div className="study-meter" aria-hidden="true">
          <div className="study-meter-fill" style={{ transform: `scaleX(${queue.length + reviewed > 0 ? reviewed / (queue.length + reviewed) : 1})` }} />
        </div>

        {!card ? (
          <SessionDone
            reviewed={reviewed}
            pct={pct}
            remainingNew={remainingNew}
            locked={!state.unlocked && knownCount >= FREE_WORDS}
            onContinue={continueSession}
          />
        ) : locked ? (
          <UnlockGate knownCount={knownCount} onUnlock={unlock} />
        ) : (
          <>
            <div
              className={`study-card${flipped ? ' is-flipped' : ''}`}
              onClick={flip}
              role="button"
              tabIndex={0}
              aria-label={flipped ? 'Card answer' : 'Reveal answer'}
            >
              <div className="study-card-glow" aria-hidden="true" />
              <div className="study-card-meta">
                <span>{card.isNew ? 'New word' : 'Review'}</span>
                <span className="tabular">#{card.rank}</span>
              </div>
              <div className="study-card-inner" key={`${card.rank}-${flipped}`}>
                {!flipped ? (
                  <>
                    <div className="study-word">{front === 'spanish' ? card.word : card.meanings[0]}</div>
                    {card.pos && front === 'spanish' && <div className="study-pos">{card.pos}</div>}
                    {reviewed === 0 && <div className="study-hint">Tap to reveal</div>}
                  </>
                ) : (
                  <>
                    {card.image && (
                      <img className="study-img" src={`/word-images/${encodeURIComponent(card.image)}`} alt="" width="112" height="112" />
                    )}
                    <div className="study-answer">{front === 'spanish' ? card.meanings.slice(0, 2).join(' · ') : card.word}</div>
                    {card.pos && <div className="study-pos">{card.pos}</div>}
                    {card.example_es && (
                      <div className="study-example">
                        <p className="study-example-es">{card.example_es}</p>
                        {card.example_en && <p className="study-example-en">{card.example_en}</p>}
                      </div>
                    )}
                  </>
                )}
              </div>
              {flipped && audioOn && (
                <button
                  className="study-replay"
                  onClick={(e) => { e.stopPropagation(); play(card.audio, card.word) }}
                  aria-label="Play pronunciation again"
                >
                  <SpeakerIcon />
                </button>
              )}
            </div>

            {flipped ? (
              <div className="study-ratings">
                {RATINGS.map((r) => (
                  <button key={r.key} className={`study-rating study-rating--${r.key}`} onClick={() => answer(r.key)}>
                    <span className="study-rating-label">{r.label}</span>
                    <span className="study-rating-when tabular">{formatInterval(r.value, state.progress[card.rank])}</span>
                  </button>
                ))}
              </div>
            ) : (
              <button className="study-reveal" onClick={flip}>Show answer</button>
            )}

            <p className="study-footnote">
              {card.isNew ? 'New' : 'Review'} · <span className="tabular">{queue.length}</span> left this session
              {!state.unlocked && card.rank <= FREE_WORDS && (
                <> · <span className="tabular">{Math.max(FREE_WORDS - knownCount, 0)}</span> free words to go</>
              )}
            </p>
          </>
        )}
      </section>

      <aside className="study-side" aria-label="Your progress">
        <div className="study-panel">
          <div className="study-panel-label">You understand about</div>
          <div className="study-big tabular">{pct}%</div>
          <div className="study-panel-sub">of everyday spoken Spanish</div>
          {next && (
            <>
              <div className="study-bar"><div style={{ transform: `scaleX(${Math.max(toNext, 0.02)})` }} /></div>
              <div className="study-panel-sub">
                <span className="tabular">{next.words - knownCount}</span> words to {next.pct}% · {next.label.toLowerCase()}
              </div>
            </>
          )}
        </div>
        <div className="study-panel study-panel--row">
          <div>
            <div className="study-panel-label">Streak</div>
            <div className="study-mid tabular">{streak} day{streak === 1 ? '' : 's'}</div>
          </div>
          <div>
            <div className="study-panel-label">Today</div>
            <div className="study-mid tabular">{todayCount} cards</div>
          </div>
        </div>
        <div className="study-panel study-keys">
          <div><kbd>Space</kbd> reveal</div>
          <div><kbd>1</kbd>–<kbd>4</kbd> rate</div>
          <p>Progress is saved in this browser. No account needed.</p>
        </div>
      </aside>
    </div>
  )
}

function UnlockGate({ knownCount, onUnlock }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'deck-unlock' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Try again.')
        setStatus('idle')
        return
      }
      onUnlock()
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
      setStatus('idle')
    }
  }

  return (
    <div className="study-gate">
      <div className="study-card-glow" aria-hidden="true" />
      <div className="study-gate-inner">
        <h2 className="study-gate-title">You've cleared the first {FREE_WORDS}.</h2>
        <p className="study-gate-body">
          {knownCount >= FREE_WORDS ? 'That' : 'The first 100 words'} covers about half of everyday Spanish. The next 1,400 take you to roughly 80%: enough to follow TV dialogue. They're free. Enter your email to unlock them.
        </p>
        <form className="study-gate-form" onSubmit={submit} noValidate>
          <label htmlFor="unlock-email" className="sr-only">Email address</label>
          <input
            id="unlock-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'unlock-error' : undefined}
          />
          <button type="submit" className="btn-gold" disabled={status === 'loading'}>
            {status === 'loading' ? 'Unlocking…' : 'Unlock 1,400 words'}
          </button>
        </form>
        {error && <p id="unlock-error" className="study-gate-error" role="alert">{error}</p>}
        <p className="study-gate-fine">One email with your deck link. No spam, unsubscribe in one click.</p>
      </div>
    </div>
  )
}

function SessionDone({ reviewed, pct, remainingNew, locked, onContinue }) {
  return (
    <div className="study-done">
      <h2 className="study-done-title">{reviewed > 0 ? 'Session done.' : 'Nothing due right now.'}</h2>
      <p>
        {reviewed > 0 && <><span className="tabular">{reviewed}</span> cards reviewed. </>}
        You now understand about <strong className="tabular">{pct}%</strong> of everyday Spanish.
      </p>
      <div className="study-done-actions">
        {remainingNew > 0 && (
          <button className="btn-primary" onClick={onContinue}>
            {locked ? 'Continue' : `Learn ${Math.min(NEW_PER_SESSION, remainingNew)} more words`}
          </button>
        )}
        <Link href="/words/most-common-spanish-words" className="study-link">Browse the full list</Link>
      </div>
    </div>
  )
}

function StudySkeleton() {
  return (
    <div className="study-grid" aria-busy="true" aria-label="Loading deck">
      <div>
        <div className="skel" style={{ height: 34, width: '60%', marginBottom: 14 }} />
        <div className="skel" style={{ height: 6, marginBottom: 18 }} />
        <div className="skel study-skel-card" />
      </div>
      <div className="study-side">
        <div className="skel" style={{ height: 180 }} />
        <div className="skel" style={{ height: 90 }} />
      </div>
    </div>
  )
}

function SpeakerIcon({ muted = false }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
    </svg>
  )
}
