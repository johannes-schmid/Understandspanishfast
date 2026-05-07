import { useState } from 'react'

export default function WaitlistForm({ variant = 'light' }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    try {
      const list = JSON.parse(localStorage.getItem('usf:waitlist') || '[]')
      list.push({ email, ts: Date.now() })
      localStorage.setItem('usf:waitlist', JSON.stringify(list))
    } catch {}
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={`flex items-center gap-3 px-6 py-5 rounded-full ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-tertiary-container text-on-tertiary-container'}`}>
        <span className="material-symbols-rounded">check_circle</span>
        <span className="font-medium">You're on the list. We'll be in touch.</span>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white border-2 border-slate-200 focus:border-[#FF8C00] outline-none rounded-full px-6 py-4 text-slate-900 placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="soft-gradient-orange text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
      >
        Join Waitlist
      </button>
    </form>
  )
}
