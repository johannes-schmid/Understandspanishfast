import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkCls = ({ isActive }) =>
    `font-medium transition-all ${isActive ? 'text-[#FF8C00]' : 'text-slate-500 hover:text-slate-800'}`

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-orange-100/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/icon.svg" alt="" width="32" height="32" className="rounded-lg" />
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Most Common <span className="text-[#FF8C00]">Spanish</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkCls}>Method</NavLink>
          <NavLink to="/level-test" className={linkCls}>Level Test</NavLink>
          <NavLink to="/words/most-common-spanish-words" className={linkCls}>1000 Words</NavLink>
          <NavLink to="/blog" className={linkCls}>Blog</NavLink>
        </div>
        <Link to="/#waitlist" className="bg-[#FF8C00] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm active:scale-[0.98] transition-transform hover:bg-[#E67E00] shadow-md shadow-orange-200/50 no-underline">
          Join Waitlist
        </Link>
      </div>
    </nav>
  )
}
