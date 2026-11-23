import Link from 'next/link'
import ReaderProductPage, { readStories } from '@/components/ReaderProductPage'

const PAGE_URL = 'https://mostcommonspanish.com/spanish-short-stories-intermediate'
const TITLE = 'Intermediate Spanish Short Stories: 10 Stories + Audio'
const DESC = '10 short stories for adult learners at A2–B1, written with the 1,500 most common Spanish words. PDF book with questions, plus an MP3 of every story read by a native speaker. €9.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/readers/cover-level-2.webp'] },
}

const data = readStories(2)

export default function IntermediateStories() {
  return (
    <ReaderProductPage
      c={{
        data,
        url: PAGE_URL,
        limit: 1500,
        price: 9,
        product: 'readers-1500',
        cover: '/readers/cover-level-2.webp',
        coverAlt: 'Cover of Diez historias Level 2: a pop-up city at sunset rising from an open book, one lit window for each of the ten stories',
        schemaName: 'Diez historias Level 2: 10 Intermediate Spanish Short Stories (Top 1,500 Words)',
        schemaDesc: '10 graded short stories for adult learners at A2–B1, written with the 1,500 most common Spanish words: PDF book with comprehension questions and answer key, plus an MP3 of each story read by a native speaker from Spain.',
        h1: 'Intermediate Spanish short stories',
        h1Soft: 'Written with 1,500 words',
        lead: 'Ten longer stories about adult life, built from the 1,500 words that cover about 80% of everyday Spanish. More tenses, longer sentences, and an MP3 of every story read by a native speaker.',
        sample: '/readers/la-otra-cuenta',
        sampleBlurb: 'After her mother dies, Silvia finds a second bank account and money sent every month to a man she has never heard of. Listen to the first story, or download it as a PDF.',
        storiesLead: 'Inheritances, first dates, a taxi ride with a star, a fake English speaker in London. About 1,100 words each, with a turn in every one.',
        checkLinks: <>Not there yet? The <Link href="/spanish-short-stories-for-beginners">Level 1 stories</Link> use only the top 500 words. Learning the 1,500? The <Link href="/anki-spanish-deck">Anki deck</Link> and <Link href="/workbook">workbook</Link> teach them in the same order.</>,
        pageImage: '/readers/story-page-level-2.webp',
        pageAlt: 'First page of story 2, La casa del pueblo, with the map of the 303 list words the story uses',
        steps: [
          ['Read', 'Read the story once without stopping. Follow the plot, not every word.'],
          ['Listen', 'Read it again with the MP3, following the text while Javier reads.'],
          ['Answer', 'Five questions in Spanish after each story. The key is at the back.'],
          ['Listen again', 'A day later, play the track without the text. On a walk is fine.'],
        ],
        faq: [
          { q: 'What level are these stories?', a: 'Lower intermediate, around A2 to B1. Every story is built from the 1,500 most common Spanish words and uses past, future, conditional and some subjunctive. If you know most of the top 1,500, you can read these.' },
          { q: 'What do I get?', a: `One download: a PDF book with all 10 stories, questions and an answer key, plus 10 MP3 files, one per story. ${data.totalWords.toLocaleString('en')} words of Spanish in total and ${data.audioMin} minutes of audio.` },
          { q: 'Who reads the audio?', a: 'Javier, a male voice with a Spain accent, read slightly slower than normal conversation. The text is neutral Spanish that works in Spain and Latin America.' },
          { q: 'How is this different from Level 1?', a: 'Level 1 uses only the top 500 words, in stories of about 750 words. Level 2 uses the top 1,500, the stories are about 1,100 words, and the grammar goes further.' },
          { q: 'How do you know the words are in the list?', a: `A script checks every word against our frequency list, after turning each form into its dictionary form (pudo counts as poder). At least ${data.minCoverage}% of each story comes from the top 1,500. The few words outside the list are explained in the margin.` },
          { q: 'Can I get a refund?', a: 'Yes. Email us within 14 days of your purchase for a full refund.' },
        ],
        footer: <>See all products in the <Link href="/shop">shop</Link>.</>,
      }}
    />
  )
}
