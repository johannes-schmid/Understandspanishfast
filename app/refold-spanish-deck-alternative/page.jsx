import Link from 'next/link'
import {
  compareMeta, compareSchemas, CompareJsonLd, CompareHero, CompareSection, CompareTable,
  CompareProse, CompareFaq, CompareSources, CompareEnd, CompareRelated,
} from '@/components/CompareBlocks'

const SLUG = 'refold-spanish-deck-alternative'
const TITLE = 'Refold Spanish Deck Alternative: ES1K vs Top 1,500'
const DESC = 'Refold’s Spanish ES1K deck costs $29.99 for 1,000 words. Here is how it compares to a €9 deck of the 1,500 most common words, and who should buy which.'

export async function generateMetadata() {
  return compareMeta({ slug: SLUG, title: TITLE, description: DESC })
}

const SRC = {
  refold: 'https://refold.la/decks/buy/fundamental-vocabulary-to-learn-spanish',
  top5000: 'https://ankiweb.net/shared/info/241428882',
  sent9000: 'https://ankiweb.net/shared/info/1713698257',
}

const ROWS = [
  ['Price', '$29.99 once, or $9/month', '€9 once'],
  ['Words', '1,000', '1,500'],
  ['Word selection', 'Davies top 5,000 minus cognates and easy words', 'Top 1,500 by frequency, nothing removed'],
  ['Native audio', true, 'Word + sentence'],
  ['Example sentences', 'Written by Spanish teachers', true],
  ['Sentences built to add one new word at a time', 'Over 90%, per Refold', false],
  ['Pictures', true, 'About 1,200 words'],
  ['Refund policy', '30-day money back', 'Free 100-word sample first'],
]

const FAQ = [
  { q: 'Is the Refold Spanish deck worth it?', a: 'If you are following the Refold method and immersing for hours a day, it is a well-made deck: native audio, pictures, teacher-written sentences, and an order where most sentences add only one new word. At $29.99 for 1,000 words it is not cheap, and it leaves out cognates and easy words on purpose, which assumes you pick those up from TV and reading.' },
  { q: 'What is the Refold ES1K deck?', a: 'ES1K is Refold’s name for its Fundamental Vocabulary to Learn Spanish deck. Refold started from Mark Davies’ 5,000-word frequency list, removed over 3,700 words it considers easy to learn through immersion, and kept the 1,000 that do the most work.' },
  { q: 'Is there a free alternative to Refold’s Spanish deck?', a: 'Yes. Spanish Top 5000 Vocabulary on AnkiWeb is free, in frequency order, with pictures and audio, but no example sentences and last updated in 2017. 9000 Spanish Sentences is a free sentence deck with native audio. You trade money for cleanup time.' },
  { q: 'Why does Refold remove cognates?', a: 'Words like información or problema are easy for English speakers to recognise, so Refold expects you to absorb them through immersion and spends its 1,000 cards on harder words. That works well if you watch and read a lot. If you are a true beginner, learning the most common words in plain order, cognates included, gets you to basic comprehension with less guessing.' },
  { q: 'Can I use Refold ES1K and another frequency deck together?', a: 'Yes, but expect overlap. Both start from frequency, so most of Refold’s 1,000 words also appear in any top-1,500 or top-5,000 list. Suspend duplicates in one deck rather than reviewing them twice.' },
]

const schemas = compareSchemas({ slug: SLUG, title: TITLE, description: DESC, faq: FAQ })

export default function RefoldAlternative() {
  return (
    <div className="cl cl-home">
      <CompareJsonLd schemas={schemas} />

      <CompareHero
        title="Refold Spanish deck alternative"
        soft="ES1K vs the Top 1,500"
        answer={
          <>
            <p>Refold’s Spanish deck (ES1K) is a good deck: 1,000 hand-picked words, native audio, pictures and teacher-written sentences, for <b>$29.99</b> or as part of a $9/month subscription. It deliberately skips cognates and easy words, so it is built for learners who immerse a lot.</p>
            <p>If you want a cheaper alternative that keeps <b>every common word in plain frequency order</b>, the Top 1,500 Anki deck has 1,500 words with example sentences and native audio for <b>€9 once</b>.</p>
          </>
        }
      />

      <CompareSection title="Refold ES1K vs Top 1,500" lead="Two frequency decks with different philosophies. Refold facts are from its store page.">
        <CompareTable head={['', 'Refold ES1K', 'Top 1,500 (ours)']} rows={ROWS} usCol={2} />
      </CompareSection>

      <CompareSection title="Where Refold is better">
        <CompareProse>
          <p>Credit where it is due. Refold put real craft into this deck.</p>
          <ul>
            <li><b>Sentence order.</b> Refold says over 90% of its example sentences introduce only one new word. That is the i+1 idea done carefully, and we do not claim the same for ours.</li>
            <li><b>Hand-written sentences.</b> Spanish teachers wrote them, so they read naturally.</li>
            <li><b>Subscription option.</b> $9 a month opens every Refold deck online. Useful if you learn more than one language.</li>
            <li><b>Refund.</b> A 30-day money-back guarantee lowers the risk of $29.99.</li>
          </ul>
          <h3>Where the Top 1,500 is better</h3>
          <ul>
            <li><b>Price per word.</b> €9 for 1,500 words against $29.99 for 1,000.</li>
            <li><b>Nothing cut.</b> Refold removes 3,700 words from its source list and expects immersion to fill the gap. A beginner who is not yet watching much Spanish still meets those words every day, so we keep them, in order.</li>
            <li><b>Audio on both sides.</b> Every card has native audio for the word and for the example sentence.</li>
            <li><b>Try before paying.</b> The first 100 words are a free download, same format as the full deck.</li>
          </ul>
          <p>Short version: Refold if you are deep in immersion and want the hard words only. Top 1,500 if you are earlier on and want the most useful words first, cheaply. Both are fine choices. Neither is magic.</p>
        </CompareProse>
        <p className="ct-note">Comparing more options? See <Link href="/best-spanish-anki-decks">the best Spanish Anki decks</Link>, ranked with free decks included.</p>
        <CompareRelated />
      </CompareSection>

      <CompareFaq faq={FAQ} />

      <CompareSources sources={[
        ['Refold: Fundamental Vocabulary to Learn Spanish (ES1K)', SRC.refold],
        ['AnkiWeb: Spanish Top 5000 Vocabulary', SRC.top5000],
        ['AnkiWeb: 9000 Spanish sentences, difficulty sorted with native audio', SRC.sent9000],
      ]} />

      <CompareEnd title="The 1,500 most common words" soft="In order, for €9" />
    </div>
  )
}
