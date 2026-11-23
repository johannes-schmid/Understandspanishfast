import Link from 'next/link'
import ReaderProductPage, { readStories } from '@/components/ReaderProductPage'

const PAGE_URL = 'https://mostcommonspanish.com/spanish-short-stories-for-beginners'
const TITLE = 'Spanish Short Stories for Beginners: 10 Stories + Audio'
const DESC = '10 short stories for adult beginners, written only with the 500 most common Spanish words. PDF book with questions, plus an MP3 of every story read by a native speaker. €9.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESC, url: PAGE_URL, type: 'website', images: ['https://mostcommonspanish.com/readers/cover.webp'] },
}

const data = readStories(1)

export default function ShortStories() {
  return (
    <ReaderProductPage
      c={{
        data,
        url: PAGE_URL,
        limit: 500,
        price: 9,
        product: 'readers-500',
        cover: '/readers/cover.webp',
        coverAlt: 'Cover of Diez historias: a pop-up city rising from an open book, one lit window for each of the ten stories',
        schemaName: 'Diez historias: 10 Spanish Short Stories for Beginners (Level 1, Top 500 Words)',
        schemaDesc: '10 graded short stories for adult learners written with the 500 most common Spanish words: PDF book with comprehension questions and answer key, plus an MP3 of each story read by a native speaker from Spain.',
        h1: 'Spanish short stories for beginners',
        h1Soft: 'Written with 500 words',
        lead: 'Ten stories about adult life, built only from the 500 most common Spanish words. Read them in the PDF, then hear every one read by a native speaker.',
        sample: '/readers/la-carta-de-papa',
        sampleBlurb: 'A man in his forties gets a letter from the father who walked out twenty years ago. Listen to the first story, or download it as a PDF.',
        storiesLead: 'Money, work, family and second chances. Each one has a turn, and none of them is a textbook dialogue.',
        checkLinks: <>Learning the list? Start with the <Link href="/words/top-500-spanish-words">top 500 Spanish words</Link>, or the <Link href="/anki-spanish-deck">Anki deck</Link> that teaches them in order. Know them already? Go on to the <Link href="/spanish-short-stories-intermediate">Level 2 stories</Link>.</>,
        pageImage: '/readers/story-page.webp',
        pageAlt: 'First page of story 2, Lo que no es mío, with margin notes for autobús and cartera',
        steps: [
          ['Read', 'Read the story once without stopping. Follow the plot, not every word.'],
          ['Listen', 'Read it again with the MP3, following the text while Javier reads.'],
          ['Answer', 'Five questions in simple Spanish after each story. The key is at the back.'],
          ['Listen again', 'A day later, play the track without the text. On a walk is fine.'],
        ],
        faq: [
          { q: 'What level are these stories?', a: 'Beginner, around A1 to A2. Every story is built from the 500 most common Spanish words. If you know most of them, or are working through them, you can read these.' },
          { q: 'What do I get?', a: `One download: a PDF book with all 10 stories, questions and an answer key, plus 10 MP3 files, one per story. ${data.totalWords.toLocaleString('en')} words of Spanish in total and ${data.audioMin} minutes of audio.` },
          { q: 'Who reads the audio?', a: 'Javier, a male voice with a Spain accent, read slightly slower than normal conversation. The text is neutral Spanish that works in Spain and Latin America.' },
          { q: 'Are these stories for children?', a: 'No. They are about adult life: money, work, family, a father who left, an ex at a job interview, a retirement that drives a marriage up the wall. Simple words, real situations.' },
          { q: 'How do you know the words are simple?', a: `A script checks every word against our frequency list, after turning each form into its dictionary form (pudo counts as poder). At least ${data.minCoverage}% of each story comes from the top 500. The few words outside the list are explained in the margin.` },
          { q: 'Is there a next level?', a: 'Yes. Level 2 has ten longer stories built from the top 1,500 words, with more tenses and longer sentences.' },
          { q: 'Can I get a refund?', a: 'Yes. Email us within 14 days of your purchase for a full refund.' },
        ],
        footer: <>See all products in the <Link href="/shop">shop</Link>.</>,
      }}
    />
  )
}
