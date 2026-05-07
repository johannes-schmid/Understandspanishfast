import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 mt-24 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/icon.svg" alt="" width="28" height="28" className="rounded-lg" />
            <span className="text-xl font-bold text-slate-800">Most Common <span className="text-[#FF8C00]">Spanish</span></span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            © 2026 Most Common Spanish. Master the 1,500 words that unlock real-world Spanish.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <Link to="/level-test" className="text-slate-500 hover:text-[#FF8C00] transition-colors font-medium text-sm">Level Test</Link>
          <Link to="/words/most-common-spanish-words" className="text-slate-500 hover:text-[#FF8C00] transition-colors font-medium text-sm">1000 Words</Link>
          <Link to="/blog" className="text-slate-500 hover:text-[#FF8C00] transition-colors font-medium text-sm">Blog</Link>
          <a href="/#waitlist" className="text-slate-500 hover:text-[#FF8C00] transition-colors font-medium text-sm">Waitlist</a>
        </div>
      </div>
    </footer>
  )
}
