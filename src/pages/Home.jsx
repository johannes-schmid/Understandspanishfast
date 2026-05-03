import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleWaitlist(e) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full mb-6">
          <span className="material-symbols-outlined text-primary text-sm">verified</span>
          <span className="text-label-sm font-semibold text-primary uppercase tracking-wider">Validated · Corpus-Ranked · Free to Start</span>
        </div>

        <h1 className="font-extrabold text-[40px] md:text-[48px] leading-tight mb-6 text-on-surface tracking-tight">
          The most common Spanish words — validated, ranked, and free to practice.
        </h1>

        <p className="text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          1,000 words ranked by real-world frequency. Browse the full list free.
          Practice the first 200 — right here, no signup. Unlock the full trainer with early access.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link
            to="/words/most-common-spanish-words"
            className="bg-primary-container text-white px-8 py-4 rounded-full font-semibold text-headline-md shadow-lg shadow-primary/20 active:scale-95 transition-all text-center no-underline whitespace-nowrap"
          >
            Start Practicing — Free
          </Link>
          <a
            href="#waitlist"
            className="bg-white text-primary border border-primary/30 px-8 py-4 rounded-full font-semibold text-headline-md active:scale-95 transition-all text-center no-underline whitespace-nowrap hover:bg-surface-container-low"
          >
            Unlock all 1,000 words →
          </a>
        </div>
        <p className="text-label-sm text-outline flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-base">verified_user</span>
          First 200 words free — no account needed.
        </p>

        {/* App UI preview */}
        <div className="mt-16 relative">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-base">bar_chart</span>
                </div>
                <span className="font-semibold text-headline-md text-on-surface">Your Progress</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-semibold">
                1,240 / 1,500
              </span>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-body-sm text-on-surface-variant">Comprehension of spoken Spanish</span>
                <span className="text-body-sm font-bold text-primary">82.6%</span>
              </div>
              <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{width:'82.6%'}}></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[{w:'estar',t:'to be (state)',r:'#2'},{w:'hacer',t:'to do / make',r:'#4'},{w:'poder',t:'to be able to',r:'#7'}].map(({w,t,r}) => (
                <div key={w} className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-body-md text-on-surface">{w}</p>
                    <p className="text-[11px] text-on-surface-variant">{t}</p>
                  </div>
                  <span className="text-secondary text-label-sm font-bold">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 -right-2 bg-secondary-container text-on-secondary-container p-4 rounded-2xl shadow-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">trending_up</span>
            <div className="text-left">
              <p className="font-semibold text-label-md">80% Coverage</p>
              <p className="text-[10px] uppercase font-bold opacity-70">with 1,500 words</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-section-gap px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg font-bold mb-4">Why learning Spanish feels slow</h2>
            <p className="text-body-md text-on-surface-variant">
              Traditional apps treat every word like it's equally important. It's not.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {icon:'rule',title:'Unvalidated Word Lists',text:"Most \"common Spanish words\" lists online are copied from each other, padded with rare words, or sorted by theme instead of frequency. You deserve better."},
              {icon:'grid_view',title:'Random Vocabulary',text:'Spending hours on "The apple is red" while still struggling to order coffee or follow a basic conversation.'},
              {icon:'psychology_alt',title:'No Clear Progress',text:'Studying for months but not knowing how much of real Spanish you can actually understand — because nothing measures it.'},
              {icon:'sentiment_dissatisfied',title:'Too Much Setup',text:'Importing decks, configuring settings, syncing apps — before you\'ve learned a single useful word. Most people quit before they start.'},
            ].map(({icon,title,text}) => (
              <div key={title} className="bg-white p-8 rounded-lg shadow-sm border border-slate-50">
                <span className="material-symbols-outlined text-error mb-4 text-4xl">{icon}</span>
                <h3 className="text-headline-md font-semibold mb-2">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-section-gap px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-headline-xl font-bold mb-6">
              One validated list. A built-in practice tool. No setup required.
            </h2>
            <div className="space-y-6">
              {[
                {icon:'verified',title:'Validated Frequency Data',text:"Every word is ranked by corpus frequency — drawn from hundreds of millions of words of real spoken and written Spanish, not guesswork."},
                {icon:'play_circle',title:'Practice on the Page — Free',text:'The first 200 words come with a built-in flashcard trainer. No app. No account. Open the page and start learning in seconds.'},
                {icon:'target',title:'Comprehension Coverage, Not XP',text:"Progress is shown as % of real Spanish you can understand—so you always know where you stand, not just how many points you've earned."},
              ].map(({icon,title,text}) => (
                <div key={title} className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-full h-fit shrink-0">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                  </div>
                  <div>
                    <h4 className="text-headline-md font-semibold mb-1">{title}</h4>
                    <p className="text-body-md text-on-surface-variant">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/words/most-common-spanish-words" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-body-md">
                Browse the full 1,000-word validated list →
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-slate-100 rotate-1">
              <div className="flex justify-between items-center mb-6">
                <span className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider">Current Progress</span>
                <span className="text-primary font-bold text-headline-md">1,240 / 1,500</span>
              </div>
              <div className="w-full bg-surface-container-high h-4 rounded-full mb-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{width:'82.6%'}}></div>
              </div>
              <div className="flex justify-between mb-8">
                <span className="text-[11px] text-on-surface-variant">0</span>
                <span className="text-[11px] font-bold text-secondary">~80% comprehension</span>
                <span className="text-[11px] text-on-surface-variant">1,500</span>
              </div>
              <div className="space-y-3">
                {[
                  {w:'hacer',t:'— to do / make',s:'Mastered',c:'text-secondary'},
                  {w:'siguiente',t:'— next',s:'Reviewing',c:'text-primary'},
                  {w:'entonces',t:'— then / so',s:'Up Next',c:'text-outline'},
                ].map(({w,t,s,c}) => (
                  <div key={w} className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-body-md">{w}</span>
                      <span className="text-on-surface-variant text-body-sm ml-2">{t}</span>
                    </div>
                    <span className={`${c} font-bold text-label-md`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-section-gap px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-headline-xl font-bold mb-4">The Roadmap to 80%</h2>
          <p className="text-body-lg text-slate-400 mb-12">
            Every word you learn moves you measurably closer to real comprehension.
          </p>
          <div className="relative space-y-12 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-1 before:bg-slate-800 md:before:left-1/2">
            {[
              {words:'500',label:'Basic Needs — ~50% Coverage',desc:'Understand greetings, everyday requests, and basic descriptions. Get by in most common situations.',flip:true,color:'bg-primary',ring:false},
              {words:'1000',label:'Simple Content — ~70% Coverage',desc:'Follow YouTube videos, read news headlines, hold basic conversations. Real content starts to open up.',flip:false,color:'bg-primary',ring:false},
              {words:'1500',label:'Real Comprehension — ~80% Coverage',desc:'Most Netflix shows, podcasts, and everyday conversations become clear. This is the target.',flip:true,color:'bg-secondary',ring:true},
            ].map(({words,label,desc,flip,color,ring}) => (
              <div key={words} className={`relative flex items-center gap-6 ${flip ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center z-10 shrink-0 md:mx-auto`}>
                  <span className="font-bold text-xl">{words}</span>
                </div>
                <div className={`bg-slate-800 p-6 rounded-lg flex-1 text-left ${ring ? 'ring-2 ring-secondary/50' : ''}`}>
                  <h3 className={`text-headline-md font-semibold mb-2 ${ring ? 'text-secondary' : 'text-primary'}`}>{label}</h3>
                  <p className="text-body-sm text-slate-300">{desc}</p>
                  {ring && <p className="text-secondary text-label-sm font-bold mt-3 uppercase tracking-wider">← The goal</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-section-gap px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-headline-xl font-bold mb-4">How It Works</h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              Open the page. Start practicing. No account, no setup, no app.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {icon:'format_list_numbered',title:'1. Browse the validated list',text:'All 1,000 words are free to browse — ranked by corpus frequency, with translations, word type, and comprehension coverage per milestone.'},
              {icon:'play_circle',title:'2. Practice the first 200 free',text:'Hit "Practice Mode" to run through words 1–200 with a flashcard trainer. Mark what you know, skip what you don\'t. No account needed.'},
              {icon:'lock_open',title:'3. Unlock the full 1,000-word trainer',text:'Get early access to practice all 1,000 words with smart review scheduling — and see exactly how much real Spanish you can understand.'},
            ].map(({icon,title,text}) => (
              <div key={title} className="text-center">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">{icon}</span>
                </div>
                <h3 className="text-headline-md font-semibold mb-3">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/words/most-common-spanish-words"
              className="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-4 rounded-full font-semibold hover:bg-primary transition-colors no-underline shadow-lg shadow-primary/20"
            >
              Start practicing — words 1–200 free
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-section-gap px-6 bg-surface-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-headline-xl font-bold mb-4">A different kind of tool</h2>
            <p className="text-body-md text-on-surface-variant">
              Not another app that gamifies your learning instead of actually teaching you.
            </p>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200">
            <div className="grid grid-cols-2 text-center py-6 bg-slate-50 border-b border-slate-200">
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] px-4">Typical Apps (Duolingo, Babbel…)</p>
              <p className="font-bold text-primary uppercase tracking-widest text-[10px] px-4">UnderstandSpanishFast</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ['Random word lists, themed by topic','Frequency-ranked — most useful words first'],
                ['Endless levels with no clear endpoint','Clear target: 1,500 words → 80% comprehension'],
                ['Progress measured in XP and streaks','Progress = % of real Spanish you can understand'],
                ['Robot voices and textbook sentences','Real example sentences from everyday Spanish'],
                ['"You\'re on a streak!"','"You can now understand ~70% of everyday Spanish"'],
              ].map(([bad,good],i) => (
                <div key={i} className={`grid grid-cols-2 py-4 ${i%2===1?'bg-slate-50/50':''}`}>
                  <div className="px-6 text-center text-body-sm text-on-surface-variant">{bad}</div>
                  <div className="px-6 text-center font-bold text-primary text-body-sm">{good}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Motivation */}
      <section className="py-section-gap px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                {icon:'movie',label:'Netflix Shows',sub:'Ready at 1,200 words',mt:'',gradient:'from-slate-700 to-slate-900'},
                {icon:'newspaper',label:'Spanish News',sub:'Ready at 800 words',mt:'mt-8',gradient:'from-primary to-primary-container'},
                {icon:'headphones',label:'Podcasts',sub:'Ready at 1,000 words',mt:'',gradient:'from-secondary to-teal-800'},
                {icon:'menu_book',label:'Books & Novels',sub:'Ready at 1,500 words',mt:'mt-8',gradient:'from-amber-600 to-amber-800'},
              ].map(({icon,label,sub,mt,gradient}) => (
                <div key={label} className={`bg-surface-container-low p-5 rounded-xl ${mt}`}>
                  <div className={`h-24 bg-gradient-to-br ${gradient} rounded-lg mb-3 flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white text-4xl">{icon}</span>
                  </div>
                  <p className="text-label-sm font-semibold text-on-surface">{label}</p>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-wide mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-headline-xl font-bold mb-6">Know exactly when you're ready</h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              Stop guessing. We map your current vocabulary against popular Spanish content so you
              know exactly when you can start enjoying real Spanish—without subtitles.
            </p>
            <div className="space-y-4 mb-8">
              {[
                'Track comprehension coverage, not just word counts',
                'See which shows and content you\'re ready for today',
                'Clear milestones: 50%, 70%, 80% comprehension',
              ].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span className="text-body-md text-on-surface">{t}</span>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-4 bg-surface-container-high px-6 py-4 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl">group</span>
              <div>
                <p className="text-headline-md font-semibold">Join 5,000+ learners</p>
                <p className="text-body-sm text-on-surface-variant">currently on the waitlist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-section-gap px-6 text-center">
        <div className="max-w-3xl mx-auto bg-primary-container text-white p-12 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full mb-6">
              <span className="material-symbols-outlined text-sm">lock_open</span>
              <span className="text-label-sm font-semibold uppercase tracking-wider">Full 1,000-Word Trainer</span>
            </div>
            <h2 className="text-headline-xl font-bold mb-4 text-white">
              Practice beyond word 200 — unlock the full trainer.
            </h2>
            <p className="text-body-lg opacity-90 mb-4">
              The first 200 words are free. For the full 1,000-word practice tool — with smart review,
              comprehension tracking, and milestone unlocks — get early access.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-sm">
              {['All 1,000 words in the trainer','Comprehension % tracking','Smart review scheduling'].map(f => (
                <div key={f} className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-base">check</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {submitted ? (
              <p className="text-white font-semibold text-headline-md py-4">✓ You're on the list!</p>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-6 py-4 rounded-full text-slate-900 w-full sm:max-w-xs focus:ring-4 focus:ring-white/20 border-none focus:outline-none text-body-md"
                />
                <button
                  type="submit"
                  className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-headline-md active:scale-95 transition-all whitespace-nowrap"
                >
                  Get Full Access
                </button>
              </form>
            )}
            <p className="mt-4 text-white/60 text-label-sm">No spam. Cancel any time. Free words always stay free.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
