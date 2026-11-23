import Link from 'next/link'
import {
  compareMeta, compareSchemas, CompareJsonLd, CompareHero, CompareSection, CompareTable,
  CompareProse, CompareFaq, CompareSources, CompareEnd, CompareRelated,
} from '@/components/CompareBlocks'

const SLUG = 'spanish-top-5000-anki-deck-alternative'
const TITLE = 'Spanish Top 5000 Vocabulary Anki: Review + Alternative'
const DESC = 'An honest review of the Spanish Top 5000 Vocabulary Anki deck: what it does well, what reviewers complain about, and the alternatives with example sentences.'

export async function generateMetadata() {
  return compareMeta({ slug: SLUG, title: TITLE, description: DESC })
}

const SRC = {
  top5000: 'https://ankiweb.net/shared/info/241428882',
  sent9000: 'https://ankiweb.net/shared/info/1713698257',
  refold: 'https://refold.la/decks/buy/fundamental-vocabulary-to-learn-spanish',
}

const ROWS = [
  ['Price', 'Free', '€9 once'],
  ['Words', '5,000', '1,500'],
  ['Order', 'Frequency', 'Frequency'],
  ['Audio', 'Word, 4,881 clips', 'Native, word + sentence'],
  ['Example sentence per word', false, true],
  ['Pictures', 'All 5,000', 'About 1,200'],
  ['Cards per word', '2 (both directions)', '2 (both directions)'],
  ['Last updated', 'October 2017', 'November 2026'],
  ['Download size', '75.86 MB', '152 MB'],
]

const FAQ = [
  { q: 'Is the Spanish Top 5000 Vocabulary Anki deck good?', a: 'For a free deck, yes in many ways. It has 5,000 words in frequency order with a picture on every note, audio on almost all of them, and both card directions. Its weak points are age (last updated in 2017), no example sentences, and pictures and definitions that some reviewers call offensive or wrong.' },
  { q: 'How long does it take to finish the Top 5000 deck?', a: 'At 20 new words a day, 5,000 words take about 250 days, plus reviews. One AnkiWeb reviewer reported about 60 hours of study to get through all the cards. Most people never reach the end, which is fine: the first 1,500 to 2,000 words do most of the work.' },
  { q: 'Does the Spanish Top 5000 deck have audio?', a: 'Yes. The AnkiWeb listing shows 4,881 audio files for 5,000 notes. The description says the accent is either general European or general American Spanish. The audio is for the word only, since the notes have no example sentence.' },
  { q: 'Is the Top 5000 deck safe for work?', a: 'Not entirely. Several 2025 and 2026 reviews on AnkiWeb mention offensive or explicit pictures on a few cards. The author notes that pictures were picked automatically from search and reviewed later. If that matters to you, plan to check cards as they come up or hide the picture field.' },
  { q: 'What should I use after the first 1,000 or 2,000 words?', a: 'Move to sentences. 9000 Spanish Sentences is a free AnkiWeb deck with native audio for every sentence, sorted from easy to hard. Watching and reading real Spanish also starts to pay off around this point.' },
]

const schemas = compareSchemas({ slug: SLUG, title: TITLE, description: DESC, faq: FAQ })

export default function Top5000Alternative() {
  return (
    <div className="cl cl-home">
      <CompareJsonLd schemas={schemas} />

      <CompareHero
        title="Spanish Top 5000 Anki deck"
        soft="Review and alternative"
        answer={
          <>
            <p>The Spanish Top 5000 Vocabulary Anki deck is the most popular free option for a reason: 5,000 words in frequency order, a picture on every note, audio on 4,881 of them. It is still worth using if you want free and big.</p>
            <p>The catch: it was last updated in 2017, has <b>no example sentences</b>, and recent reviews flag offensive pictures and wrong definitions. If you want every word in a sentence with native audio, the <b>Top 1,500 deck</b> (€9) is the alternative. If you want to stay free, pair Top 5000 with <b>9000 Spanish Sentences</b>.</p>
          </>
        }
      />

      <CompareSection title="Top 5000 vs Top 1,500" lead="The free deck wins on size and price. The paid one wins on context and freshness. Facts from the AnkiWeb listing.">
        <CompareTable head={['', 'Spanish Top 5000', 'Top 1,500 (ours)']} rows={ROWS} usCol={2} />
      </CompareSection>

      <CompareSection title="Our honest review">
        <CompareProse>
          <h3>What it gets right</h3>
          <ul>
            <li><b>Frequency order.</b> The most useful words come first, which is the single biggest thing most themed decks get wrong.</li>
            <li><b>Size for free.</b> 5,000 words takes you well past the point where everyday Spanish starts to make sense.</li>
            <li><b>Pictures on everything.</b> One AnkiWeb reviewer called the images incredibly helpful, and pictures do make meanings stick.</li>
            <li><b>Grammar tags.</b> Nouns are marked by gender (nm, nf), so you learn <i>el clima</i>, not just <i>clima</i>.</li>
          </ul>
          <h3>What holds it back</h3>
          <ul>
            <li><b>No sentences.</b> Each note is word, picture, English, audio and rank. You learn that <i>quedar</i> means one thing, then meet it in five other meanings in real speech.</li>
            <li><b>Not maintained.</b> The listing says updated October 2017. Errors reported since then are still in the deck.</li>
            <li><b>Pictures chosen by search.</b> The author says so in the description. A handful are explicit or offensive, which is what most negative reviews in 2025 and 2026 are about.</li>
            <li><b>Mixed ratings.</b> 483 thumbs up and 99 down at the time of writing. That is still a good ratio, but the recent reviews skew negative.</li>
          </ul>
          <p>Our take: if you are disciplined and on a zero budget, it is fine. Suspend the cards you dislike and add a sentence deck after word 1,000. If you would rather spend €9 than an evening of cleanup, use a deck with sentences from the start.</p>
        </CompareProse>
      </CompareSection>

      <CompareSection title="Alternatives worth a look" lead="Three honest options, depending on what bothers you about Top 5000.">
        <div className="faq">
          <div className="card faq-item">
            <h3>Want sentences and fresh audio: Top 1,500</h3>
            <p>1,500 words in rank order, each with an example sentence, translation and native audio for word and sentence. Fewer words than Top 5000, by a lot. <Link href="/anki-spanish-deck">See the deck</Link>.</p>
          </div>
          <div className="card faq-item">
            <h3>Want to stay free: 9000 Spanish Sentences</h3>
            <p>Free on AnkiWeb, 9,263 sentences with native audio from one speaker in central Spain, easy to hard. Best after your first 1,000 words. <a href={SRC.sent9000} rel="nofollow noopener" target="_blank">AnkiWeb listing</a>.</p>
          </div>
          <div className="card faq-item">
            <h3>Watch a lot of Spanish already: Refold ES1K</h3>
            <p>1,000 hand-picked words with teacher-written sentences and native audio, $29.99. It skips cognates on purpose, so it suits learners doing lots of immersion. <a href={SRC.refold} rel="nofollow noopener" target="_blank">Refold page</a>.</p>
          </div>
        </div>
        <p className="ct-note">See all six decks ranked in <Link href="/best-spanish-anki-decks">the best Spanish Anki decks</Link>.</p>
        <CompareRelated />
      </CompareSection>

      <CompareFaq faq={FAQ} />

      <CompareSources sources={[
        ['AnkiWeb: Spanish Top 5000 Vocabulary (listing, description and reviews)', SRC.top5000],
        ['AnkiWeb: 9000 Spanish sentences, difficulty sorted with native audio', SRC.sent9000],
        ['Refold: Fundamental Vocabulary to Learn Spanish (ES1K)', SRC.refold],
      ]} />

      <CompareEnd title="Keep the frequency order" soft="Add the sentences" />
    </div>
  )
}
