import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import LevelTest from './pages/LevelTest'
import WordsPage from './pages/WordsPage'
import BlogHub from './pages/BlogHub'
import Post100Words from './pages/posts/Post100Words'
import PostCracking1500 from './pages/posts/PostCracking1500'
import PostHowManyWords from './pages/posts/PostHowManyWords'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/level-test" element={<LevelTest />} />
        <Route path="/words/most-common-spanish-words" element={<WordsPage />} />
        <Route path="/blog" element={<BlogHub />} />
        <Route path="/blog/the-power-of-the-first-100-words" element={<Post100Words />} />
        <Route path="/blog/cracking-the-1500" element={<PostCracking1500 />} />
        <Route path="/blog/how-many-spanish-words-to-be-fluent" element={<PostHowManyWords />} />
      </Routes>
      <Footer />
    </>
  )
}
