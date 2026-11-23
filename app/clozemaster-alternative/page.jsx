import Link from 'next/link'
import {
  compareMeta, compareSchemas, CompareJsonLd, CompareHero, CompareSection, CompareTable,
  CompareProse, CompareFaq, CompareSources, CompareEnd, CompareRelated,
} from '@/components/CompareBlocks'

const SLUG = 'clozemaster-alternative'
const TITLE = 'Clozemaster Alternative for Spanish: One-Time €9 Anki Deck'
const DESC = 'Clozemaster Pro is a subscription. If you want Spanish vocabulary in context without one, here are the alternatives, from a free Anki sentence deck to a €9 one.'

export async function generateMetadata() {
  return compareMeta({ slug: SLUG, title: TITLE, description: DESC })
}

const SRC = {
  pro: 'https://www.clozemaster.com/pro',
  coll: 'https://www.clozemaster.com/l/spa-eng/collections/10-000-most-common-e479ee2f-f977-4e10-9be3-23c52ee3186d',
  sent9000: 'https://ankiweb.net/shared/info/1713698257',
}

const ROWS = [
  ['Price', 'Pro: €15.72/mo or €78.64/yr', '€9 once'],
  ['Free use', '30 sentences a day', '100-word sample'],
  ['Spanish content', '9,996 sentences (10,000 Most Common)', '1,500 words + sentences'],
  ['Format', 'Cloze (fill the gap)', 'Flashcards'],
  ['Works in Anki', false, true],
  ['Listening practice', true, 'Audio on every card'],
  ['Other languages included', '50+ with Pro', false],
]

const FAQ = [
  { q: 'Is Clozemaster worth it for Spanish?', a: 'For intermediate learners who want lots of sentences, often yes. The Spanish 10,000 Most Common collection has 9,996 cloze sentences, which is far more context than any beginner deck. It is less suited to complete beginners, because guessing a missing word in a sentence where you know few of the other words is slow going.' },
  { q: 'How much does Clozemaster Pro cost?', a: 'On 23 November 2026 the Pro page showed €15.72 a month or €78.64 a year to us in Europe, with a Black Friday offer of €39.32 for the first year. Prices vary by country and app store, so check the Pro page for yours. The yearly plan has a 30-day money-back guarantee; monthly plans are not refundable.' },
  { q: 'Is Clozemaster free?', a: 'Partly. Clozemaster’s Spanish collection page says a free account can play up to 30 sentences a day. Pro removes the daily limit and adds unlimited listening practice, offline mode and custom review settings.' },
  { q: 'Is there a Clozemaster-style deck for Anki?', a: 'Yes. 9000 Spanish Sentences on AnkiWeb is free, uses cloze deletions, and its author describes it as similar to Clozemaster’s Fluency Fast Track. Every sentence has native audio from a speaker in central Spain.' },
  { q: 'Should I use Clozemaster or Anki?', a: 'Use Anki if you want one review system for everything and to pay once or nothing. Use Clozemaster if you like its game format and want huge sentence collections ready to play. Many learners do the first 1,000 to 1,500 words as flashcards, then switch to cloze sentences.' },
]

const schemas = compareSchemas({ slug: SLUG, title: TITLE, description: DESC, faq: FAQ })

export default function ClozemasterAlternative() {
  return (
    <div className="cl cl-home">
      <CompareJsonLd schemas={schemas} />

      <CompareHero
        title="Clozemaster alternative"
        soft="Pay once, keep it in Anki"
        answer={
          <>
            <p>Clozemaster is great for reading lots of Spanish sentences, but the free plan stops at 30 sentences a day and Pro is a subscription (€15.72 a month or €78.64 a year in our region on 23 November 2026).</p>
            <p>The best Clozemaster alternatives for Spanish: <b>9000 Spanish Sentences</b>, a free Anki cloze deck with native audio, and the <b>Top 1,500 Anki deck</b> for €9 once, which teaches the most common words first, each with a sentence and native audio.</p>
          </>
        }
      />

      <CompareSection title="Clozemaster vs Top 1,500" lead="Different tools for different stages. Clozemaster facts are from its Pro and Spanish collection pages.">
        <CompareTable head={['', 'Clozemaster', 'Top 1,500 (ours)']} rows={ROWS} usCol={2} />
        <p className="ct-note">The honest read: Clozemaster has roughly six times as many Spanish sentences, and Pro unlocks 50+ languages. If you are already past 1,500 words, that matters more than our price.</p>
      </CompareSection>

      <CompareSection title="When an alternative makes sense">
        <CompareProse>
          <ul>
            <li><b>You are a beginner.</b> Cloze works when you know most of the sentence. Below about 1,000 words, most sentences are full of unknowns. Learn the most common words first, then cloze becomes fast.</li>
            <li><b>You already use Anki.</b> One app, one review queue. No second streak to keep alive.</li>
            <li><b>You dislike subscriptions.</b> A one-time deck keeps working after you stop paying, because you never started.</li>
            <li><b>You want it free.</b> 9000 Spanish Sentences gives you the cloze format inside Anki, with native audio, at no cost.</li>
          </ul>
          <h3>When to stay with Clozemaster</h3>
          <p>If you are intermediate, like the game format, and want thousands of sentences across several languages, Clozemaster Pro is good value for that job. Nothing on this page replaces its sheer volume.</p>
        </CompareProse>
        <p className="ct-note">More decks compared in <Link href="/best-spanish-anki-decks">the best Spanish Anki decks</Link>.</p>
        <CompareRelated />
      </CompareSection>

      <CompareFaq faq={FAQ} />

      <CompareSources sources={[
        ['Clozemaster: Pro plans and pricing', SRC.pro],
        ['Clozemaster: Spanish 10,000 Most Common collection', SRC.coll],
        ['AnkiWeb: 9000 Spanish sentences, difficulty sorted with native audio', SRC.sent9000],
      ]} />

      <CompareEnd title="Learn the first 1,500 words" soft="Then cloze gets easy" />
    </div>
  )
}
