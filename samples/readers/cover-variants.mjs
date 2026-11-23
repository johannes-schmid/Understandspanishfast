// Renders 3 cover variations side by side to samples/readers/cover-variants.png
// Usage: PATH="/opt/homebrew/bin:$PATH" node samples/readers/cover-variants.mjs
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import { ICONS, buildingSvg } from '../../scripts/readers/cover-art.mjs'

const DEFS = `<defs>
  <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc79a"/><stop offset="1" stop-color="#ff9a62"/></linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131f4b" stop-opacity="0"/><stop offset="1" stop-color="#131f4b"/></linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>`
const STARS = [[70, 18], [150, 30], [260, 12], [420, 26], [520, 10], [575, 36], [30, 40], [350, 34]]
  .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.6}" fill="#fbf8f2" opacity="${i % 2 ? .35 : .6}"/>`).join('')
const MOON = (x = 500, y = 0, s = 1) => `<path d="M0 0 a28 28 0 1 0 28 40 a22 22 0 1 1 -28 -40z" fill="#fbf8f2" opacity=".85" transform="translate(${x} ${y + 4}) scale(${s})"/>`

function lit(x, y, w, h, n, s = 1.22) {
  return `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="6" fill="#ff8a55" opacity=".22" filter="url(#glow)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#lamp)"/>
    <g transform="translate(${x + w / 2} ${y + h / 2 + 3}) scale(${s})" fill="none" stroke="#14204a" stroke-width="${1.9 / s * 1.22}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</g>
    <text x="${x + 4}" y="${y + 10}" font-family="JetBrains Mono" font-size="7.5" font-weight="600" fill="#14204a" opacity=".55">${String(n).padStart(2, '0')}</text>`
}
const dark = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#0f1940" stroke="rgba(251,248,242,.07)"/>`
const svg = (body, label) => `<svg class="cv-art" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${DEFS}${body}</svg>`

// A: a Spanish street, three buildings with balconies, a streetlamp and a cat on the roof
function calle() {
  const ww = 58
  const wh = 52
  const B = [
    { x: 22, w: 178, top: 130, fill: '#1d2c62', cols: [42, 118], rows: [160, 240, 320, 400] },
    { x: 208, w: 186, top: 44, fill: '#25377a', cols: [230, 314], rows: [76, 156, 236, 316, 396] },
    { x: 402, w: 176, top: 176, fill: '#1a2858', cols: [422, 498], rows: [206, 286, 366, 446] },
  ]
  const LIT = { '0-0-1': 1, '0-2-0': 2, '0-3-1': 3, '1-0-0': 4, '1-1-1': 5, '1-3-0': 6, '1-4-1': 7, '2-0-0': 8, '2-1-1': 9, '2-3-0': 10 }
  let out = STARS + MOON()
  B.forEach((b, bi) => {
    out += `<rect x="${b.x - 6}" y="${b.top - 8}" width="${b.w + 12}" height="10" rx="2" fill="#2a3c7c"/><rect x="${b.x}" y="${b.top}" width="${b.w}" height="${560 - b.top}" fill="${b.fill}"/>`
    b.rows.forEach((y, r) => b.cols.forEach((x, c) => {
      const n = LIT[`${bi}-${r}-${c}`]
      out += n ? lit(x, y, ww, wh, n, 1.05) : dark(x, y, ww, wh)
      if ((r + c + bi) % 2 === 0) {
        const bars = Array.from({ length: 9 }, (_, i) => `M${x - 4 + i * 8.25} ${y + wh + 2} v10`).join(' ')
        out += `<path d="M${x - 6} ${y + wh + 2} h${ww + 12} M${x - 6} ${y + wh + 12} h${ww + 12} ${bars}" stroke="#0c1433" stroke-width="2.2" fill="none"/>`
      } else out += `<path d="M${x} ${y + wh} h${ww}" stroke="#0c1433" stroke-width="3"/>`
    }))
  })
  out += `<path d="M150 122 v-20 M150 112 h-14 M150 106 h10 M330 36 v-14 h22 v14" stroke="#22336f" stroke-width="3" fill="none"/>`
  out += `<g fill="#0c1433" transform="translate(540 168)"><ellipse cx="0" cy="-10" rx="10" ry="12"/><circle cx="0" cy="-26" r="7"/><path d="M-6 -30 l-1 -8 l5 5z M6 -30 l1 -8 l-5 5z"/><path d="M9 -2 q14 0 10 -16" stroke="#0c1433" stroke-width="3" fill="none" stroke-linecap="round"/></g>`
  out += `<circle cx="196" cy="304" r="30" fill="#ffb27a" opacity=".28" filter="url(#glow)"/><path d="M204 560 V296 q0 -14 -12 -14" stroke="#0c1433" stroke-width="5" fill="none"/><path d="M182 284 h20 l-4 12 h-12z" fill="#0c1433"/><circle cx="192" cy="300" r="5" fill="#ffd2a8"/>`
  out += `<rect x="0" y="470" width="600" height="90" fill="url(#fade)"/>`
  return svg(out, 'A Spanish street at night with ten lit windows, one for each story')
}

// B: the original block, wearing a pair of headphones
function headphones() {
  const inner = buildingSvg().replace('<svg class="cv-art"', '<svg x="112" y="132" width="376" height="351"')
  const cup = (x, flip) => `<g transform="translate(${x} 300)${flip ? ' scale(-1 1)' : ''}">
      <rect x="-30" y="0" width="56" height="128" rx="22" fill="#f26b3a"/>
      <rect x="14" y="14" width="22" height="100" rx="10" fill="#c4461a"/>
      <rect x="-22" y="10" width="10" height="108" rx="5" fill="#ff8f62" opacity=".6"/></g>`
  const out = STARS + inner
    + `<path d="M62 316 C62 44 538 44 538 316" stroke="#c4461a" stroke-width="20" fill="none" stroke-linecap="round"/>`
    + `<path d="M62 316 C62 44 538 44 538 316" stroke="#f26b3a" stroke-width="14" fill="none" stroke-linecap="round"/>`
    + `<path d="M84 250 C100 90 500 90 516 250" stroke="#fbf8f2" stroke-width="2" fill="none" opacity=".25" stroke-dasharray="2 8" stroke-linecap="round"/>`
    + cup(62, false) + cup(538, true)
    + `<path d="M540 428 q0 40 -40 50 q-40 10 -60 50 q-10 20 -10 40" stroke="#f26b3a" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<g stroke="#fbf8f2" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"><path d="M10 330 q-10 34 0 68"/><path d="M590 330 q10 34 0 68"/></g>`
  return svg(out, 'An apartment building at night wearing a pair of headphones')
}

// C: a pop-up city rising out of an open book, with a sound wave across the sky
function popup() {
  const ww = 46
  const wh = 40
  const B = [
    { x: 64, w: 98, top: 246, fill: '#1d2c62', col: 90, rows: [268, 324, 380], lit: { 0: 1, 1: 10 } },
    { x: 168, w: 102, top: 126, fill: '#22336f', col: 196, rows: [148, 204, 260, 316, 372], lit: { 0: 2, 2: 3 } },
    { x: 276, w: 98, top: 54, fill: '#2a3c7c', col: 302, rows: [76, 132, 188, 244, 300, 356], lit: { 0: 4, 2: 5, 4: 6 } },
    { x: 380, w: 102, top: 150, fill: '#22336f', col: 408, rows: [172, 228, 284, 340], lit: { 0: 7, 2: 8 } },
    { x: 488, w: 72, top: 270, fill: '#1d2c62', col: 501, rows: [292, 348], lit: { 0: 9 } },
  ]
  const wave = Array.from({ length: 57 }, (_, i) => {
    const x = 20 + i * 10
    const h = 8 + Math.abs(Math.sin(i * 0.55) * 46 + Math.sin(i * 1.7) * 18)
    return `<rect x="${x}" y="${210 - h / 2}" width="4" height="${h}" rx="2"/>`
  }).join('')
  let out = STARS + MOON(70, 0, .9) + `<g fill="#f26b3a" opacity=".32">${wave}</g>`
  for (const b of B) {
    out += `<rect x="${b.x - 4}" y="${b.top - 7}" width="${b.w + 8}" height="9" rx="2" fill="#33478c"/><rect x="${b.x}" y="${b.top}" width="${b.w}" height="${470 - b.top}" fill="${b.fill}"/>`
    b.rows.forEach((y, r) => { out += b.lit[r] ? lit(b.col, y, ww, wh, b.lit[r], .86) : dark(b.col, y, ww, wh) })
  }
  const lines = (dir) => Array.from({ length: 4 }, (_, i) => `<path d="M${300 + dir * 30} ${462 + i * 13} C${300 + dir * 110} ${452 + i * 12} ${300 + dir * 180} ${450 + i * 12} ${300 + dir * 220} ${456 + i * 12}" stroke="#d9ddf0" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')
  out += `<path d="M44 444 L44 540 C150 520 240 522 300 548 C360 522 450 520 556 540 L556 444 Z" fill="#f26b3a"/>`
    + `<path d="M300 446 C240 422 150 420 56 436 L56 528 C150 512 240 514 300 538 Z" fill="#fbf8f2"/>`
    + `<path d="M300 446 C360 422 450 420 544 436 L544 528 C450 512 360 514 300 538 Z" fill="#f3efe6"/>`
    + lines(-1) + lines(1)
    + `<path d="M300 446 V538" stroke="#c9c3b6" stroke-width="2"/>`
  return svg(out, 'A pop-up city rising from an open book, with a sound wave across the night sky')
}

const dir = 'readers/level1'
const stories = fs.readdirSync(dir).filter((f) => /^level1-story\d+\.json$/.test(f)).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
const words = stories.reduce((t, s) => t + s.wordCount, 0).toLocaleString('en')
const minCov = Math.floor(Math.min(...stories.map((s) => s.measured.coverage)))
const audioMin = Math.round(stories.reduce((t, s) => t + (s.audio?.[0]?.seconds || 0), 0) / 60)
const hp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>'
const cover = (art, sticker = true) => `<section class="cover">
  <div class="cv-top"><span>Most Common Spanish</span><span>Level 1 · Top 500 words</span></div>
  <div class="cv-stage">${art}${sticker ? `<div class="cv-sticker">${hp}<b>Book +<br>audio</b><span>10 MP3s · ${audioMin} min</span></div>` : ''}</div>
  <div class="cv-body"><div class="cv-kick">10 short stories · Level 1</div><h1 class="cv-title">Diez historias</h1>
  <p class="cv-sub">Short stories for adults, written only with the 500 most common Spanish words. Read them, then hear them.</p></div>
  <div class="cv-foot"><div><b class="tab">10</b><span>stories, ${words} words</span></div><div><b class="tab">${audioMin} min</b><span>of audio, read by a native speaker</span></div><div><b class="tab">${minCov}%+</b><span>top-500 words</span></div></div>
</section>`

const VARIANTS = [['A · La calle', calle(), true], ['B · Headphones', headphones(), false], ['C · Pop-up book', popup(), true]]
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&family=Literata:opsz,wght@7..72,400;7..72,500&display=swap" rel="stylesheet">
<style>${fs.readFileSync('scripts/readers/pack.css', 'utf8')}
body{background:#ece9e2;display:flex;gap:40px;padding:40px;width:max-content}
.v{width:210mm}.v .cover{width:210mm;box-shadow:0 30px 60px -20px rgba(20,32,74,.45)}
.v h3{font:700 28px 'Plus Jakarta Sans';color:#14204a;margin:0 0 18px}</style></head><body>
${VARIANTS.map(([t, art, st]) => `<div class="v"><h3>${t}</h3>${cover(art, st)}</div>`).join('')}
</body></html>`

const browser = await puppeteer.launch()
const pg = await browser.newPage()
await pg.setViewport({ width: 2600, height: 1300, deviceScaleFactor: 1 })
await pg.setContent(html, { waitUntil: 'networkidle0' })
await pg.evaluateHandle('document.fonts.ready')
await pg.screenshot({ path: 'samples/readers/cover-variants.png', fullPage: true })
await browser.close()
console.log('samples/readers/cover-variants.png')
