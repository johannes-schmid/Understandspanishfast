import BlogPost, { SidebarCallout, ProTip } from '@/components/BlogPost'

export const metadata = {
  title: 'How to Build Spanish Vocabulary Fast (The Right Way)',
  description: 'Most Spanish learners build vocabulary the slow way. Here\'s the efficient approach: frequency order, spaced repetition, and context — backed by vocabulary research.',
  alternates: { canonical: 'https://mostcommonspanish.com/blog/how-to-build-spanish-vocabulary' },
  openGraph: {
    type: 'article',
    images: [{ url: 'https://images.pexels.com/photos/6503036/pexels-photo-6503036.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
  },
}

function PexelsImage({ src, alt, photographer, caption }) {
  return (
    <figure style={{ margin: '48px 0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
      <img src={src} alt={alt} style={{ width: '100%', display: 'block', aspectRatio: '16/7', objectFit: 'cover' }} loading="lazy" />
      {(caption || photographer) && (
        <figcaption style={{ fontSize: '12px', color: 'var(--cortex)', padding: '10px 16px', background: 'var(--fog)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{caption}</span>
          {photographer && <span>Photo: {photographer} / Pexels</span>}
        </figcaption>
      )}
    </figure>
  )
}

const METHODS = [
  {
    title: 'Learn in frequency order',
    priority: 'Highest impact',
    body: 'The top 1,500 most common Spanish words cover ~80% of everyday spoken Spanish. The top 100 cover ~50%. Learning in frequency order means every new word you add has the maximum possible return on comprehension. This is the single biggest difference between learners who plateau and learners who break through.',
  },
  {
    title: 'Use spaced repetition (Anki)',
    priority: 'Highest impact',
    body: 'Spaced repetition schedules reviews at the exact interval before you forget — day 1, day 3, day 7, day 21. This compresses months of review into minutes of daily practice. 15–20 minutes of Anki daily beats 2 hours of re-reading word lists. It\'s not glamorous. It works.',
  },
  {
    title: 'Learn words in phrases, not isolation',
    priority: 'High impact',
    body: '"Tengo que ir" (I have to go) teaches tener, que, and ir simultaneously — in context, with a natural rhythm you\'ll recognise immediately when you hear it. Isolated word memorisation produces words you recognise in a list but miss in speech. Phrases produce words you recognise in the wild.',
  },
  {
    title: 'Encounter words in real Spanish input',
    priority: 'High impact',
    body: 'The research on incidental vocabulary acquisition is clear: words encountered in context stick significantly better than words studied in isolation. Once you have ~500 words, start consuming Spanish content at your level (podcasts, graded readers, shows). Every word you\'ve studied becomes reinforced by encounter — and new words begin acquiring naturally.',
  },
  {
    title: 'Use active recall — not passive review',
    priority: 'Medium-high impact',
    body: 'The act of trying to retrieve a word before seeing the answer (active recall) strengthens the memory trace more than re-reading does. This is why flashcards work and re-reading vocabulary lists doesn\'t. Always try to produce the answer before revealing it.',
  },
  {
    title: 'Focus on headwords, not forms',
    priority: 'Medium impact',
    body: 'Spanish generates many forms from one root word: hablar → hablo, hablas, habla, hablamos, hablaron, hablaría… Learning the headword (hablar) gives you access to all its forms through pattern recognition. Don\'t try to memorise every conjugation individually — learn roots and learn the patterns.',
  },
  {
    title: 'Track your count against a frequency list',
    priority: 'Medium impact',
    body: '"I know 847 of the top 1,500 Spanish words" is more useful than "I\'m intermediate." It tells you exactly how far you\'ve come and exactly how far you have to go. Concrete vocabulary counts also predict comprehension — at 1,000 words, you understand ~74% of everyday Spanish. At 1,500, ~80%. Track the number.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the fastest way to build Spanish vocabulary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The fastest way to build Spanish vocabulary is to learn in frequency order using spaced repetition. Use a pre-built Spanish frequency deck in Anki, study 15–20 minutes daily, and supplement with real Spanish content (podcasts, shows, readers) to reinforce words in context. This approach builds the highest-return vocabulary first and converts studied words into natural comprehension.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many Spanish words should I learn per day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10–15 new words per day is sustainable and produces strong long-term retention for most adults. More than 20 new words daily increases the review burden rapidly, leading to burnout. Consistency matters more than daily volume — 10 words daily for a year (3,650 words) outperforms 50 words daily for three weeks then quitting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to learn Spanish vocabulary in context or from lists?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both serve different roles. Lists (specifically frequency-ranked lists) give you efficient sequencing so you\'re always learning the highest-return vocabulary first. Context — real Spanish content — converts passive recognition into active comprehension and cements retention. The most effective approach is to use frequency-ranked spaced repetition to build your core 1,500, then shift to real content to deepen and expand it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn 1,000 Spanish words?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With 15–20 minutes of daily spaced repetition practice and 10–15 new words per day, most adults learn 1,000 words in 3–4 months. Learning in frequency order means those 1,000 words give you ~74% coverage of everyday spoken Spanish — a significant comprehension milestone.',
      },
    },
    {
      '@type': 'Question',
      name: 'What Spanish words should I learn first?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the most frequent Spanish words, not themed vocabulary. The top 100 most frequent words (structural words — verbs like ser, estar, ir; connectors like y, pero, porque; prepositions like en, de, a) cover ~50% of all spoken Spanish. These appear in every sentence and provide the scaffolding to understand the rest from context.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'How to Build Spanish Vocabulary Fast (The Right Way)',
  description: 'The efficient approach to building Spanish vocabulary: frequency order, spaced repetition, and context.',
  datePublished: '2026-06-04',
  dateModified: '2026-06-04',
  author: { '@type': 'Organization', name: 'Most Common Spanish' },
  publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://mostcommonspanish.com/blog/how-to-build-spanish-vocabulary' },
  image: 'https://images.pexels.com/photos/6503036/pexels-photo-6503036.jpeg?auto=compress&cs=tinysrgb&w=1200',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://mostcommonspanish.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'How to Build Spanish Vocabulary', item: 'https://mostcommonspanish.com/blog/how-to-build-spanish-vocabulary' },
  ],
}

export default function PostVocabulary() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPost
        slug="how-to-build-spanish-vocabulary"
        title="How to Build Spanish Vocabulary Fast"
        description="The efficient path: frequency order, spaced repetition, and real Spanish input — backed by what vocabulary research actually says."
        category="Method"
        readTime="9 min read"
        datePublished="2026-06-04"
        dateModified="2026-06-04"
        heroCallout={{ value: '15min', label: 'Daily Anki to build 1,500 words in 6 months' }}
        sidebar={
          <>
            <SidebarCallout title="Words → Comprehension">
              {[['100 words','~50%'],['500 words','~63%'],['1,000 words','~74%'],['1,500 words','~80%'],['3,000 words','~90%']].map(([words, pct], i) => (
                <div key={words} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--fog)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--cortex)' }}>{words}</span>
                  <b style={{ color: i === 3 ? 'var(--synapse)' : 'var(--deep-mind)' }}>{pct}</b>
                </div>
              ))}
            </SidebarCallout>
            <ProTip>10–15 new words/day sustained for 6 months = 1,500–2,700 words. Consistency beats daily volume every time.</ProTip>
          </>
        }
      >
        <div style={{ background: 'var(--surface, #f8f5f0)', border: '1px solid var(--border, #e5e0d8)', borderRadius: '8px', padding: '20px 24px', marginBottom: '28px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Quick answer</p>
          <p style={{ margin: 0, fontSize: '1.05rem' }}>
            The fastest way to build Spanish vocabulary: <strong>learn in frequency order</strong> using spaced repetition (Anki), study 10–15 new words/day, and supplement with real Spanish input to reinforce words in context. Learning the most common words first — not thematic vocabulary — is the single biggest accelerator.
          </p>
        </div>

        <p>
          Most Spanish learners build vocabulary the slow way: random apps, thematic lists, alphabetical flashcards. These methods work eventually. They're just inefficient — they treat "giraffe" and "because" as equally valuable when one appears in every Spanish sentence and the other almost never.
        </p>
        <p>
          Here's the efficient path — what vocabulary research actually recommends, not what feels like studying.
        </p>

        <PexelsImage
          src="https://images.pexels.com/photos/6503036/pexels-photo-6503036.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Spanish vocabulary flashcards spread on a study desk"
          photographer="Thirdman"
          caption="The right vocabulary method produces 2–3x more comprehension gain per hour than random or thematic learning."
        />

        <h2>The 7 most effective methods for building Spanish vocabulary</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '32px 0' }}>
          {METHODS.map(({ title, priority, body }, i) => (
            <div key={title} style={{
              background: i < 2 ? 'var(--deep-mind)' : 'var(--fog)',
              borderRadius: '16px', padding: '22px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: i < 2 ? '#fff' : 'var(--deep-mind)' }}>{title}</div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', letterSpacing: '.05em', textTransform: 'uppercase',
                  background: i < 2 ? 'var(--mauve)' : 'rgba(0,0,0,0.08)',
                  color: i < 2 ? '#1a1208' : 'var(--synapse)',
                }}>{priority}</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--cortex)', lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>

        <h2>The vocabulary sequencing problem: why most learners plateau</h2>
        <p>
          The most common reason Spanish learners plateau at intermediate level isn't that they stopped studying. It's that they're studying the wrong words in the wrong order.
        </p>
        <p>
          Duolingo, Babbel, and most textbooks teach in thematic units — Colors, Animals, Food, Travel, Family. These feel logical because they match how we think about the world. But language doesn't organise itself by theme. It organises itself by frequency.
        </p>
        <p>
          The word "but" (pero) appears more often in everyday Spanish than all animal names combined. "Because" (porque) appears more often than all color names combined. These high-frequency structural words are the scaffold that makes sentences comprehensible — and they're consistently deprioritised in thematic curricula.
        </p>

        <blockquote>
          The top 100 most frequent Spanish words cover ~50% of all spoken language. Learning them first doesn't just give you vocabulary — it gives you the structure to understand everything else from context.
        </blockquote>

        <PexelsImage
          src="https://images.pexels.com/photos/14814060/pexels-photo-14814060.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Person using a vocabulary learning app with Spanish words on screen"
          photographer="Ling App"
          caption="Anki with a Spanish frequency deck — 15 minutes daily — is the most time-efficient vocabulary tool available."
        />

        <h2>How many words per day?</h2>
        <p>
          The research on vocabulary acquisition suggests 10–15 new words per day is the sustainable sweet spot for most adults. More than 20 words/day rapidly increases the review burden — within a month you're spending 45 minutes reviewing rather than learning. This leads to burnout.
        </p>
        <p>
          At 10 new words/day:
        </p>
        <ul>
          <li>1 month → 300 words</li>
          <li>3 months → 900 words (~74% oral comprehension approaching)</li>
          <li>5 months → 1,500 words (~80% oral comprehension)</li>
          <li>10 months → 3,000 words (~90% oral comprehension)</li>
        </ul>
        <p>
          These are not the numbers from a marketing page — they're the natural result of consistent daily practice at a sustainable rate.
        </p>

        <h2>The role of real input</h2>
        <p>
          Flashcard study builds recognition vocabulary — you know a word when you see it. Real input (Spanish shows, podcasts, readers) converts recognition into comprehension — you understand words at native speed in real sentences. Both are necessary.
        </p>
        <p>
          The shift from pure flashcard study to mixed input typically happens around 500 words. At that point, you have enough vocabulary to extract meaningful input from slow podcasts or graded readers. Every word you encounter in real content gets reinforced — and new vocabulary begins acquiring naturally through context.
        </p>
        <p>
          Start with frequency-ranked vocabulary in Anki. At 500 words, add comprehensible input (Coffee Break Spanish, Pobre Ana, Spanish subtitled shows). At 1,500, shift primarily to real content with Anki as maintenance. That's the complete vocabulary-building arc.
        </p>

        <h2>Frequently asked questions</h2>

        <h3>What is the fastest way to build Spanish vocabulary?</h3>
        <p>
          Learn in frequency order using spaced repetition (Anki with a Spanish frequency deck). Study 15–20 minutes daily with 10–15 new words. Supplement with real Spanish content from ~500 words onward to reinforce vocabulary in context. This approach builds the highest-return vocabulary first and converts studied words into natural comprehension.
        </p>

        <h3>How many Spanish words should I learn per day?</h3>
        <p>
          10–15 new words per day is sustainable and produces strong long-term retention. More than 20 daily rapidly increases review burden and leads to burnout. Consistency beats volume — 10 words daily for a year outperforms 50 words daily for three weeks then stopping.
        </p>

        <h3>Is it better to learn Spanish vocabulary in context or from lists?</h3>
        <p>
          Both. Frequency-ranked lists give you efficient sequencing. Context converts passive recognition into active comprehension. Use lists with spaced repetition to build your core 1,500, then shift to real Spanish content to deepen and expand it. The two approaches are complementary, not competing.
        </p>

        <h3>How long does it take to learn 1,000 Spanish words?</h3>
        <p>
          With 15–20 minutes of daily spaced repetition and 10–15 new words per day, most adults reach 1,000 words in 3–4 months. Learning in frequency order means those 1,000 words give you ~74% coverage of everyday spoken Spanish — a real milestone.
        </p>

        <h3>What Spanish words should I learn first?</h3>
        <p>
          Start with the most frequent Spanish words — not themed vocabulary. The top 100 most frequent words (structural words: verbs like ser, estar, ir; connectors like y, pero, porque; prepositions like en, de, a) cover ~50% of all spoken Spanish. See the <a href="/words/most-common-spanish-words">most common Spanish words</a> list to start.
        </p>
      </BlogPost>
    </>
  )
}
