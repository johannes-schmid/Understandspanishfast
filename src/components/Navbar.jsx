import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md border-slate-100 shadow-[0_4px_20px_-4px_rgba(47,107,255,0.08)]">
      <div className="flex justify-between items-center h-20 px-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-primary text-2xl">bar_chart</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">UnderstandSpanishFast</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <NavLink
            to="/words/most-common-spanish-words"
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'hover:text-primary transition-colors'
            }
          >
            Word Lists
          </NavLink>
          <a href="/#how-it-works" className="hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="/#waitlist" className="hover:text-primary transition-colors">
            Full Access
          </a>
        </nav>

        <Link
          to="/words/most-common-spanish-words"
          className="bg-primary-container text-white px-5 py-2.5 rounded-full text-label-md font-semibold active:scale-95 transition-transform no-underline"
        >
          Practice Free →
        </Link>
      </div>
    </header>
  )
}
