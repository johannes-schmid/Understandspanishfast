import Link from 'next/link'
import {
  compareMeta, compareSchemas, CompareJsonLd, CompareHero, CompareSection, CompareTable,
  CompareProse, CompareFaq, CompareSources, CompareEnd, CompareRelated,
} from '@/components/CompareBlocks'

const SLUG = 'lingvist-alternative'
const TITLE = 'Lingvist Alternative for Spanish: No Subscription Needed'
const DESC = 'Lingvist costs €9.99 a month or €79.99 a year. Want Spanish vocabulary without a subscription? An honest comparison and a €9 one-time alternative.'

export async function generateMetadata() {
  return compareMeta({ slug: SLUG, title: TITLE, description: DESC })
}

const SRC = {
  pricing: 'https://lingvist.com/pricing/',
  size: 'https://lingvist.com/help/how-large-is-the-course/',
  top5000: 'https://ankiweb.net/shared/info/241428882',
}

const ROWS = [
  ['Price', '€9.99/month or €79.99/year', '€9 once'],
  ['Free trial', '14 days (annual plan)', '100-word sample, keep it'],
  ['Spanish words', '5,945 (Spain), 5,000 (Latin America)', '1,500'],
  ['Choose Spain or Latin America', true, false],
  ['Ready to study with no setup', true, 'Import into Anki'],
  ['Yours after you stop paying', false, true],
]

const FAQ = [
  { q: 'How much does Lingvist cost?', a: 'On 23 November 2026 Lingvist’s pricing page showed €9.99 a month or €79.99 a year (about €6.67 a month), with a 14-day free trial on the annual plan. Prices can differ by country and app store.' },
  { q: 'How many words does the Lingvist Spanish course have?', a: 'According to Lingvist’s help centre, the general Spanish course has 5,945 words for European Spanish and 5,000 for Latin American Spanish. That is about four times the 1,500 words in our Anki deck.' },
  { q: 'Is Lingvist free?', a: 'Lingvist offers a free trial before you subscribe. Its pricing page lists a 14-day trial on the annual plan. After the trial, the pricing page lists only the paid monthly and annual plans.' },
  { q: 'Is Lingvist or Anki better for Spanish vocabulary?', a: 'Lingvist is easier: it picks the words, schedules reviews and runs in its own app. Anki is free on desktop and Android, works offline, and lets you keep your decks forever, but you need a deck, either a free shared one or a paid one like the Top 1,500. If you dislike subscriptions, Anki plus a good frequency deck covers the same core job.' },
  { q: 'What is a cheaper alternative to Lingvist?', a: 'The cheapest is a free Anki deck such as Spanish Top 5000 Vocabulary, which has 5,000 frequency-ordered words but no example sentences. The Top 1,500 Anki deck costs €9 once and adds a sentence and native audio for every word, but covers fewer words than Lingvist.' },
]

const schemas = compareSchemas({ slug: SLUG, title: TITLE, description: DESC, faq: FAQ })

export default function LingvistAlternative() {
  return (
    <div className="cl cl-home">
      <CompareJsonLd schemas={schemas} />

      <CompareHero
        title="Lingvist alternative"
        soft="Same idea, no subscription"
        answer={
          <>
            <p>Lingvist is a vocabulary app with a Spanish course of about 5,945 words (Spain) or 5,000 (Latin America). It costs <b>€9.99 a month or €79.99 a year</b>, with a 14-day trial on the annual plan.</p>
            <p>If you want frequency-ranked Spanish vocabulary without a subscription, the <b>Top 1,500 Anki deck</b> costs €9 once: the 1,500 most common words with example sentences and native audio. It covers fewer words than Lingvist, and it runs in Anki (free on desktop and Android).</p>
          </>
        }
      />

      <CompareSection title="Lingvist vs Top 1,500" lead="Lingvist facts from its pricing page and help centre, checked 23 November 2026.">
        <CompareTable head={['', 'Lingvist', 'Top 1,500 (ours)']} rows={ROWS} usCol={2} />
      </CompareSection>

      <CompareSection title="The honest trade-off">
        <CompareProse>
          <h3>Where Lingvist wins</h3>
          <ul>
            <li><b>More words.</b> Nearly 6,000 in the European course, four times our 1,500.</li>
            <li><b>No setup.</b> Download the app and start. Anki needs installing and a deck importing.</li>
            <li><b>Regional choice.</b> Separate courses for Spain and Latin America.</li>
          </ul>
          <h3>Where the Top 1,500 wins</h3>
          <ul>
            <li><b>Cost over time.</b> One year of Lingvist is €79.99. Our deck is €9 once. The first 1,500 words cover roughly 80% of everyday Spanish, which is where most of the value sits.</li>
            <li><b>You keep it.</b> The .apkg file is yours. Stop studying for a month and nothing expires.</li>
            <li><b>Your scheduler, your rules.</b> Anki lets you change how many new cards you see, edit any card, and add your own.</li>
          </ul>
          <p>If a subscription keeps you showing up every day, Lingvist is a reasonable choice. If you already know you will use Anki, paying monthly for a word list is hard to justify.</p>
        </CompareProse>
        <p className="ct-note">Prefer to stay free? See <Link href="/best-spanish-anki-decks">the best Spanish Anki decks</Link>, including three free ones.</p>
        <CompareRelated />
      </CompareSection>

      <CompareFaq faq={FAQ} />

      <CompareSources sources={[
        ['Lingvist: Pricing', SRC.pricing],
        ['Lingvist help centre: How large is the course?', SRC.size],
        ['AnkiWeb: Spanish Top 5000 Vocabulary', SRC.top5000],
      ]} />

      <CompareEnd title="Frequency-first Spanish" soft="Without the monthly bill" />
    </div>
  )
}
