import Link from 'next/link'

export default function SourceNote({ children }) {
  return (
    <>
      {children || 'Share of words in everyday spoken Spanish you’ll recognise after learning the top N.'}{' '}
      Estimates from spoken-Spanish frequency data (film and TV subtitles).{' '}
      <Link href="/words/spanish-frequency-list" className="tlink">How the list is built</Link>
    </>
  )
}
