import LevelTestClient from '@/components/LevelTestClient'

export const metadata = {
  title: 'Check Your Spanish Level — Word Reach Test',
  description: 'Take the 2-minute Word Reach test to find your Spanish vocabulary level and see what content you can unlock.',
  alternates: { canonical: 'https://mostcommonspanish.com/level-test' },
}

export default function LevelTest() {
  return <LevelTestClient />
}
