import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 rounded-t-[48px]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-12 px-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">UnderstandSpanishFast</span>
        </Link>
        <p className="text-sm text-slate-500 text-center">
          © 2026 UnderstandSpanishFast. Learn the right words. Understand real Spanish.
        </p>
        <nav className="flex flex-wrap gap-6 justify-center">
          <a href="/#how-it-works" className="text-slate-500 hover:text-primary transition-colors text-sm">How It Works</a>
          <Link to="/words/most-common-spanish-words" className="text-slate-500 hover:text-primary transition-colors text-sm">Word Lists</Link>
          <Link to="/compare/vs-duolingo" className="text-slate-500 hover:text-primary transition-colors text-sm">Compare</Link>
          <Link to="/privacy" className="text-slate-500 hover:text-primary transition-colors text-sm">Privacy</Link>
          <Link to="/terms" className="text-slate-500 hover:text-primary transition-colors text-sm">Terms</Link>
        </nav>
      </div>
    </footer>
  )
}
