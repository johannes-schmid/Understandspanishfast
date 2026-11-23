// Renders printable, double-sided cut-out flashcards from data/words.json.
// Usage:
//   node scripts/flashcards/render.mjs --free          top 100  -> public/flashcards/top-100-spanish-flashcards.pdf
//   node scripts/flashcards/render.mjs --full          all 1500 -> workbook/out/top-1500-spanish-flashcards.pdf (paid, never public/)
//   node scripts/flashcards/render.mjs --from 101 --to 200 [--out path.pdf] [--html-only]
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import { coveragePct } from '../../lib/coverage.js'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d }

let from = Number(opt('from', 1)), to = Number(opt('to', 100))
if (flag('full')) { from = 1; to = 1500 }
if (flag('free')) { from = 1; to = 100 }
const isFreeSample = from === 1 && to === 100
const defaultOut = isFreeSample
  ? 'public/flashcards/top-100-spanish-flashcards.pdf'
  : from === 1 && to === 1500
    ? 'workbook/out/top-1500-spanish-flashcards.pdf'
    : `workbook/out/spanish-flashcards-${from}-${to}.pdf`
const outPath = opt('out', defaultOut)
const BUILD = 'workbook/build'
fs.mkdirSync(BUILD, { recursive: true }); fs.mkdirSync(path.dirname(outPath), { recursive: true })

const all = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const words = all.filter((w) => w.rank >= from && w.rank <= to)
if (!words.length) { console.error(`No words in range ${from}-${to}`); process.exit(1) }

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (n) => n.toLocaleString('en')

const EL_FEM = new Set(['agua', 'alma', 'área', 'arma', 'hambre', 'águila', 'hacha', 'aula', 'ala', 'ama', 'arte'])
const FEM_FIX = { compañero: 'compañera' }
const art = (a) => `<span class="art">${a}</span>`
function headword(w) {
  const pair = w.word.match(/^un (\S+) una (\S+)$/)
  if (pair) {
    const m = pair[1], f = FEM_FIX[pair[2]] || pair[2]
    return m === f ? { html: `${art('el/la')} ${esc(m)}`, bare: m, len: m.length + 6 } : { html: `${art('el')} ${esc(m)}<br>${art('la')} ${esc(f)}`, bare: m, len: Math.max(m.length, f.length) + 3 }
  }
  if (w.pos === 'n.m.' || w.pos === 'n.f.' || w.pos === 'n.') {
    const bare = w.word.replace(/^(un|una|el|la) /, '')
    const a = w.pos === 'n.m.' ? 'el' : w.pos === 'n.f.' ? (EL_FEM.has(bare) ? 'el' : 'la') : 'el/la'
    return { html: `${art(a)} ${esc(bare)}`, bare, len: bare.length + a.length + 1 }
  }
  return { html: esc(w.word), bare: w.word, len: w.word.length }
}
const POS = { 'v.': 'verb', 'n.m.': 'noun · masc.', 'n.f.': 'noun · fem.', 'n.': 'noun', 'adj.': 'adjective', 'adv.': 'adverb', 'pron.': 'pronoun', 'prep.': 'preposition', 'conj.': 'conjunction', 'det.': 'determiner', 'num.': 'number', 'intj.': 'interjection', 'expr.': 'phrase', 'propn.': 'name' }
const tier = (r) => (r <= 100 ? 100 : r <= 250 ? 250 : r <= 500 ? 500 : r <= 1000 ? 1000 : 1500)

function markExample(sentence, bare) {
  const s = esc(sentence)
  const re = new RegExp(`(^|[^\\p{L}])(${bare.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=[^\\p{L}]|$)`, 'iu')
  return s.replace(re, '$1<b>$2</b>')
}

function front(w) {
  const h = headword(w)
  const size = h.len <= 7 ? 'xl' : h.len <= 11 ? 'l' : h.len <= 15 ? 'm' : 's'
  const t = tier(w.rank)
  return `<div class="face front">
    <div class="top"><span class="rk">#${w.rank}</span><span class="pos">${POS[w.pos] || esc(w.pos)}</span></div>
    <div class="hw ${size}" lang="es"><span>${h.html}</span></div>
    <div class="bot"><span>Top ${fmt(t)}</span><span>≈${coveragePct(t)}% of everyday Spanish</span></div>
  </div>`
}

function back(w) {
  const h = headword(w)
  const meaning = w.meanings.slice(0, 2).map(esc).join('<i>;</i> ')
  return `<div class="face back">
    <div class="top"><span class="rk">#${w.rank}</span><span class="pos" lang="es">${esc(h.bare)}</span></div>
    <p class="mn">${meaning}</p>
    <div class="ex"><p class="es" lang="es">${markExample(w.example_es, h.bare)}</p><p class="en">${esc(w.example_en)}</p></div>
  </div>`
}

// Sheet geometry (mm). Symmetric margins so a long-edge duplex flip lands backs exactly behind fronts.
const COLS = 2, ROWS = 5, CW = 90, CH = 54
const PW = 210, PH = 297
const MX = (PW - COLS * CW) / 2, MY = (PH - ROWS * CH) / 2
const PER = COLS * ROWS

function cropMarks() {
  const out = []
  for (let c = 0; c <= COLS; c++) {
    const x = MX + c * CW
    out.push(`<i class="cm v" style="left:${x}mm;top:${MY - 9}mm"></i><i class="cm v" style="left:${x}mm;top:${MY + ROWS * CH + 2}mm"></i>`)
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = MY + r * CH
    out.push(`<i class="cm h" style="top:${y}mm;left:${MX - 9}mm"></i><i class="cm h" style="top:${y}mm;left:${MX + COLS * CW + 2}mm"></i>`)
  }
  return out.join('')
}
const MARKS = cropMarks()

const pages = []
const sheets = Math.ceil(words.length / PER)
for (let s = 0; s < sheets; s++) {
  const batch = words.slice(s * PER, s * PER + PER)
  const cells = (render, mirror) => {
    const out = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const src = mirror ? COLS - 1 - c : c
        const w = batch[r * COLS + src]
        out.push(`<div class="cell" style="left:${MX + c * CW}mm;top:${MY + r * CH}mm">${w ? render(w) : ''}</div>`)
      }
    }
    return out.join('')
  }
  const label = `Sheet ${s + 1} of ${sheets} · words #${batch[0].rank}-${batch[batch.length - 1].rank}`
  pages.push(`<section class="page sheet">${MARKS}${cells(front, false)}<div class="slug"><span>${label}</span><span>Front · print double-sided, flip on long edge</span></div></section>`)
  pages.push(`<section class="page sheet">${MARKS}${cells(back, true)}<div class="slug"><span>${label}</span><span>Back</span></div></section>`)
}

const total = words.length
const rangeLabel = `#${fmt(from)}-${fmt(words[words.length - 1].rank)}`
const sampleCards = [all[0], all[5], all[22]]
const coverStack = `
  <div class="stack">
    <div class="card c2">${front(sampleCards[1])}</div>
    <div class="card c1">${front(sampleCards[0])}</div>
    <div class="card c3">${back(sampleCards[0])}</div>
  </div>`

const cover = `<section class="page cover">
  <div class="cv-top"><span>MOST COMMON SPANISH</span><span>PRINTABLE FLASHCARDS</span></div>
  <div class="cv-main">
    <div class="cv-num">${fmt(total)}</div>
    <h1>Spanish flashcards<br>you can print and cut</h1>
    <p>The ${isFreeSample ? '100 most common' : `${fmt(total)} most common`} Spanish words in frequency order. Spanish on the front, meaning and a real example sentence on the back.</p>
  </div>
  ${coverStack}
  <div class="cv-facts">
    <div><b>${fmt(total)}</b><span>cards, words ${rangeLabel}</span></div>
    <div><b>${fmt(sheets)}</b><span>A4 sheets, ${PER} cards each</span></div>
    <div><b>≈${coveragePct(to)}%</b><span>of everyday Spanish covered</span></div>
  </div>
  <div class="cv-foot"><span>mostcommonspanish.com</span><span>For personal use</span></div>
</section>`

const nextStep = isFreeSample
  ? `<p>These 100 words cover about half of everyday spoken Spanish. The next 1,400 take you to about 80%. Keep going with the free online flashcards at <b>mostcommonspanish.com/study</b>, or get all 1,500 words with exercises in the <b>Top 1,500 workbook</b> at mostcommonspanish.com/workbook.</p>`
  : `<p>Once a box-3 card stays in box 3 for a month, it is yours. Move it to a separate pile and keep the deck small and working. Hear every word spoken by native speakers at <b>mostcommonspanish.com/study</b>.</p>`

const howto = `<section class="page howto">
  <h2>How to print, cut and use them</h2>
  <div class="cols">
    <div>
      <h3>Print</h3>
      <ol>
        <li><b>Double-sided, flip on long edge.</b> The backs are mirrored so each meaning lands behind its word.</li>
        <li><b>Actual size / 100%.</b> On US Letter paper choose <b>Fit to page</b>; both sides shrink equally, so they still line up.</li>
        <li><b>Test one sheet first.</b> Print pages 3 and 4, hold the sheet up to a window and check the cut lines meet.</li>
        <li><b>Use card stock if you can.</b> 160-200 g/m² (60-110 lb) stops you reading the answer through the card.</li>
        <li><b>No duplex printer?</b> Print the odd pages, turn the stack over, put it back in the tray and print the even pages. Try it with pages 3 and 4 first, because printers feed paper differently.</li>
      </ol>
    </div>
    <div>
      <h3>Cut</h3>
      <p>Each sheet holds ${PER} cards of 90 × 54 mm, the size of a business card. The short marks in the margin show where to cut.</p>
      <ol>
        <li>Make the 3 long cuts first, from the top marks to the bottom marks.</li>
        <li>Then cut each strip into ${ROWS} cards at the side marks.</li>
        <li>A paper trimmer or a craft knife and ruler is faster and straighter than scissors.</li>
      </ol>
    </div>
  </div>
  <h3>Study with three boxes, ten minutes a day</h3>
  <div class="boxes">
    <div><b>Box 1</b><span>Every day</span><p>New cards and any card you missed. Look at the Spanish, say the meaning out loud, flip.</p></div>
    <div><b>Box 2</b><span>Every 3 days</span><p>Cards you got right once. Right again: move to box 3. Wrong: back to box 1.</p></div>
    <div><b>Box 3</b><span>Every week</span><p>Cards you know. Wrong at any point: back to box 1, no exceptions.</p></div>
  </div>
  <div class="tips">
    <p><b>Go in rank order.</b> The number in the corner is the word's frequency rank. Lower numbers come up more often, so learn them first.</p>
    <p><b>Add 10 new cards a day.</b> More than that and box 1 grows faster than you can clear it.</p>
    <p><b>Read the sentence, not just the word.</b> The example shows how the word is really used. Say it aloud.</p>
    <p><b>Nouns carry their article.</b> Learn <i>la casa</i>, not <i>casa</i>. The gender is part of the word.</p>
  </div>
  <div class="next"><h3>What next</h3>${nextStep}</div>
</section>`

const css = fs.readFileSync(new URL('./flashcards.css', import.meta.url), 'utf8')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${cover}${howto}${pages.join('')}</body></html>`

const htmlPath = path.join(BUILD, `flashcards-${from}-${to}.html`)
fs.writeFileSync(htmlPath, html)
console.log(`HTML: ${htmlPath}`)
if (flag('html-only')) process.exit(0)

const browser = await puppeteer.launch()
const pg = await browser.newPage()
await pg.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0', timeout: 120000 })
await pg.evaluateHandle('document.fonts.ready')

// Shrink any headword, meaning or example that does not fit its card, then report what still overflows.
const report = await pg.evaluate(() => {
  const fits = (el) => el.scrollHeight <= el.clientHeight + 0.5 && el.scrollWidth <= el.clientWidth + 0.5
  let shrunk = 0
  const issues = []
  document.querySelectorAll('.face').forEach((face) => {
    const targets = [face.querySelector('.hw'), face.querySelector('.mn'), face.querySelector('.ex')].filter(Boolean)
    const ok = () => fits(face) && targets.every(fits)
    let guard = 0
    while (!ok() && guard++ < 40) {
      targets.filter((t) => !fits(t) || !fits(face)).forEach((t) => { const fs = parseFloat(getComputedStyle(t).fontSize); t.style.fontSize = `${fs * 0.95}px` })
      shrunk++
    }
    if (!ok()) issues.push(face.querySelector('.rk')?.textContent + ' ' + face.className)
  })
  const pageIssues = [...document.querySelectorAll('.page')].filter((p) => p.scrollHeight > p.clientHeight + 0.5).length
  return { shrunk, issues, pageIssues }
})
console.log(`Fit pass: ${report.shrunk} shrink steps, ${report.issues.length} card overflows, ${report.pageIssues} page overflows`)
if (report.issues.length) console.warn('Overflowing cards:', report.issues.slice(0, 20).join(', '))

await pg.pdf({ path: outPath, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: false, outline: false })
await browser.close()
const kb = Math.round(fs.statSync(outPath).size / 1024)
console.log(`PDF: ${outPath} · ${pages.length + 2} pages · ${total} cards · ${kb} KB`)
