import Link from 'next/link'
import {
  compareMeta, compareSchemas, CompareJsonLd, CompareHero, CompareSection, CompareTable,
  CompareRanked, CompareProse, CompareFaq, CompareSources, CompareEnd, CompareRelated, SAMPLE_URL,
} from '@/components/CompareBlocks'

const SLUG = 'best-spanish-anki-decks'
const TITLE = 'Best Spanish Anki Decks (2026): 6 Compared Honestly'
const DESC = 'The best Spanish Anki decks compared: Top 5000, Refold ES1K, 9000 Sentences, Language Atlas, Doozan 6001 and ours. Prices, audio, word counts compared.'

export async function generateMetadata() {
  return compareMeta({ slug: SLUG, title: TITLE, description: DESC })
}

const SRC = {
  top5000: 'https://ankiweb.net/shared/info/241428882',
  sent9000: 'https://ankiweb.net/shared/info/1713698257',
  refold: 'https://refold.la/decks/buy/fundamental-vocabulary-to-learn-spanish',
  atlas625: 'https://languageatlas.com/anki/625-most-common-spanish-words-anki/',
  atlasA1: 'https://languageatlas.com/complete-spanish-a1-anki-deck/',
  doozan: 'https://github.com/doozan/6001_Spanish',
}

const Ext = ({ href, children }) => <a className="ct-inline" href={href} rel="nofollow noopener" target="_blank">{children}</a>

const DECKS = [
  {
    id: 'top-5000',
    name: 'Spanish Top 5000 Vocabulary',
    bestFor: 'Best free deck for raw word count',
    price: 'Free',
    priceNote: 'on AnkiWeb',
    url: SRC.top5000,
    body: 'The classic. 5,000 words in frequency order, a picture on every note, audio on 4,881 of them, and both card directions. Nothing else free comes close on size, which is why it shows up in every Reddit thread.',
    cons: 'Last updated in 2017. Notes have the word, a picture and the translation, but no example sentence. Recent AnkiWeb reviews flag offensive pictures and some wrong definitions.',
    link: <Ext href={SRC.top5000}>AnkiWeb listing</Ext>,
  },
  {
    id: 'top-1500',
    name: 'Top 1,500 Spanish Words (this site)',
    bestFor: 'Best for beginners who want sentences and audio',
    price: '€9',
    priceNote: 'one-time',
    url: 'https://mostcommonspanish.com/anki-spanish-deck',
    body: 'Our deck, so weigh this entry accordingly. 1,500 words in strict frequency order, each with an example sentence and translation, native audio for the word and the sentence, and pictures on about 1,200 words. Built in November 2026.',
    cons: 'It stops at 1,500 words. The free decks above and below have three to four times as many. It costs money, and you can get far with free decks if you are willing to clean them up.',
    link: <><Link className="ct-inline" href="/anki-spanish-deck">Product page</Link> or the <a className="ct-inline" href={SAMPLE_URL} download>free 100-word sample</a></>,
  },
  {
    id: 'refold',
    name: 'Refold ES1K (Fundamental Vocabulary)',
    bestFor: 'Best curated deck for immersion learners',
    price: '$29.99',
    priceNote: 'one-time, or $9/month for all Refold decks',
    url: SRC.refold,
    body: 'Refold started from Mark Davies’ 5,000-word frequency list and cut over 3,700 words you would pick up anyway (cognates, derivations), leaving 1,000. Native audio, pictures, and example sentences written by Spanish teachers. Refold says over 90% of sentences introduce only one new word.',
    cons: 'Only 1,000 words, and by design it skips the easy ones, so it assumes you are watching and reading a lot of Spanish alongside it. Roughly three times our price for fewer words.',
    link: <Ext href={SRC.refold}>Refold store page</Ext>,
  },
  {
    id: '9000-sentences',
    name: '9000 Spanish Sentences (native audio)',
    bestFor: 'Best free sentence deck after your first 1,000 words',
    price: 'Free',
    priceNote: 'on AnkiWeb',
    url: SRC.sent9000,
    body: '9,263 Tatoeba sentences, each with audio recorded by one native speaker from central Spain, sorted from easy to hard by their rarest word. Cards work as cloze deletions, close to how Clozemaster plays.',
    cons: 'No pictures. Last updated in 2019. Reviewers mention translation slips and sentences where the subject of a verb is unclear. Hard going as a first deck.',
    link: <Ext href={SRC.sent9000}>AnkiWeb listing</Ext>,
  },
  {
    id: 'language-atlas',
    name: 'Language Atlas Spanish decks',
    bestFor: 'Best if you want a choice of Spain or Latin American Spanish',
    price: '€29.99',
    priceNote: 'for the 625-word deck (sale price)',
    url: SRC.atlas625,
    body: 'The 625-word deck has 1,250 cards, a picture on each, every word in a sentence with translation, IPA and audio, in a European or Latin American version. The Complete A1 deck adds grammar for €49.99.',
    cons: 'Expensive per word: 625 words for €29.99. The product page does not say whether the audio is a native speaker or text-to-speech.',
    link: <><Ext href={SRC.atlas625}>625-word deck</Ext> and <Ext href={SRC.atlasA1}>Complete A1 deck</Ext></>,
  },
  {
    id: 'doozan-6001',
    name: 'Jeff Doozan’s 6001 Spanish',
    bestFor: 'Best for tinkerers who want 6,000 words with sentences',
    price: 'Free',
    priceNote: 'open data, CC BY 4.0',
    url: SRC.doozan,
    body: 'The 6,001 most frequent Spanish words with audio, Wiktionary definitions and Tatoeba example sentences. Open data under a Creative Commons licence, so you can rebuild and fix it yourself.',
    cons: 'The public GitHub repo holds the build files, last changed in March 2022. We could not find a current ready-to-import download on AnkiWeb, so expect to build it with Python or hunt for a shared copy.',
    link: <Ext href={SRC.doozan}>GitHub repo</Ext>,
  },
]

const HEAD = ['Deck', 'Words', 'Audio', 'Example sentences', 'Pictures', 'Price', 'Last updated']
const ROWS = [
  ['Spanish Top 5000', '5,000', '4,881 clips', false, true, 'Free', '2017'],
  ['Top 1,500 (ours)', '1,500', 'Native, word + sentence', true, '~1,200 words', '€9', '2026'],
  ['Refold ES1K', '1,000', 'Native', true, true, '$29.99', 'Not stated'],
  ['9000 Sentences', '9,263 sentences', 'Native, sentence', true, false, 'Free', '2019'],
  ['Language Atlas 625', '625', 'Type not stated', true, true, '€29.99', 'Not stated'],
  ['Doozan 6001', '6,001', 'Yes, source not stated', true, false, 'Free', 'Repo: 2022'],
]

const PICKS = [
  ['Complete beginner, wants it done for you', 'Top 1,500 (ours) or Refold ES1K. Ours if you want every common word in order. Refold if you already immerse a lot and want to skip the easy ones.'],
  ['Zero budget', 'Spanish Top 5000 for words, then 9000 Sentences for context. Budget an hour to suspend cards you do not like.'],
  ['Past 1,000 words and bored of single words', '9000 Sentences. Sentence cards with native audio are the natural next step.'],
  ['Cares about Spain vs Latin America', 'Language Atlas, the only deck here that sells both versions.'],
  ['Likes to customise everything', 'Doozan 6001. Open data, open code, 6,000 words with sentences.'],
]

const FAQ = [
  { q: 'What is the best Spanish Anki deck?', a: 'There is no single best one. For a free deck, Spanish Top 5000 Vocabulary has the most words and pictures. For a beginner who wants example sentences and native audio in frequency order, a paid deck like the Top 1,500 (€9) or Refold ES1K ($29.99) saves the cleanup work. After about 1,000 words, add a sentence deck like 9000 Spanish Sentences.' },
  { q: 'Is there a Spanish Anki deck with audio?', a: 'Yes, all six decks on this page include audio. Spanish Top 5000 has 4,881 clips. 9000 Spanish Sentences has native audio for every sentence. Refold ES1K and the Top 1,500 deck have native audio, and the Top 1,500 deck has it for both the word and the example sentence.' },
  { q: 'How many Spanish words should I learn in Anki per day?', a: 'Ten to twenty new words a day is a sustainable pace for most people. At 15 a day you finish 1,500 words in about 100 days. Remember that every new card creates reviews for weeks, so a jump to 50 new cards a day usually ends in a review pile you abandon.' },
  { q: 'Is Anki good for learning Spanish?', a: 'Anki is very good for vocabulary, which is the part of Spanish that holds most learners back. It does not teach grammar, listening at speed or speaking. Use it for 15 to 30 minutes a day next to real input like podcasts and TV.' },
  { q: 'Should I use a frequency deck or make my own cards?', a: 'Start with a frequency deck. The top 1,000 words make up most of everyday speech, and a ready deck gets you there without hours of card building. Once you read and watch real Spanish, add your own cards for words you meet in context.' },
  { q: 'Are free Spanish Anki decks good enough?', a: 'Often, yes. Spanish Top 5000 and 9000 Spanish Sentences have helped a lot of people. The trade-off is time: older free decks have errors, missing sentences or pictures you may not want, and you fix those yourself.' },
]

const schemas = compareSchemas({
  slug: SLUG, title: TITLE, description: DESC, faq: FAQ,
  itemList: { name: 'Best Spanish Anki decks', items: DECKS.map(({ name, url }) => ({ name, url })) },
})

export default function BestSpanishAnkiDecks() {
  return (
    <div className="cl cl-home">
      <CompareJsonLd schemas={schemas} />

      <CompareHero
        title="Best Spanish Anki decks"
        soft="Six compared honestly"
        answer={
          <>
            <p>The best Spanish Anki deck depends on your budget and level. <b>Spanish Top 5000 Vocabulary</b> is the best free deck if you want the most words, though it has no example sentences and was last updated in 2017. For a beginner who wants a Spanish Anki deck with audio, example sentences and strict frequency order, a paid deck such as our <b>Top 1,500</b> (€9) or <b>Refold ES1K</b> ($29.99) saves hours of cleanup.</p>
            <p>After about 1,000 words, add <b>9000 Spanish Sentences</b> (free, native audio).</p>
          </>
        }
      />

      <CompareSection title="All six side by side" lead="Word counts, audio and dates come from each deck’s own listing. Where a listing does not say, neither do we.">
        <CompareTable head={HEAD} rows={ROWS} usRow={1} wide />
        <p className="ct-note">One more thing worth knowing: two cards per word is normal. Spanish Top 5000 makes about 10,000 cards from its 5,000 notes, and our deck makes 3,000 from 1,500.</p>
      </CompareSection>

      <CompareSection title="The ranking" lead="Ranked by how much they help a typical English-speaking learner per hour spent. Yes, we put our own deck in there. We also tell you where it loses.">
        <CompareRanked items={DECKS} />
      </CompareSection>

      <CompareSection title="Which one should you pick" lead="Match the deck to where you are, not to the biggest number.">
        <div className="card ct-table-card">
          <table className="ct-table">
            <thead><tr><th scope="col">If you are</th><th scope="col">Pick</th></tr></thead>
            <tbody>
              {PICKS.map(([who, pick]) => <tr key={who}><td style={{ color: 'var(--navy)', fontWeight: 600, width: '34%' }}>{who}</td><td>{pick}</td></tr>)}
            </tbody>
          </table>
        </div>
      </CompareSection>

      <CompareSection title="What makes a Spanish deck good">
        <CompareProse>
          <p>Four things matter more than the deck’s name or its download count.</p>
          <ul>
            <li><b>Frequency order.</b> Learn <i>hablar</i> before <i>hipopótamo</i>. The top 1,000 words carry most of everyday speech, so a deck that front-loads them pays off fastest.</li>
            <li><b>Example sentences.</b> A word on its own is a translation exercise. A word in a sentence shows you how it behaves, and sentence audio trains your ear for real speed.</li>
            <li><b>Native audio.</b> You will hear Spanish long before you read much of it. Check the listing for who recorded the audio.</li>
            <li><b>Someone still maintains it.</b> Decks from 2017 still work, but errors reported since then stay in your collection unless you fix them yourself.</li>
          </ul>
          <p>The honest catch: none of these decks make you understand Spanish on their own. They make the words automatic so that podcasts and TV stop sounding like noise. Pair any of them with <Link href="/words/most-common-spanish-words">the frequency list</Link> to see what you are learning and why.</p>
        </CompareProse>
        <CompareRelated />
      </CompareSection>

      <CompareFaq faq={FAQ} />

      <CompareSources sources={[
        ['AnkiWeb: Spanish Top 5000 Vocabulary', SRC.top5000],
        ['AnkiWeb: 9000 Spanish sentences, difficulty sorted with native audio', SRC.sent9000],
        ['Refold: Fundamental Vocabulary to Learn Spanish (ES1K)', SRC.refold],
        ['Language Atlas: 625 Most Common Spanish Words Anki Deck', SRC.atlas625],
        ['Language Atlas: Complete Spanish A1 Anki Deck', SRC.atlasA1],
        ['GitHub: doozan/6001_Spanish', SRC.doozan],
      ]} />

      <CompareEnd title="Skip the cleanup" soft="1,500 words, ready to study" />
    </div>
  )
}
