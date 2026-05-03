import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WordsPage from './pages/WordsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/words/most-common-spanish-words" element={<WordsPage />} />
    </Routes>
  )
}
