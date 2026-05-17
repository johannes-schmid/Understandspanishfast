import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="neuro-footer">
      <a href="/" className="footer-logo">comprendo<span>.</span></a>
      <p className="footer-tag">"The app that respects your brain more than your screen time."</p>
      <div className="footer-links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <span style={{fontSize:'13px',color:'var(--cortex)'}}>Built in Barcelona · 2026</span>
      </div>
    </footer>
  )
}
