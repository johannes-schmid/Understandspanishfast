import BlogPost, { SidebarCallout, ProTip } from '@/components/BlogPost'

const POST_URL = 'https://mostcommonspanish.com/blog/how-to-start-learning-spanish'
const OG_IMAGE = 'https://images.pexels.com/photos/5408919/pexels-photo-5408919.jpeg?auto=compress&cs=tinysrgb&w=1200'

export const metadata = {
  title: 'How to Start Learning Spanish: A 30-Day Beginner Plan',
  description: 'How to start learning Spanish with a day 1 to day 30 plan: the 5 vowels, the 100 most common words, survival phrases, first listening and first speaking.',
  alternates: { canonical: POST_URL },
  openGraph: {
    type: 'article',
    url: POST_URL,
    title: 'How to Start Learning Spanish: A 30-Day Beginner Plan',
    description: 'A day 1 to day 30 plan for complete beginners: sounds, the top 100 words, survival phrases, first listening and first speaking.',
    images: [{ url: OG_IMAGE }],
  },
}

function PexelsImage({ src, alt, photographer, caption }) {
  return (
    <figure className="post-fig">
      <img src={src} alt={alt} loading="lazy" />
      {(caption || photographer) && (
        <figcaption>
          <span>{caption}</span>
          {photographer && <span className="post-credit">Photo: {photographer} / Pexels</span>}
        </figcaption>
      )}
    </figure>
  )
}

const TOP_WORDS = [
  [1, 'ser', 'to be (permanent)'],
  [2, 'estar', 'to be (temporary)'],
  [3, 'ir', 'to go'],
  [4, 'tener', 'to have'],
  [6, 'qué', 'what'],
  [12, 'querer', 'to want'],
  [18, 'pero', 'but'],
  [44, 'hablar', 'to speak'],
  [68, 'porque', 'because'],
  [73, 'dónde', 'where'],
]

const PHRASES = [
  ['Hola, ¿qué tal?', 'Hi, how are you?'],
  ['Quiero un café, por favor.', 'I want a coffee, please.'],
  ['¿Dónde está el baño?', 'Where is the bathroom?'],
  ['No entiendo.', "I don't understand."],
  ['Más despacio, por favor.', 'Slower, please.'],
  ['¿Cómo se dice ... en español?', 'How do you say ... in Spanish?'],
  ['Gracias, muy bien.', 'Thanks, very good.'],
]

const faqs = [
  {
    q: 'What should I learn first when I start learning Spanish?',
    a: 'Learn the five vowel sounds first, then the most frequent words. The top 100 Spanish words, such as ser, estar, ir, tener, qué and pero, cover about 50% of everyday spoken Spanish, so they pay off faster than any themed list.',
  },
  {
    q: 'Can I teach myself Spanish from scratch?',
    a: 'Yes. Pronunciation, vocabulary and listening all work well as self-study. The one thing that is hard to do alone is speaking, so add a tutor or a language exchange partner in your first month, even for one short conversation a week.',
  },
  {
    q: 'How long does it take to learn basic Spanish?',
    a: 'With 30 minutes a day, a complete beginner can learn the 100 most common words in about three weeks, which covers about 50% of everyday speech. Reaching 1,000 words (about 74%) takes a few months of daily practice. The FSI places Spanish in its easiest category for English speakers.',
  },
  {
    q: 'How many minutes a day should a beginner study Spanish?',
    a: 'Thirty minutes every day is enough to start: about 10 minutes of flashcards, 10 minutes of listening and 10 minutes of speaking out loud. A daily habit beats a long weekend session.',
  },
  {
    q: 'Is Spanish easy to learn for English speakers?',
    a: 'It is one of the easiest. Spanish uses the same alphabet plus ñ, spelling matches pronunciation closely, and many words look like English ones. The hard part for most beginners is verb endings, which you can learn gradually through the most common verbs.',
  },
  {
    q: 'How can I start learning Spanish for free?',
    a: 'Use free frequency-ranked flashcards, a free spaced repetition app like Anki on desktop or Android, free beginner podcasts or videos for listening, and a free language exchange app for speaking. You do not need to pay for anything in your first 30 days.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://mostcommonspanish.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'How to Start Learning Spanish', item: POST_URL },
  ],
}

const cell = { padding: '8px 10px', borderBottom: '1px solid var(--fog)', fontSize: '14px', textAlign: 'left' }

export default function PostHowToStart() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPost
        slug="how-to-start-learning-spanish"
        title="How to Start Learning Spanish: Your First 30 Days"
        description="A day 1 to day 30 plan for complete beginners: the sounds, the 100 most common words, survival phrases, your first listening and your first conversation."
        category="Beginners"
        readTime="8 min read"
        datePublished="2026-11-09"
        dateModified="2026-11-09"
        image={OG_IMAGE}
        heroCallout={{ value: '30 days', label: 'From zero to the 100 words behind half of everyday Spanish' }}
        sidebar={
          <>
            <SidebarCallout title="Words and comprehension">
              {[['100 words', '~50%'], ['500 words', '~67%'], ['1,000 words', '~74%'], ['1,500 words', '~80%']].map(([words, pct], i) => (
                <div key={words} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--fog)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--cortex)' }}>{words}</span>
                  <b style={{ color: i === 0 ? 'var(--synapse)' : 'var(--deep-mind)' }}>{pct}</b>
                </div>
              ))}
            </SidebarCallout>
            <ProTip>30 minutes a day for 30 days: 10 minutes of flashcards, 10 of listening, 10 of speaking out loud. Same time every day.</ProTip>
          </>
        }
      >
        <div className="post-qa">
          <p className="post-qa-label">Quick answer</p>
          <p>
            To start learning Spanish, spend week 1 on pronunciation and the five vowels, weeks 2 and 3 on the <strong>100 most common words</strong> plus a handful of survival phrases, start listening in week 3 and have your first real conversation in week 4. Thirty minutes a day is enough. Skip grammar drills and themed word lists for now.
          </p>
        </div>

        <p>
          Most people who want to know how to start learning Spanish end up with ten browser tabs, three apps and no plan. The fix is simple: do the right things in the right order. This post gives you a concrete day 1 to day 30 roadmap, what to skip at the start, and the short list of tools you actually need.
        </p>
        <p>
          The good news first. The <a href="https://www.state.gov/foreign-language-training/" target="_blank" rel="noopener noreferrer">Foreign Service Institute</a> puts Spanish in its easiest category for English speakers. Same alphabet plus ñ, spelling that matches sound, and lots of familiar-looking words. You are not starting from nothing.
        </p>

        <PexelsImage
          src="https://images.pexels.com/photos/6172482/pexels-photo-6172482.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Desk calendar with handwritten notes for a 30-day plan to start learning Spanish"
          photographer="RDNE Stock project"
          caption="A fixed 30-day plan removes the daily question of what to study."
        />

        <h2>Before day 1: pick a goal and a time slot</h2>
        <p>
          Write down one sentence: why you want Spanish. Talking to your partner&apos;s family, a trip to Mexico, understanding shows without subtitles. A specific reason keeps you going in week 3, when the novelty wears off.
        </p>
        <p>
          Then block 30 minutes in your calendar, every day, same time. <strong>Consistency beats intensity.</strong> Thirty minutes daily beats four hours on a Sunday, every time.
        </p>

        <h2>Week 1 (days 1 to 7): learn the sounds</h2>
        <p>
          Spanish pronunciation is the easiest win you will get. Each vowel has one sound, always:
        </p>
        <ul>
          <li><strong>a</strong> as in &quot;father&quot;</li>
          <li><strong>e</strong> as in &quot;bet&quot;</li>
          <li><strong>i</strong> as in &quot;machine&quot;</li>
          <li><strong>o</strong> as in &quot;more&quot;, but shorter</li>
          <li><strong>u</strong> as in &quot;food&quot;</li>
        </ul>
        <p>
          Then cover the few consonants that trip up English speakers: <strong>h</strong> is silent, <strong>j</strong> is a throaty h, <strong>ñ</strong> sounds like the ny in &quot;canyon&quot;, <strong>ll</strong> and <strong>y</strong> sound like the y in &quot;yes&quot; in most regions, and <strong>rr</strong> is rolled. Once you know these, you can read almost any Spanish word out loud correctly, which makes every later step faster.
        </p>
        <p>
          Practise with real words, not syllable drills. Read the first 20 words of a frequency list out loud each day and check them against audio. Do not wait until your rolled r is perfect before moving on.
        </p>

        <h2>Weeks 2 and 3 (days 8 to 21): the top 100 words</h2>
        <p>
          This is the core of the month. The 100 most frequent Spanish words cover about <strong>50% of everyday spoken Spanish</strong>. Learn 7 to 10 new words a day with spaced repetition and you finish the list by day 21.
        </p>
        <p>Here is what the top of the list looks like (ranks from our frequency data):</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
          <thead>
            <tr>
              <th style={cell}>Rank</th>
              <th style={cell}>Spanish</th>
              <th style={cell}>English</th>
            </tr>
          </thead>
          <tbody>
            {TOP_WORDS.map(([rank, es, en]) => (
              <tr key={rank}>
                <td style={cell}>#{rank}</td>
                <td style={cell}><strong>{es}</strong></td>
                <td style={cell}>{en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Notice what is missing: colours, animals, furniture. The top 100 is verbs, question words and connectors, the glue of every sentence. Learn <em>hablar</em> before <em>hipopótamo</em>. The full ranked list is on the <a href="/words/top-100-spanish-words">top 100 Spanish words</a> page, and <a href="/blog/the-power-of-the-first-100-words">why the first 100 words matter so much</a> explains the research behind it.
        </p>

        <h3>Add survival phrases built from those words</h3>
        <p>
          Phrases turn single words into something you can use. Learn these seven alongside your flashcards. Most of them reuse words from the top 100:
        </p>
        <ul>
          {PHRASES.map(([es, en]) => (
            <li key={es}><strong>{es}</strong> ({en})</li>
          ))}
        </ul>

        <PexelsImage
          src="https://images.pexels.com/photos/5553631/pexels-photo-5553631.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Beginner learning Spanish with headphones while writing notes"
          photographer="Armin Rimoldi"
          caption="Ten minutes of daily listening from week 3 trains your ear for real speed."
        />

        <h2>Week 3 (days 15 to 21): your first listening input</h2>
        <p>
          Once you have around 50 words, start 10 minutes of daily listening. Pick content made for beginners: slow podcasts, beginner video channels where the speaker uses gestures and pictures, or graded audio. You should follow the gist, not every word.
        </p>
        <p>
          Avoid the classic trap: a Spanish series with English subtitles. Your brain reads the English and the Spanish becomes background music. Pleasant, but it is not studying. Save real shows for later, or watch with Spanish subtitles once you have a few hundred words.
        </p>

        <h2>Week 4 (days 22 to 30): your first speaking</h2>
        <p>
          Speaking feels scary, so most beginners postpone it forever. Do not. Build up in three steps:
        </p>
        <ul>
          <li><strong>Days 22 to 24:</strong> shadowing. Play a short beginner clip and repeat each sentence right after the speaker.</li>
          <li><strong>Days 25 to 27:</strong> self-talk. Describe your day out loud with the words you know: <em>Quiero un café. Hoy no voy a trabajar.</em></li>
          <li><strong>Days 28 to 30:</strong> one real conversation of 20 to 30 minutes with a tutor or a language exchange partner. Use your survival phrases. &quot;No entiendo&quot; counts as participation.</li>
        </ul>
        <p>
          On day 30, take the <a href="/level-test">Spanish level test</a> to see how many of the most common words you now recognise.
        </p>

        <PexelsImage
          src="https://images.pexels.com/photos/12898882/pexels-photo-12898882.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Two women having a first Spanish conversation over coffee at a cafe"
          photographer="Mizuno K"
          caption="One short conversation in week 4 does more for your confidence than another week of apps."
        />

        <h2>What to skip in your first month</h2>
        <ul>
          <li><strong>Heavy grammar drills.</strong> Week 3 is not the time for the subjunctive. Learn the present tense of the top verbs through example sentences and leave conjugation tables for later.</li>
          <li><strong>Themed vocabulary lists.</strong> Colours, zoo animals and kitchen utensils feel organised but rarely show up in conversation. Frequency beats themes.</li>
          <li><strong>App hopping.</strong> Downloading a new app every week feels like progress. It is a way to restart week 1 forever.</li>
          <li><strong>Streak chasing.</strong> A streak measures showing up, not learning. Track words learned instead.</li>
        </ul>
        <p>
          If you want the broader strategy behind this order, read <a href="/blog/fastest-way-to-learn-spanish">the fastest way to learn Spanish</a>. This plan is the first month of it, broken into days.
        </p>

        <h2>The tools you need (mostly free)</h2>
        <ul>
          <li><strong>Flashcards in frequency order.</strong> Start with our <a href="/study">10 free flashcards</a> in your browser, then use Anki (free on desktop and Android) with a frequency deck.</li>
          <li><strong>A dictionary with audio.</strong> Any good bilingual dictionary works. For the official definition of a word, the <a href="https://dle.rae.es/" target="_blank" rel="noopener noreferrer">Real Academia Española dictionary</a> is the reference.</li>
          <li><strong>One listening source.</strong> A beginner podcast or video channel. One, not five.</li>
          <li><strong>One speaking partner.</strong> A free language exchange app, or a paid tutor if your budget allows.</li>
          <li><strong>Optional:</strong> a printed list of the top 1,500 words if you like studying on paper.</li>
        </ul>

        <h2>What comes after day 30</h2>
        <p>
          Keep the same daily routine and grow your vocabulary in frequency order: 500 words gets you to about 67% of everyday speech, 1,000 to about 74%, and 1,500 to about 80%. Grammar starts to click once you have the words to hang it on.
        </p>
        <p>
          If you want a formal milestone, the <a href="https://examenes.cervantes.es/en/dele/what-is-dele" target="_blank" rel="noopener noreferrer">Instituto Cervantes DELE exams</a> start at level A1, a realistic target after a few months of this routine.
        </p>

        <h2>Frequently asked questions</h2>
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </BlogPost>
    </>
  )
}
