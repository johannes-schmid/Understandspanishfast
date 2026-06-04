import BlogPost, { SidebarCallout, ProTip } from '@/components/BlogPost'

export const metadata = {
  title: 'Best Shows to Learn Spanish (Netflix & Beyond) — Ranked by Level',
  description: 'The best Spanish TV shows for language learners, ranked by difficulty. From beginner-friendly to advanced — with tips on how to actually learn from them.',
  alternates: { canonical: 'https://mostcommonspanish.com/blog/best-shows-to-learn-spanish' },
  openGraph: {
    type: 'article',
    images: [{ url: 'https://images.pexels.com/photos/5202925/pexels-photo-5202925.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
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

const SHOWS = [
  {
    level: 'Beginner (A1–A2)',
    shows: [
      { title: 'Extr@ en Español', where: 'YouTube (free)', country: 'Spain', why: 'A sitcom made specifically for Spanish learners. Slow, clear dialogue, simple vocabulary, and storylines that repeat useful phrases. Genuinely useful at the very beginning.' },
      { title: 'Velvet', where: 'Netflix', country: 'Spain', why: 'Set in a 1950s Madrid fashion house. Dialogue is slow, polite, and formal — ideal for beginners. Clear pronunciation throughout.' },
      { title: 'Alta Mar (High Seas)', where: 'Netflix', country: 'Spain', why: 'A period mystery thriller with clear, relatively slow dialogue and less slang than modern shows. Good for learners who want narrative engagement from early on.' },
    ],
  },
  {
    level: 'Intermediate (B1–B2)',
    shows: [
      { title: 'La Casa de Papel (Money Heist)', where: 'Netflix', country: 'Spain', why: 'The most famous Spanish-language show on Netflix. Multiple Spanish regional accents, natural fast-paced dialogue, and rich vocabulary. Ideal for intermediate learners who want Castilian Spanish exposure.' },
      { title: 'Elite', where: 'Netflix', country: 'Spain', why: 'A high school drama with modern slang, informal speech, and the vosotros conjugation form used throughout. Great for general Spanish practice with natural, contemporary dialogue.' },
      { title: 'Club de Cuervos', where: 'Netflix', country: 'Mexico', why: 'A comedy-drama about a Mexican football club. Excellent for learners who want exposure to Mexican Spanish — natural pacing, modern vocabulary, and genuinely funny.' },
      { title: 'Vis a Vis (Locked Up)', where: 'Netflix', country: 'Spain', why: 'A women\'s prison drama with fast, slang-heavy dialogue. Push toward the top of B2 before starting this one. Excellent for authentic, unfiltered Spanish.' },
    ],
  },
  {
    level: 'Advanced (C1+)',
    shows: [
      { title: 'Narcos / Narcos: Mexico', where: 'Netflix', country: 'Colombia / Mexico', why: 'Features authentic Colombian and Mexican accents with natural, fast-paced dialogue. Heavy on regional vocabulary and slang. Best for advanced learners who want real unfiltered Latin American Spanish.' },
      { title: 'La Casa de las Flores', where: 'Netflix', country: 'Mexico', why: 'A dark comedy with sharp, witty dialogue and cultural references. One character speaks unusually slowly — useful for advanced learners as a brief respite during complex episodes.' },
      { title: 'Ingobernable', where: 'Netflix', country: 'Mexico', why: 'A political thriller with sophisticated vocabulary and fast-paced dialogue. Best for learners targeting professional or political Spanish register.' },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best show to learn Spanish on Netflix?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Casa de Papel (Money Heist) is widely recommended for intermediate learners wanting Castilian Spanish. For beginners, Velvet or Alta Mar have slower, clearer dialogue. For Latin American Spanish, Club de Cuervos (Mexican) or Narcos (Colombian/Mexican, advanced) are excellent choices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I watch Spanish shows with subtitles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — but use Spanish subtitles, not English. Watching with English subtitles means your brain reads English while the Spanish becomes background noise. Spanish subtitles force active processing. At A1–A2 level, start with Spanish audio + English subtitles, then switch to Spanish subtitles by A2–B1.',
      },
    },
    {
      '@type': 'Question',
      name: 'What level do you need to watch Spanish TV shows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Learner-oriented shows like Extr@ can be used from A1. Authentic shows like Velvet or Alta Mar become productive at A2. Most Netflix shows (Money Heist, Elite) are best at B1–B2. Native-level shows like Narcos are most useful at B2+. Below your level, shows are noise — at or slightly above your level, they\'re comprehensible input.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is watching Spanish TV really an effective way to learn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — once you have a vocabulary foundation. Watching Spanish TV with Spanish subtitles provides comprehensible input: real language at natural speed, with visual context and the ability to replay. Below ~A2 level, most dialogue will be incomprehensible. Build vocabulary first, then use shows to reinforce and expand it naturally.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Best Shows to Learn Spanish (Netflix & Beyond) — Ranked by Level',
  description: 'The best Spanish TV shows for language learners, ranked by difficulty.',
  datePublished: '2026-06-04',
  dateModified: '2026-06-04',
  author: { '@type': 'Organization', name: 'Most Common Spanish' },
  publisher: { '@type': 'Organization', name: 'Most Common Spanish', url: 'https://mostcommonspanish.com' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://mostcommonspanish.com/blog/best-shows-to-learn-spanish' },
  image: 'https://images.pexels.com/photos/5202925/pexels-photo-5202925.jpeg?auto=compress&cs=tinysrgb&w=1200',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mostcommonspanish.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://mostcommonspanish.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Best Shows to Learn Spanish', item: 'https://mostcommonspanish.com/blog/best-shows-to-learn-spanish' },
  ],
}

export default function PostBestShows() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogPost
        slug="best-shows-to-learn-spanish"
        title="Best Shows to Learn Spanish"
        description="Ranked by difficulty level — from beginner-friendly to advanced. Plus: how to actually learn from them instead of just watching."
        category="Resources"
        readTime="9 min read"
        datePublished="2026-06-04"
        dateModified="2026-06-04"
        heroCallout={{ value: '10', label: 'Shows ranked by learner level' }}
        sidebar={
          <>
            <SidebarCallout title="Quick picks by level">
              {[
                ['A1–A2', 'Extr@, Velvet'],
                ['B1–B2', 'Money Heist, Elite'],
                ['C1+', 'Narcos, Ingobernable'],
              ].map(([level, show]) => (
                <div key={level} style={{ padding: '8px 0', borderBottom: '1px solid var(--fog)', fontSize: '13px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--deep-mind)' }}>{level}</div>
                  <div style={{ color: 'var(--cortex)' }}>{show}</div>
                </div>
              ))}
            </SidebarCallout>
            <ProTip>Use Spanish subtitles, not English. Watching with English subtitles means your brain reads English while Spanish plays in the background — you're not learning, you're watching TV.</ProTip>
          </>
        }
      >
        <div style={{ background: 'var(--surface, #f8f5f0)', border: '1px solid var(--border, #e5e0d8)', borderRadius: '8px', padding: '20px 24px', marginBottom: '28px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Quick answer</p>
          <p style={{ margin: 0, fontSize: '1.05rem' }}>
            The best shows to learn Spanish depend on your level. <strong>Beginners:</strong> Velvet, Alta Mar, Extr@ en Español. <strong>Intermediate:</strong> Money Heist, Elite, Club de Cuervos. <strong>Advanced:</strong> Narcos, La Casa de las Flores. Use Spanish subtitles — not English — to make watching actually count as language learning.
          </p>
        </div>

        <p>
          Watching Spanish TV with English subtitles is not language learning. It's language learning-flavoured entertainment. Your brain reads English while the Spanish plays in the background — the input doesn't stick.
        </p>
        <p>
          But watching Spanish TV <i>correctly</i> — at the right level, with Spanish subtitles or none — is one of the most effective forms of comprehensible input available. It gives you natural speech, cultural context, visual cues, and the ability to replay. Here's how to use it properly, and which shows to start with.
        </p>

        <h2>How to actually learn Spanish from TV shows</h2>
        <p>
          Before the list, the method. Watching Spanish TV without active processing produces minimal language gain. With it, the same hours become genuine comprehensible input:
        </p>
        <ul>
          <li><b>Use Spanish subtitles, not English.</b> At A2+, switch your subtitle language to Spanish. This forces active processing and connects spoken to written form.</li>
          <li><b>Watch at your level, not above it.</b> If you miss more than 30% of dialogue, the show is too advanced. Background noise doesn't teach language. Find something slightly challenging but mostly followable.</li>
          <li><b>Replay and look up.</b> When you miss a phrase, replay it. Look up words that appear repeatedly. Passive re-watching beats passive watching, but active engagement beats both.</li>
          <li><b>Take note of recurring phrases.</b> Native Spanish dialogue is full of high-frequency expressions. When you hear the same phrase three times in one episode, it's worth memorising.</li>
        </ul>

        <PexelsImage
          src="https://images.pexels.com/photos/5202925/pexels-photo-5202925.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Person watching a Spanish TV show on a television"
          photographer="www.kaboompics.com"
          caption="The right show at the right level provides genuine comprehensible input — but only if you're actively processing it."
        />

        <h2>Best Spanish shows by level</h2>

        {SHOWS.map(({ level, shows }) => (
          <div key={level} style={{ margin: '40px 0' }}>
            <div style={{
              display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: 'var(--synapse)', background: 'var(--fog)',
              borderRadius: '99px', padding: '4px 14px', marginBottom: '16px',
            }}>{level}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shows.map(({ title, where, country, why }) => (
                <div key={title} style={{ background: 'var(--fog)', borderRadius: '16px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--deep-mind)' }}>{title}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(0,0,0,0.06)', borderRadius: '99px', padding: '3px 10px', color: 'var(--cortex)' }}>{where}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(0,0,0,0.06)', borderRadius: '99px', padding: '3px 10px', color: 'var(--cortex)' }}>{country}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--cortex)', lineHeight: 1.6 }}>{why}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <PexelsImage
          src="https://images.pexels.com/photos/987586/pexels-photo-987586.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Cozy living room setup for watching Spanish TV shows"
          photographer="freestocks.org"
          caption="At B1 level, Spanish TV stops being study and starts becoming entertainment — that's the moment immersion starts working."
        />

        <h2>Spain Spanish vs. Latin American Spanish: does it matter?</h2>
        <p>
          Most Netflix Spanish originals are either from Spain (Money Heist, Elite, Velvet) or Mexico (Club de Cuervos, Narcos Mexico, La Casa de las Flores). The vocabulary and grammar are ~90%+ shared. Regional differences show up in accent, some slang, and the use of <i>vosotros</i> (Spain only).
        </p>
        <p>
          Pick the variety you'll use or hear most. If you're targeting Mexico, Brazil, or Argentina specifically, lean toward shows from those countries. If you don't have a specific target, Spain Spanish is fine — it doesn't handicap your ability to understand Latin American speakers.
        </p>

        <h2>A word on Narcos and English subtitles</h2>
        <p>
          Narcos is partially in Spanish, partially in English — not a pure Spanish immersion experience. And watching Narcos with English subtitles, which most people do, produces almost no Spanish gain. If you want to use Narcos for language learning, switch audio to Spanish-only episodes and set subtitles to Spanish.
        </p>

        <h2>Frequently asked questions</h2>

        <h3>What is the best show to learn Spanish on Netflix?</h3>
        <p>
          Money Heist (La Casa de Papel) is widely recommended for intermediate learners wanting Castilian Spanish. For beginners, Velvet or Alta Mar have slower, clearer dialogue. For Latin American Spanish, Club de Cuervos (Mexican) or Narcos (Colombian/Mexican, advanced) are excellent choices.
        </p>

        <h3>Should I watch Spanish shows with subtitles?</h3>
        <p>
          Yes — but use Spanish subtitles, not English. Watching with English subtitles means your brain reads English while the Spanish becomes background noise. Spanish subtitles force active processing. At A1–A2, start with Spanish audio and English subtitles for plot comprehension, then switch to Spanish subtitles by A2–B1.
        </p>

        <h3>What level do you need to watch Spanish TV?</h3>
        <p>
          Learner-oriented shows like Extr@ are usable from A1. Authentic shows like Velvet are productive at A2. Most Netflix shows (Money Heist, Elite) are best at B1–B2. Native shows like Narcos are most useful at B2+. Below your level, shows are noise — at or slightly above your level, they're comprehensible input.
        </p>

        <h3>Is watching Spanish TV really an effective way to learn?</h3>
        <p>
          Yes — once you have a vocabulary foundation of ~500 words. Below that, most dialogue will be incomprehensible. Build vocabulary first using a <a href="/words/most-common-spanish-words">frequency list</a>, then use shows to reinforce and expand it naturally. The goal is comprehensible input, not passive background noise.
        </p>
      </BlogPost>
    </>
  )
}
