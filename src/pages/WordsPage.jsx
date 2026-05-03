import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { WORDS, MILESTONES, MILESTONE_TEXT, TYPE_LABEL } from '../data/words'

const FREE_LIMIT = 200
const OTHER_TYPES = new Set(['prep','conj','art','pron','det','num'])

function getLearnedSet() {
  try { return new Set(JSON.parse(localStorage.getItem('usf_learned') || '[]')) }
  catch { return new Set() }
}

export default function WordsPage() {
  const [learned, setLearned] = useState(getLearnedSet)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hideTranslations, setHideTranslations] = useState(false)
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceCorrect, setPracticeCorrect] = useState(0)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const [lockEmail, setLockEmail] = useState('')
  const [lockSubmitted, setLockSubmitted] = useState(false)

  const practiceQueue = WORDS.filter(w => w.rank <= FREE_LIMIT)
  const currentCard = practiceQueue[practiceIndex]

  const filtered = WORDS.filter(w => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q)
    let matchFilter = true
    if (activeFilter === 'other') matchFilter = OTHER_TYPES.has(w.type)
    else if (activeFilter !== 'all') matchFilter = w.type === activeFilter
    return matchSearch && matchFilter
  })

  const showAll = activeFilter === 'all' && !searchQuery

  function toggleLearned(rank) {
    setLearned(prev => {
      const next = new Set(prev)
      if (next.has(rank)) next.delete(rank)
      else next.add(rank)
      localStorage.setItem('usf_learned', JSON.stringify([...next]))
      return next
    })
  }

  function startPractice() {
    setPracticeIndex(0)
    setPracticeCorrect(0)
    setCardRevealed(false)
    setShowLock(false)
    setPracticeOpen(true)
  }

  function revealCard() {
    if (!cardRevealed) setCardRevealed(true)
  }

  function rateCard(correct) {
    if (correct && currentCard) {
      setPracticeCorrect(c => c + 1)
      setLearned(prev => {
        const next = new Set(prev)
        next.add(currentCard.rank)
        localStorage.setItem('usf_learned', JSON.stringify([...next]))
        return next
      })
    }
    const next = practiceIndex + 1
    if (next >= practiceQueue.length) {
      setShowLock(true)
    } else {
      setPracticeIndex(next)
      setCardRevealed(false)
    }
  }

  function skipCard() {
    const next = practiceIndex + 1
    if (next >= practiceQueue.length) {
      setShowLock(true)
    } else {
      setPracticeIndex(next)
      setCardRevealed(false)
    }
  }

  function closePractice() {
    setPracticeOpen(false)
  }

  const handleKeyDown = useCallback((e) => {
    if (!practiceOpen) return
    if (e.key === 'Escape') { closePractice(); return }
    if (!cardRevealed) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); revealCard() }
      if (e.key === 'ArrowRight') skipCard()
    } else {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); rateCard(true) }
      if (e.key === 'ArrowLeft') rateCard(false)
    }
  }, [practiceOpen, cardRevealed, practiceIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    document.body.style.overflow = practiceOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [practiceOpen])

  const learnedPct = (learned.size / 1000) * 100
  const practicePct = practiceQueue.length > 0 ? (practiceIndex / practiceQueue.length) * 100 : 0

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-2 px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-base text-outline">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-default">Words</span>
          <span className="material-symbols-outlined text-base text-outline">chevron_right</span>
          <span className="text-on-surface font-medium">Most Common Spanish Words</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-10 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full mb-5">
          <span className="material-symbols-outlined text-primary text-sm">verified</span>
          <span className="text-label-sm font-semibold text-primary uppercase tracking-wider">Validated · Corpus-Ranked · Free to Practice</span>
        </div>
        <h1 className="text-[36px] md:text-[44px] font-extrabold leading-tight mb-4 text-on-surface tracking-tight">
          The 1,000 Most Common<br className="hidden md:block" /> Spanish Words
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
          These 1,000 words appear in <strong className="text-on-surface">~74% of everyday spoken Spanish</strong>. Ranked by real-world frequency. Browse the full list free — practice words 1–200 right here.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {[
            {icon:'format_list_numbered',text:'1,000 words — free to browse'},
            {icon:'play_circle',text:'Words 1–200 free to practice',color:'text-secondary'},
            {icon:'graphic_eq',text:'~74% spoken coverage'},
          ].map(({icon,text,color}) => (
            <div key={text} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
              <span className={`material-symbols-outlined ${color||'text-primary'} text-lg`}>{icon}</span>
              <span className="text-sm font-semibold text-on-surface">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage milestones */}
      <section className="px-6 pb-10 max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-on-surface mb-4 text-center">Comprehension unlocked as you learn</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {pct:'~47%',label:'Top 100 words',sub:'Core grammar + most common verbs',highlight:false},
            {pct:'~58%',label:'Top 300 words',sub:'You start following simple conversations',highlight:false},
            {pct:'~63%',label:'Top 500 words',sub:'Can understand slow, clear speech',highlight:false},
            {pct:'~74%',label:'Top 1,000 words ← here',sub:'3 in 4 words in real conversations',highlight:true},
          ].map(({pct,label,sub,highlight}) => (
            <div key={pct} className={`${highlight ? 'bg-secondary-container border-secondary/20 ring-2 ring-secondary/30' : 'bg-white border-slate-200'} border rounded-2xl p-4 shadow-sm text-center`}>
              <div className={`text-2xl font-extrabold mb-1 ${highlight ? 'text-secondary' : 'text-primary'}`}>{pct}</div>
              <div className="text-sm font-semibold text-on-surface mb-1">{label}</div>
              <div className="text-xs text-on-surface-variant">{sub}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-on-surface-variant mt-3">Coverage estimates based on corpus frequency data (spoken Spanish). Actual coverage varies by context.</p>
      </section>

      {/* Controls sticky */}
      <div className="sticky top-[80px] z-40 bg-[rgba(249,249,255,0.95)] backdrop-blur-[12px] border-b border-[#e2e8f8] px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 1,000 words…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
          </div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {['all','verb','noun','adj','adv','other'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`filter-chip px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 transition-all ${activeFilter === f ? 'active bg-primary text-white' : 'bg-white text-on-surface-variant'}`}
              >
                {f === 'all' ? 'All' : f === 'adj' ? 'Adjectives' : f === 'adv' ? 'Adverbs' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </button>
            ))}
          </div>
          {/* Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHideTranslations(h => !h)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-white text-on-surface-variant transition-all hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-sm">{hideTranslations ? 'visibility' : 'visibility_off'}</span>
              {hideTranslations ? 'Show translations' : 'Hide translations'}
            </button>
            <span className="text-xs text-on-surface-variant whitespace-nowrap">
              {filtered.length === 1000 ? '1,000 words' : `${filtered.length} word${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          {/* Practice button */}
          <button
            onClick={startPractice}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-primary-container text-white shadow-md shadow-primary/20 hover:bg-primary transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-base">play_circle</span>
            Practice Mode
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1–200 free</span>
          </button>
        </div>
      </div>

      {/* Learned progress */}
      <div className="px-6 py-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all duration-300" style={{width:`${learnedPct}%`}} />
          </div>
          <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
            {learned.size} / 1,000 learned
          </span>
        </div>
      </div>

      {/* Word table */}
      <section className="px-4 md:px-6 pb-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2 block">search_off</span>
              No words match your search.
            </div>
          ) : (
            <table className={`w-full text-sm ${hideTranslations ? 'hide-trans' : ''}`}>
              <thead className="bg-surface-container-low border-b border-slate-100">
                <tr>
                  <th className="text-left py-3 pl-4 pr-2 text-xs font-semibold text-on-surface-variant w-12">#</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-on-surface-variant">Spanish</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-on-surface-variant">English</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-on-surface-variant hidden sm:table-cell">Type</th>
                  <th className="text-center py-3 px-2 pr-4 text-xs font-semibold text-on-surface-variant w-16">Done</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => {
                  const isLearned = learned.has(w.rank)
                  const showMilestone = showAll && [100,300,500,750,1000].includes(w.rank)
                  return [
                    <tr
                      key={w.rank}
                      className={`word-row border-b border-slate-50 ${isLearned ? 'row-learned' : ''}`}
                    >
                      <td className="py-3 pl-4 pr-2 text-xs font-mono text-on-surface-variant tabular-nums">{w.rank}</td>
                      <td className="py-3 px-2 font-bold text-on-surface text-base cell-word">{w.word}</td>
                      <td className="py-3 px-2 text-on-surface-variant text-sm cell-translation">{w.translation}</td>
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold badge-${w.type}`}>
                          {TYPE_LABEL[w.type] || w.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 pr-4 text-center">
                        <button
                          onClick={() => toggleLearned(w.rank)}
                          aria-label="Mark as learned"
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-all ${isLearned ? 'bg-secondary text-white' : 'border-2 border-slate-200 text-transparent hover:border-secondary hover:text-secondary'}`}
                        >
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{fontVariationSettings:`'FILL' ${isLearned?1:0},'wght' 400,'GRAD' 0,'opsz' 20`}}
                          >check_circle</span>
                        </button>
                      </td>
                    </tr>,
                    showMilestone && (
                      <tr key={`m${w.rank}`} className="milestone-row">
                        <td colSpan={5} className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-on-secondary-container">
                            <span className="material-symbols-outlined text-secondary text-lg">emoji_events</span>
                            {MILESTONE_TEXT[w.rank]}
                            <span className="font-extrabold text-secondary">{MILESTONES[w.rank]}</span>
                          </span>
                        </td>
                      </tr>
                    ),
                  ]
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Frequently asked questions</h2>
        <div className="space-y-3">
          {[
            {q:'How many Spanish words do I need to understand everyday conversations?',a:'Research shows that the 1,000 most common words give you roughly 74% coverage of everyday spoken Spanish. To reach 80%, you need around 2,000 words. For near-native comprehension, 5,000–8,000 words is the long-term target. The critical insight: learning by frequency gives you the fastest path.'},
            {q:'What percentage of Spanish can I understand with 1,000 words?',a:'With the 1,000 most common Spanish words, you can understand approximately 74% of everyday spoken Spanish. That means roughly 3 out of every 4 words in a typical conversation will be familiar to you. Coverage is higher in informal speech and lower in technical writing.'},
            {q:'Are these words ranked by frequency?',a:'Yes. This list is ordered by corpus frequency — how often each word actually appears in real spoken and written Spanish. The ordering draws on frequency research including Mark Davies\' analysis of hundreds of millions of words of Spanish text. Word #1 (de) appears dramatically more often than word #1,000.'},
            {q:'What is the fastest way to learn these words?',a:'The most efficient method is spaced repetition — reviewing words just before you\'re about to forget them. Combined with learning in frequency order (highest impact words first), you can reach functional comprehension faster than any other approach.'},
          ].map(({q,a}) => (
            <details key={q} className="bg-white border border-slate-100 rounded-2xl shadow-sm group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-on-surface list-none">
                {q}
                <span className="material-symbols-outlined text-outline transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-5 pb-4 text-body-sm text-on-surface-variant leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Explore more */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-on-surface mb-4">Explore more word lists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {icon:'trending_up',label:'Most Frequent Spanish Words',sub:'Variant frequency ranking',to:'/words/most-frequent-spanish-words'},
            {icon:'filter_list',label:'Top 500 Spanish Words',sub:'Starter milestone list',to:'/words/top-500-spanish-words'},
            {icon:'bolt',label:'Most Common Spanish Verbs',sub:'Action words first',to:'/words/most-common-spanish-verbs'},
            {icon:'school',label:'How It Works',sub:'The learning method',to:'/how-it-works'},
          ].map(({icon,label,sub,to}) => (
            <Link
              key={label}
              to={to}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all no-underline group"
            >
              <span className="material-symbols-outlined text-primary text-xl mb-2 block">{icon}</span>
              <div className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">{label}</div>
              <div className="text-xs text-on-surface-variant mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-20 max-w-2xl mx-auto text-center">
        <div className="bg-surface-container rounded-2xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-on-surface mb-3">Ready to learn these words in order?</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            UnderstandSpanishFast teaches you the most common Spanish words in frequency order — with smart review so you always know what to learn next. No setup. No decks.
          </p>
          <a
            href="/#waitlist"
            className="inline-block bg-primary-container text-white px-8 py-3.5 rounded-full font-semibold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all no-underline"
          >
            Get Early Access — Free
          </a>
          <p className="text-xs text-outline mt-3">Frequency-ordered · No setup · No flashcard decks</p>
        </div>
      </section>

      <Footer />

      {/* Practice Modal */}
      {practiceOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/97 backdrop-blur-sm flex flex-col items-center justify-center p-6">

          {/* Upgrade wall */}
          {showLock && (
            <div className="text-center max-w-md w-full">
              <div className="w-20 h-20 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-amber-400 text-4xl">lock</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">You've completed the free 200 words!</h2>
              <p className="text-slate-400 mb-2">That's <strong className="text-white">~47% comprehension</strong> of everyday spoken Spanish — great start.</p>
              <p className="text-slate-400 mb-8">Get early access to practice all 1,000 words with smart review and full comprehension tracking.</p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                {lockSubmitted ? (
                  <p className="text-white font-semibold py-2">✓ You're on the list!</p>
                ) : (
                  <>
                    <input
                      type="email"
                      value={lockEmail}
                      onChange={e => setLockEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="px-5 py-3.5 rounded-full text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-primary/30 text-base"
                    />
                    <button
                      onClick={() => lockEmail && setLockSubmitted(true)}
                      className="bg-primary-container text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-primary transition-colors active:scale-95"
                    >
                      Get Full Access — Free
                    </button>
                  </>
                )}
                <button
                  onClick={closePractice}
                  className="text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors"
                >
                  ← Back to word list
                </button>
              </div>
            </div>
          )}

          {/* Flashcard */}
          {!showLock && currentCard && (
            <div className="w-full max-w-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={closePractice}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Exit
                </button>
                <div className="text-center">
                  <div className="text-slate-300 text-sm font-semibold mb-1.5">
                    {practiceIndex + 1} / {practiceQueue.length} · words 1–200 free
                  </div>
                  <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full transition-all duration-300" style={{width:`${practicePct}%`}} />
                  </div>
                </div>
                <div className="text-right text-sm">
                  <span className="text-secondary font-bold text-lg">{practiceCorrect}</span>
                  <span className="text-slate-500 text-xs block">known</span>
                </div>
              </div>

              {/* Card */}
              <div
                onClick={revealCard}
                className="bg-white rounded-3xl p-10 text-center cursor-pointer mb-6 shadow-2xl min-h-[220px] flex flex-col items-center justify-center select-none transition-transform active:scale-[0.99]"
              >
                <div className="text-xs font-semibold text-outline mb-4 tracking-wider uppercase">
                  #{currentCard.rank} of 1,000
                </div>
                <div className="text-5xl font-extrabold text-on-surface mb-3 tracking-tight">
                  {currentCard.word}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold badge-${currentCard.type} mb-5`}>
                  {TYPE_LABEL[currentCard.type]}
                </span>
                {!cardRevealed ? (
                  <div className="text-on-surface-variant text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">touch_app</span>
                    Tap to reveal translation
                  </div>
                ) : (
                  <div className="text-xl text-on-surface-variant font-medium leading-relaxed">
                    {currentCard.translation}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {!cardRevealed ? (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={skipCard}
                    className="flex-1 max-w-[140px] py-3.5 rounded-2xl border-2 border-slate-600 text-slate-300 font-semibold hover:border-slate-400 transition-all text-sm"
                  >
                    Skip
                  </button>
                  <button
                    onClick={revealCard}
                    className="flex-1 max-w-[200px] py-3.5 rounded-2xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all text-sm"
                  >
                    Show answer
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => rateCard(false)}
                    className="flex-1 max-w-[180px] py-3.5 rounded-2xl border-2 border-slate-600 text-slate-300 font-semibold hover:border-red-500 hover:text-red-400 transition-all text-sm"
                  >
                    <span className="material-symbols-outlined text-sm align-middle">close</span>
                    {' '}Didn't know it
                  </button>
                  <button
                    onClick={() => rateCard(true)}
                    className="flex-1 max-w-[180px] py-3.5 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all text-sm"
                  >
                    <span className="material-symbols-outlined text-sm align-middle">check</span>
                    {' '}Got it!
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
