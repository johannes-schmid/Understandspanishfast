import LevelTestClient from '@/components/LevelTestClient'
import { words } from '@/data/words'

const pool = words.map(({ rank, word }) => ({ rank, word }))

export const metadata = {
  title: 'Check Your Spanish Level — Word Reach Test',
  description: 'Take the 2-minute Word Reach test to find your Spanish vocabulary level and see how much everyday Spanish you already understand.',
  alternates: { canonical: 'https://mostcommonspanish.com/level-test' },
}

export default function LevelTest() {
  return <LevelTestClient pool={pool} />
}
