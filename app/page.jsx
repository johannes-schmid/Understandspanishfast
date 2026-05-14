import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata = {
  title: 'Most Common Spanish Words — Master 1,500, Understand 80%',
  description: 'Learn the most common Spanish words ranked by real-world frequency. Master 1,500 high-frequency words and understand 80% of everyday Spanish — fast.',
  alternates: { canonical: 'https://mostcommonspanish.com/' },
  openGraph: { url: 'https://mostcommonspanish.com/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Most Common Spanish',
  url: 'https://mostcommonspanish.com/',
  description: 'Master the 1,500 most useful Spanish words and unlock 80% of everyday Spanish.',
}

export default function Landing() {
  return (
    <div className="bg-surface text-on-surface overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="pt-40 pb-32 bg-white soft-gradient-surface relative">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="z-10 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-8">
              <span className="material-symbols-rounded text-[18px]">monitoring</span>
              SMART PROGRESS TRACKING
            </span>
            <h1 className="text-5xl md:text-[64px] font-semibold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Master <span className="text-[#FF8C00]">1,500 Words</span>, Unlock 80% of Everyday Spanish
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop guessing your level. We track every word you learn and show you exactly what real-world content you've unlocked.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-6">
              <a href="#waitlist" className="soft-gradient-orange text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-orange-200 transition-all active:scale-95 no-underline">
                Get Early Access
              </a>
              <Link href="/level-test" className="bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-full font-semibold text-lg hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all no-underline">
                Test Your Level
              </Link>
            </div>
            <p className="text-sm text-slate-400 font-medium italic">Data-driven. No filler. Just flow.</p>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="headspace-card p-10 rounded-[2rem] border border-slate-100 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-semibold text-slate-900">Live Progress</span>
                <span className="text-[#FF8C00] font-bold px-4 py-1 bg-orange-50 rounded-full text-sm">Core (482/1500)</span>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-orange-600 text-3xl">chat_bubble</span>
                  </div>
                  <div className="grow">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Latest Mastery</p>
                    <p className="font-bold text-slate-900 text-lg">Entender (To Understand)</p>
                  </div>
                  <span className="text-orange-300 font-black text-2xl italic">#142</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border-4 border-orange-200 flex flex-col gap-4 shadow-inner">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-rounded text-blue-600 text-3xl">rocket_launch</span>
                    </div>
                    <div className="grow">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Next Milestone</p>
                      <p className="font-bold text-slate-900 text-lg">Intermediate Podcasts</p>
                    </div>
                    <span className="text-slate-400 font-bold text-sm">18 to go</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 w-[92%] h-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-4 bg-white px-6 py-4 rounded-full shadow-xl border border-orange-50 z-20 hidden md:block">
              <div className="flex items-center gap-3 text-green-600 font-bold">
                <span className="material-symbols-rounded">trending_up</span>
                <span>+12% Conversation Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-32 bg-surface" id="method">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-[40px] font-semibold text-slate-900 mb-6">Why traditional learning feels heavy</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Other apps teach you "weird, unvalidated words" just to fill levels. We've done the data-science for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'inventory_2', title: 'No Deck Buying', text: "Don't waste money on external word lists. Our 1,500 words are already curated and verified." },
              { icon: 'block', title: 'Useless Filler', text: 'Most apps prioritize "apple" and "dog". We prioritize "I think", "I need", and "because".' },
              { icon: 'analytics', title: 'Zero Validation', text: "Typical lessons aren't based on real speech data. Ours are ranked by billions of real subtitles." },
              { icon: 'timer_off', title: 'Wasted Effort', text: "Spend months learning things you'll never say. Focus on the 20% that does 80% of the work." },
            ].map((c) => (
              <div key={c.title} className="p-10 rounded-[2rem] bg-white border border-slate-100 headspace-card text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="material-symbols-rounded text-red-500 text-4xl">{c.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{c.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden" id="journey">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.1),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-semibold mb-6 tracking-tight">The Road to 1,500 Mastery</h2>
            <p className="text-slate-400 text-xl">Every word brings you closer to real-world freedom.</p>
          </div>
          <div className="space-y-12 relative">
            <JourneyStep icon="restaurant" title="100 Essential" sub="Basic survival & greetings" status="Unlocked" body="Order food at a restaurant, greet neighbors, and ask for directions without panic." chips={['Ordering Coffee', 'Market Haggling']} state="done" />
            <JourneyStep icon="forum" title="250 Fundamental" sub="Daily life & simple conversations" status="Unlocked" body="Hold basic 5-minute conversations about your day, your work, and your family." chips={['Daily Small Talk', 'Work Basics']} state="done" />
            <JourneyStep icon="podcasts" title="500 Core" sub="Follow simple media" status="Current Level" body='Understand the "vibe" of any podcast and read simple social media posts without a dictionary.' chips={['Slow News Podcasts', 'IG/TikTok Stories']} state="current" />
            <JourneyStep icon="movie" title="1000 Advanced" sub="Real content with subtitles" status="Locked" body="Understand 70% of Netflix Originals and read short children's novels (El Principito)." chips={['Netflix Originals', 'Graphic Novels']} state="locked" />
            <JourneyStep icon="celebration" title="1500 Mastery" sub="80% of Everyday Spanish" status="Ultimate Goal" body="The magic threshold. Fluent real-world understanding and the ability to express complex thoughts." chips={['Native Sitcoms', 'Live News']} state="locked" last />
          </div>
        </div>
      </section>

      {/* Bento */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl md:text-[48px] font-semibold text-slate-900 text-center mb-20 tracking-tight">The smarter way to track progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 soft-gradient-orange rounded-[2rem] p-12 text-white flex flex-col justify-between min-h-[450px] shadow-xl shadow-orange-100">
              <div>
                <h3 className="text-[40px] font-semibold mb-6 leading-tight">Word Reach™</h3>
                <p className="text-white/90 text-xl max-w-md leading-relaxed">Instead of points, we show you your "Conversation Reach". Watch your percentage grow from 5% to 80% as you master the list.</p>
              </div>
              <div className="flex gap-6 items-end mt-8">
                <div className="w-16 md:w-20 bg-white/20 h-24 rounded-t-full"></div>
                <div className="w-16 md:w-20 bg-white/40 h-40 rounded-t-full"></div>
                <div className="w-16 md:w-20 bg-white/60 h-56 rounded-t-full"></div>
                <div className="w-16 md:w-20 bg-white h-72 rounded-t-full shadow-lg flex items-start justify-center pt-4">
                  <span className="text-orange-600 font-bold">80%</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-12 text-white flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8">
                  <span className="material-symbols-rounded text-[#FF8C00] text-4xl">psychology</span>
                </div>
                <h3 className="text-3xl font-semibold mb-6">Smart Spacing</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Our tracker remembers what you forget. We re-introduce words right before they slip away.</p>
              </div>
            </div>
            <div className="bg-blue-100 rounded-[2rem] p-12 flex flex-col justify-between min-h-[350px] border border-blue-200">
              <div>
                <span className="material-symbols-rounded text-blue-600 text-5xl mb-8 block">visibility</span>
                <h3 className="text-3xl font-semibold text-slate-900 mb-6">Content Matching</h3>
                <p className="text-blue-800 text-lg leading-relaxed">The app suggests YouTube videos and articles where you already know 90%+ of the words.</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-12 flex flex-col md:flex-row gap-12 items-center headspace-card">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-semibold text-slate-900 mb-6">No More Vague Levels</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">"Intermediate" means nothing. "Knowing 1,200 words" means you can understand the Spanish news.</p>
                <div className="space-y-4 inline-block md:block">
                  <div className="flex items-center gap-4 px-6 py-3 bg-orange-50 rounded-full text-orange-800 font-bold">
                    <span className="material-symbols-rounded">query_stats</span>
                    Live Vocabulary Analytics
                  </div>
                  <div className="flex items-center gap-4 px-6 py-3 bg-blue-50 rounded-full text-blue-800 font-bold">
                    <span className="material-symbols-rounded">movie_filter</span>
                    65% Netflix Content Unlocked
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="p-6 bg-slate-50 rounded-2xl border-4 border-white shadow-xl rotate-1">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-4">Vocabulary Coverage</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Daily Conversations</span>
                      <span className="text-orange-600 font-bold">82%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div className="w-[82%] h-full bg-orange-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">News Podcasts</span>
                      <span className="text-blue-600 font-bold">54%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div className="w-[54%] h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-32 bg-orange-50/30">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-orange-100">
            <div className="p-10 border-b border-orange-50 bg-white">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">How we're different</h2>
            </div>
            <table className="w-full text-left">
              <thead className="hidden md:table-header-group">
                <tr className="bg-slate-50/50">
                  <th className="p-8 text-slate-400 font-medium uppercase tracking-widest text-xs">Feature</th>
                  <th className="p-8 text-[#FF8C00] font-bold text-lg">Most Common Spanish</th>
                  <th className="p-8 text-slate-400 font-medium text-lg">Other Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Word Quality', 'Ranked by billions of real subtitles', 'Textbook words like "pencil"'],
                  ['List Ownership', 'Complete curated 1,500 included', 'Buy separate decks/levels'],
                  ['Progress Goal', 'Specific "Word Mastery" count', 'Arbitrary XP and streaks'],
                  ['The End Game', 'Unlocking real Netflix/Books', 'Staying inside the app forever'],
                ].map(([feat, us, them]) => (
                  <tr key={feat} className="hover:bg-orange-50/20 transition-colors">
                    <td className="p-8">
                      <span className="block text-slate-900 font-bold mb-1">{feat}</span>
                    </td>
                    <td className="p-8 text-slate-600 font-medium">{us}</td>
                    <td className="p-8 text-slate-400">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-32 bg-surface-container-low" id="waitlist">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight text-slate-900">Join the Waitlist</h2>
          <p className="text-slate-600 text-lg mb-10">Be first to track your Word Reach. Early access pricing reserved for the waitlist.</p>
          <div className="flex justify-center mb-6">
            <WaitlistForm />
          </div>
          <p className="text-slate-400 text-sm">No spam. Unsubscribe in one click.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="bg-slate-950 rounded-[2rem] py-24 px-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.2),transparent_60%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight tracking-tight">Start your progress today</h2>
              <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Don't learn more, learn smarter. Master the 1,500 words that actually matter.</p>
              <Link href="/level-test" className="inline-block soft-gradient-orange text-white px-12 py-5 rounded-full font-semibold text-xl hover:scale-105 transition-all shadow-2xl shadow-orange-500/20 no-underline">
                Test Your Level
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function JourneyStep({ icon, title, sub, status, body, chips, state, last }) {
  const isCurrent = state === 'current'
  const isLocked = state === 'locked'
  const circleCls = isCurrent ? 'bg-orange-400' : isLocked ? 'bg-slate-800 border-2 border-slate-700' : 'bg-orange-500'
  const cardCls = isCurrent
    ? 'bg-white border-2 border-orange-500 shadow-[0_0_40px_rgba(255,140,0,0.15)]'
    : isLocked ? 'bg-slate-900 border border-slate-800 opacity-60' : 'bg-slate-900 border border-slate-800'
  const titleCls = isCurrent ? 'text-slate-900' : isLocked ? 'text-slate-300' : 'text-white'
  const subCls = isCurrent ? 'text-slate-600' : isLocked ? 'text-slate-500' : 'text-slate-400'
  const bodyCls = isCurrent ? 'text-slate-700' : isLocked ? 'text-slate-600' : 'text-slate-500'
  const badgeCls = isCurrent ? 'bg-orange-500 text-white' : isLocked ? 'bg-slate-800 text-slate-500' : 'bg-orange-500/10 text-orange-500'
  const iconCls = isLocked ? 'text-slate-500' : 'text-white'

  return (
    <div className="flex gap-6 md:gap-8 relative group">
      {!last && <div className="journey-connector"></div>}
      <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${circleCls} ${!isLocked ? 'shadow-lg shadow-orange-500/20' : ''}`}>
        <span className={`material-symbols-rounded text-3xl ${iconCls}`}>{icon}</span>
      </div>
      <div className={`p-8 rounded-2xl flex-grow transition-colors ${cardCls}`}>
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${titleCls}`}>{title}</h3>
            <p className={subCls}>{sub}</p>
          </div>
          <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${badgeCls}`}>{status}</span>
        </div>
        <p className={`leading-relaxed mb-6 ${bodyCls}`}>{body}</p>
        <div className="flex gap-3 flex-wrap">
          {chips.map((c) => (
            <div key={c} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${isCurrent ? 'bg-orange-50 text-orange-800 font-bold' : 'bg-slate-800 text-slate-300'}`}>
              <span className={`material-symbols-rounded text-lg ${isLocked ? 'text-slate-700' : 'text-orange-500'}`}>{isLocked ? 'lock' : 'check_circle'}</span>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
