// Renders the Top 1,500 workbook to PDF.
// Usage: node scripts/workbook/render.mjs [--html-only]
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import { coveragePct } from '../../lib/coverage.js'

const words = JSON.parse(fs.readFileSync('data/words.json', 'utf8'))
const CONTENT = 'workbook/content'
const BUILD = 'workbook/build'
const OUT = 'workbook/out'
const UNIT = 50, UNITS = 30, PER_PAGE = 25
fs.mkdirSync(BUILD, { recursive: true }); fs.mkdirSync(OUT, { recursive: true })

const load = (id) => JSON.parse(fs.readFileSync(path.join(CONTENT, `${id}.json`), 'utf8'))
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pad = (n) => String(n).padStart(2, '0')
const fmt = (n) => n.toLocaleString('en')

function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)
}
function shuffle(list, seed) {
  const r = rng(seed), a = [...list]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

const EL_FEM = new Set(['agua', 'alma', 'área', 'arma', 'hambre', 'águila', 'hacha', 'aula', 'ala', 'ama', 'arte'])
const bare = (word) => word.replace(/^(un|una|el|la) /, '')
function display(w) {
  if (w.pos === 'n.m.' || w.pos === 'n.f.') w = { ...w, word: bare(w.word) }
  if (w.pos === 'n.m.') return `<span class="art">el</span> ${esc(w.word)}`
  if (w.pos === 'n.f.') return `<span class="art">${EL_FEM.has(w.word) ? 'el' : 'la'}</span> ${esc(w.word)}`
  return esc(w.word)
}
const POS = { 'v.': 'verb', 'n.m.': 'noun m.', 'n.f.': 'noun f.', 'n.': 'noun', 'adj.': 'adj.', 'adv.': 'adv.', 'pron.': 'pron.', 'prep.': 'prep.', 'conj.': 'conj.', 'det.': 'det.', 'num.': 'number', 'intj.': 'interj.', 'expr.': 'phrase', 'propn.': 'name' }
const meaning = (w) => w.meanings.slice(0, 2).join(' · ')

const pages = []
const toc = []
function page(body, { cls = '', run = '', section } = {}) {
  if (section) toc.push({ title: section, page: pages.length + 1 })
  pages.push({ body, cls, run })
}

/* ---------- cover ---------- */
const bars = [50, 67, 74, 80].map((h, i) => `<i style="height:${h}%;${i === 3 ? 'background:var(--coral);opacity:1' : ''}"></i>`).join('')
page(`
  <div class="cover-in">
    <div class="cv-top"><span class="mono">MOST COMMON SPANISH</span><span class="mono">PRINTABLE WORKBOOK</span></div>
    <div class="cv-bars">${bars}</div>
    <div class="cv-num">1,500</div>
    <h1 class="cv-title">The Top 1,500<br>Spanish Words</h1>
    <p class="cv-sub">The words that cover 80% of everyday Spanish. 30 units, a fixed method, and enough practice to make them stick.</p>
    <div class="cv-foot"><span class="mono">WORDS #1–1,500</span><span class="mono">≈80% COVERAGE</span><span class="mono">MOSTCOMMONSPANISH.COM</span></div>
  </div>`, { cls: 'cover' })

/* ---------- title / intro ---------- */
page(`
  <div class="intro">
    <h1 class="h1">This book does one thing</h1>
    <p class="lead">It teaches you the 1,500 Spanish words you will hear and read most often, in the order of how often they appear. Those words cover about 80% of everyday Spanish. The rest you can increasingly guess from context.</p>
    <p class="lead">There is no grammar course here and no themed vocabulary. Just the right words, in the right order, practised until you know them.</p>
    <div class="facts">
      <div><b class="tab">30</b><span>units of 50 words</span></div>
      <div><b class="tab">4</b><span>passes per unit</span></div>
      <div><b class="tab">6</b><span>review tests</span></div>
      <div><b class="tab">~3</b><span>months, 20 minutes a day</span></div>
    </div>
    <h3 class="h3">What you need</h3>
    <ul class="bul">
      <li>A pen, and a sheet of paper to cover a column</li>
      <li>20 minutes a day, ideally at the same time</li>
      <li>Optional: the free flashcards with native audio at mostcommonspanish.com/study, to hear every word</li>
    </ul>
  </div>
  <div class="colophon">
    <p>The Top 1,500 Spanish Words · Most Common Spanish · First edition, 2026</p>
    <p>Words ranked by frequency across large corpora of spoken and written Spanish. Coverage figures are approximate and refer to running words in everyday language.</p>
    <p>For personal use. You may print as many copies as you need for yourself.</p>
  </div>`, { run: 'Introduction' })

/* ---------- contents placeholder (filled later) ---------- */
const TOC_INDEX = pages.length
page('', { run: 'Contents' })

/* ---------- method ---------- */
const curvePts = [[0, 0], [100, 50], [250, 60], [500, 67], [750, 72], [1000, 74], [1500, 80], [2000, 84]]
const X = (w) => 40 + (w / 2000) * 600, Y = (p) => 260 - (p / 100) * 240
const curve = curvePts.map(([w, p], i) => `${i ? 'L' : 'M'}${X(w).toFixed(1)},${Y(p).toFixed(1)}`).join(' ')
const area = `${curve} L${X(1500)},${Y(0)} L${X(0)},${Y(0)} Z`
page(`
  <h1 class="h1">Why 1,500 words</h1>
  <p class="lead">Spanish, like every language, runs on a small core. A handful of words appear in almost every sentence; most words are rare. Learn the core first and every hour of study pays back more.</p>
  <svg class="curve" viewBox="0 0 680 300" aria-hidden="true">
    <defs><clipPath id="c1500"><rect x="0" y="0" width="${X(1500)}" height="300"/></clipPath></defs>
    ${[0, 25, 50, 75, 100].map((p) => `<line x1="40" x2="640" y1="${Y(p)}" y2="${Y(p)}" class="grid"/><text x="32" y="${Y(p) + 4}" class="ax" text-anchor="end">${p}%</text>`).join('')}
    ${[0, 500, 1000, 1500, 2000].map((w) => `<text x="${X(w)}" y="282" class="ax" text-anchor="middle">${fmt(w)}</text>`).join('')}
    <path d="${area}" class="area" clip-path="url(#c1500)"/>
    <path d="${curve}" class="line"/>
    ${[[100, 50], [500, 67], [1000, 74], [1500, 80]].map(([w, p]) => `<circle cx="${X(w)}" cy="${Y(p)}" r="6" class="${w === 1500 ? 'pt key' : 'pt'}"/><text x="${X(w)}" y="${Y(p) - 14}" text-anchor="middle" class="lbl">${p}%</text>`).join('')}
    <text x="${X(1500) + 10}" y="${Y(80) + 26}" class="note">this book</text>
  </svg>
  <div class="cov-rows">
    <div><span class="tag">100</span><p><b>Half of what you hear.</b> ser, estar, tener, que, de. The words inside almost every sentence.</p></div>
    <div><span class="tag">500</span><p><b>A basic conversation.</b> Your day, work and family, without stalling on every line.</p></div>
    <div><span class="tag">1,000</span><p><b>Headlines and subtitles start to make sense.</b> You follow the thread of most dialogue.</p></div>
    <div><span class="tag key">1,500</span><p><b>Four out of five words, understood.</b> Context fills in most of the rest. This is where real Spanish becomes usable.</p></div>
  </div>`, { run: 'The method', section: 'The method' })

page(`
  <h1 class="h1">Four passes per unit</h1>
  <p class="lead">Every unit goes through the same four passes. You never have to decide what to do next, and you always know when a word counts as learned.</p>
  <div class="passes">
    <div class="pass"><span class="mono">PASS 1 · READ</span><h3>Meet the words</h3><p>Go through the two word pages. Say each word and its example sentence out loud. Notice the article on nouns: <b>el</b> or <b>la</b> is part of the word.</p></div>
    <div class="pass"><span class="mono">PASS 2 · RECALL</span><h3>Cover and test yourself</h3><p>Cover the English column with a sheet of paper. Say the meaning of each word, then check. Tick the first box if you got it in under three seconds.</p></div>
    <div class="pass"><span class="mono">PASS 3 · USE</span><h3>Do the exercise page</h3><p>Gap-fill, matching, translation and a mini-story. Write your answers in the book. Check them in the answer key at the back and correct in a different colour.</p></div>
    <div class="pass"><span class="mono">PASS 4 · REVIEW</span><h3>Come back twice</h3><p>Three days later, cover the English again and tick the second box. A week later, the third. A word with three ticks is learned.</p></div>
  </div>
  <div class="callout"><b>The mastery rule.</b> A unit is mastered when at least 45 of its 50 words have all three ticks. Words without ticks go on a sticky note on the inside cover; read them once a day until they stick.</div>`, { run: 'The method' })

page(`
  <h1 class="h1">Your 3-day rhythm</h1>
  <p class="lead">Each unit takes three days at about 20 minutes a day. Thirty units take about 90 days. Add a day for each review test and you finish in roughly 14 weeks.</p>
  <div class="rhythm">
    <div><span class="day">DAY 1</span><h3>Read and recall</h3><p>Pass 1 and pass 2 on the new unit. Tick box 1.</p></div>
    <div><span class="day">DAY 2</span><h3>Exercise page</h3><p>Pass 3. Check your answers in the key and fix mistakes.</p></div>
    <div><span class="day">DAY 3</span><h3>Review</h3><p>Pass 4: box 2 for the unit you started three days ago, box 3 for the unit from a week ago.</p></div>
  </div>
  <h3 class="h3">How to read a word entry</h3>
  <div class="anatomy">
    <div class="entry demo">
      <span class="rk tab">#43</span>
      <div class="ew"><b>${display(words[42])}</b><span class="pos">${POS[words[42].pos]}</span></div>
      <div class="em">${esc(meaning(words[42]))}</div>
      <div class="ex">${esc(words[42].example_es)} <span>${esc(words[42].example_en)}</span></div>
      <div class="boxes"><i></i><i></i><i></i></div>
    </div>
    <ul class="anno">
      <li><b>#43</b> Frequency rank: this is the 43rd most common word in Spanish.</li>
      <li><b>Article</b> Nouns come with el or la. Learn them together.</li>
      <li><b>Meaning</b> The one or two meanings you will meet most often. Cover this column in pass 2.</li>
      <li><b>Example</b> A real, everyday sentence with its translation.</li>
      <li><b>Three boxes</b> Day 1, day 3 and day 7 recall. Three ticks = learned.</li>
    </ul>
  </div>
  <div class="callout">Missed a day? Do not start over. Pick up where you left off and do one review day before the next new unit.</div>`, { run: 'The method' })

const planRows = Array.from({ length: UNITS }, (_, i) => {
  const u = i + 1, a = i * UNIT + 1, b = (i + 1) * UNIT
  const test = u % 5 === 0 ? `<tr class="trow"><td></td><td colspan="4">Review test ${u / 5} · words #${fmt(b - 249)}–${fmt(b)}</td><td><i class="sq"></i></td></tr>` : ''
  return `<tr><td class="tab">Unit ${pad(u)}</td><td class="tab">#${fmt(a)}–${fmt(b)}</td><td class="tab">${coveragePct(b)}%</td><td class="dl"></td><td><i class="sq"></i><i class="sq"></i><i class="sq"></i></td><td><i class="sq"></i></td></tr>${test}`
}).join('')
page(`
  <h1 class="h1">The plan</h1>
  <p class="lead small">Write the date you start each unit. Tick a box for each completed day, and the last box once the unit is mastered.</p>
  <table class="plan">
    <thead><tr><th>Unit</th><th>Words</th><th>Coverage</th><th>Started</th><th>Day 1 · 2 · 3</th><th>Mastered</th></tr></thead>
    <tbody>${planRows}</tbody>
  </table>`, { run: 'The method', cls: 'dense' })

/* ---------- units ---------- */
const units = []
for (let u = 1; u <= UNITS; u++) {
  const list = words.slice((u - 1) * UNIT, u * UNIT)
  const c = load(`unit-${pad(u)}`)
  units.push({ u, list, c })
  const a = list[0].rank, b = list.at(-1).rank
  const entries = (slice) => slice.map((w) => `
    <div class="entry">
      <span class="rk tab">#${w.rank}</span>
      <div class="ew"><b>${display(w)}</b><span class="pos">${POS[w.pos] || esc(w.pos)}</span></div>
      <div class="em">${esc(meaning(w))}</div>
      <div class="ex">${esc(w.example_es)} <span>${esc(w.example_en)}</span></div>
      <div class="boxes"><i></i><i></i><i></i></div>
    </div>`).join('')
  const head = (part) => `<div class="unit-head"><div><span class="mono">UNIT ${pad(u)} · WORDS ${fmt(a)}–${fmt(b)}${part}</span></div><span class="mono">AFTER THIS UNIT: ${coveragePct(b)}% COVERAGE</span></div>`
  page(`${head('')}<h1 class="unit-title sm">Unit ${u}</h1><div class="colhead"><span>#</span><span>Word</span><span>Meaning · cover it</span><span>Example</span><span>1·3·7</span></div><div class="entries">${entries(list.slice(0, PER_PAGE))}</div>`, { run: `Unit ${u}`, cls: 'words', section: u === 1 ? 'Units 1–30' : undefined })
  page(`${head(' · CONTINUED')}<div class="colhead"><span>#</span><span>Word</span><span>Meaning · cover it</span><span>Example</span><span>1·3·7</span></div><div class="entries">${entries(list.slice(PER_PAGE))}</div>`, { run: `Unit ${u}`, cls: 'words' })

  const gapWords = new Set(c.gapFill.map((g) => g.base.toLowerCase()))
  const matchPool = list.filter((w) => !gapWords.has(w.word.toLowerCase()) && ['v.', 'n.m.', 'n.f.', 'adj.', 'adv.', 'n.'].includes(w.pos))
  const seenM = new Set()
  const match = shuffle(matchPool, u * 7).filter((w) => { const m = w.meanings[0].toLowerCase(); if (seenM.has(m)) return false; seenM.add(m); return true }).slice(0, 10)
  const eng = shuffle(match.map((w, i) => ({ i, m: w.meanings[0] })), u * 13)
  const letters = 'abcdefghij'
  c._match = match.map((w, i) => `${i + 1}${letters[eng.findIndex((e) => e.i === i)]}`)
  const bank = shuffle(c.story.answers, u * 3)
  const storyHtml = esc(c.story.text).replace(/\((\d)\)/g, '<span class="gap"><sup>$1</sup></span>')
  page(`
    ${head(' · PASS 3')}
    <h2 class="ex-title">Use the words</h2>
    <section class="exb">
      <h3><span class="n">A</span>Fill the gap. The dictionary form is in brackets; change it to fit.</h3>
      <ol class="gf">${c.gapFill.map((g) => `<li>${esc(g.es).replace('____', '<span class="line"></span>')} <span class="hint">(${esc(g.base)})</span></li>`).join('')}</ol>
    </section>
    <section class="exb two">
      <div>
        <h3><span class="n">B</span>Match each word to its meaning.</h3>
        <div class="match">
          <ol>${match.map((w) => `<li><span class="mbox"></span>${display(w)}</li>`).join('')}</ol>
          <ol class="lt">${eng.map((e) => `<li>${esc(e.m)}</li>`).join('')}</ol>
        </div>
      </div>
      <div>
        <h3><span class="n">C</span>Say it in Spanish.</h3>
        <ol class="tr">${c.translate.map((t) => `<li>${esc(t.en)}<span class="wline"></span></li>`).join('')}</ol>
      </div>
    </section>
    <section class="exb">
      <h3><span class="n">D</span>Mini-story: ${esc(c.story.title)}. Fill the 8 gaps from the box.</h3>
      <div class="bank">${bank.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
      <p class="story">${storyHtml}</p>
    </section>`, { run: `Unit ${u}`, cls: 'exercise' })

  if (u % 5 === 0) {
    const t = u / 5
    const tc = load(`test-${t}`)
    const band = words.slice((t - 1) * 250, t * 250)
    const recall = shuffle(band.filter((w) => !tc.gapFill.some((g) => g.base.toLowerCase() === w.word.toLowerCase())), t * 31).slice(0, 20).sort((x, y) => x.rank - y.rank)
    tc._recall = recall
    units.at(-1).test = { t, tc, band }
    const bankT = shuffle(tc.gapFill.map((g) => g.base), t * 17)
    page(`
      <div class="unit-head"><span class="mono">REVIEW TEST ${t} · WORDS ${fmt(band[0].rank)}–${fmt(band.at(-1).rank)}</span><span class="mono">35 POINTS · NO PEEKING</span></div>
      <h1 class="unit-title">Review test ${t}</h1>
      <p class="lead small">Do this without looking back. Then check the answer key, count your points and write the score below. 30 or more: carry on. Under 30: spend one extra day reviewing the words you missed before the next unit.</p>
      <section class="exb">
        <h3><span class="n">A</span>Write the English meaning. One point each.</h3>
        <div class="recall">${recall.map((w) => `<div><span class="rk tab">#${w.rank}</span><b>${display(w)}</b><span class="wline"></span></div>`).join('')}</div>
      </section>
      <div class="score"><span>Part A</span><span class="sbox">&nbsp;&nbsp;&nbsp;&nbsp;/ 20</span></div>`, { run: `Review test ${t}`, cls: 'test', section: `Review test ${t}` })
    page(`
      <div class="unit-head"><span class="mono">REVIEW TEST ${t} · CONTINUED</span><span class="mono">WORDS ${fmt(band[0].rank)}–${fmt(band.at(-1).rank)}</span></div>
      <section class="exb">
        <h3><span class="n">B</span>Fill the gap with a word from the box, in the right form. One point each.</h3>
        <div class="bank">${bankT.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
        <ol class="gf">${tc.gapFill.map((g) => `<li>${esc(g.es).replace('____', '<span class="line"></span>')}</li>`).join('')}</ol>
      </section>
      <section class="exb">
        <h3><span class="n">C</span>Say it in Spanish. One point for each correct sentence; small spelling slips are fine.</h3>
        <ol class="tr">${tc.translate.map((x) => `<li>${esc(x.en)}<span class="wline"></span></li>`).join('')}</ol>
      </section>
      <div class="score"><span>Part B</span><span class="sbox">&nbsp;&nbsp;&nbsp;&nbsp;/ 10</span><span>Part C</span><span class="sbox">&nbsp;&nbsp;&nbsp;&nbsp;/ 5</span><span><b>Total</b></span><span class="sbox big">&nbsp;&nbsp;&nbsp;&nbsp;/ 35</span></div>`, { run: `Review test ${t}`, cls: 'test' })
  }
}

/* ---------- answer key ---------- */
const keyBlocks = []
for (const { u, list, c, test } of units) {
  keyBlocks.push(`
    <div class="kb">
      <h3>Unit ${u} <span class="mono">#${fmt(list[0].rank)}–${fmt(list.at(-1).rank)}</span></h3>
      <p><b>A</b> ${c.gapFill.map((g, i) => `${i + 1} ${esc(g.answer)}`).join(' · ')}</p>
      <p><b>B</b> ${c._match.join(' · ')}</p>
      <p><b>C</b> ${c.translate.map((t, i) => `${i + 1} ${esc(t.es)}`).join(' ')}</p>
      <p><b>D</b> ${c.story.answers.map((a, i) => `${i + 1} ${esc(a)}`).join(' · ')}</p>
    </div>`)
  if (test) {
    const { t, tc } = test
    keyBlocks.push(`
      <div class="kb test">
        <h3>Review test ${t}</h3>
        <p><b>A</b> ${tc._recall.map((w) => `${esc(bare(w.word))} = ${esc(w.meanings[0])}`).join(' · ')}</p>
        <p><b>B</b> ${tc.gapFill.map((g, i) => `${i + 1} ${esc(g.answer)}`).join(' · ')}</p>
        <p><b>C</b> ${tc.translate.map((x, i) => `${i + 1} ${esc(x.es)}`).join(' ')}</p>
      </div>`)
  }
}
const KEY_PER_PAGE = 5
for (let i = 0; i < keyBlocks.length; i += KEY_PER_PAGE) {
  page(`${i === 0 ? '<h1 class="h1">Answer key</h1><p class="lead small">Translations show one good answer; other correct wordings count too.</p>' : ''}<div class="key">${keyBlocks.slice(i, i + KEY_PER_PAGE).join('')}</div>`, { run: 'Answer key', cls: 'keypage', section: i === 0 ? 'Answer key' : undefined })
}

/* ---------- tracker ---------- */
const trackRows = Array.from({ length: UNITS }, (_, i) => {
  const b = (i + 1) * UNIT
  return `<div class="trow2"><span class="mono">U${pad(i + 1)}</span><div class="cells">${Array.from({ length: UNIT }, () => '<i></i>').join('')}</div><span class="mono">${coveragePct(b)}%</span></div>`
}).join('')
page(`
  <h1 class="h1">1,500 boxes</h1>
  <p class="lead small">Colour in one box for every word with three ticks. Each row is one unit; the number on the right is how much everyday Spanish you cover once the row is full.</p>
  <div class="tracker">${trackRows}</div>`, { run: 'Progress tracker', cls: 'dense', section: 'Progress tracker' })

/* ---------- closing ---------- */
page(`
  <div class="intro">
    <h1 class="h1">What now</h1>
    <p class="lead">You know the words that make up four out of five words in everyday Spanish. The fastest way forward now is lots of real Spanish that is slightly too hard.</p>
    <ul class="bul">
      <li><b>Watch with Spanish subtitles.</b> Series you already know in English are easiest. Pause on words you hear three times and look them up.</li>
      <li><b>Read easy books.</b> Graded readers or young-adult novels. Aim to understand the story, not every word.</li>
      <li><b>Keep reviewing.</b> Go back through this book once a month. Every word without three ticks gets another round.</li>
      <li><b>Hear every word.</b> The free flashcards at mostcommonspanish.com/study have native audio for all 1,500 words.</li>
    </ul>
  </div>
  <div class="colophon"><p>¡Mucho éxito! · Most Common Spanish · mostcommonspanish.com</p></div>`, { run: 'What now', section: 'What now' })

/* ---------- contents ---------- */
pages[TOC_INDEX].body = `
  <h1 class="h1">Contents</h1>
  <div class="toc">${toc.map((t) => `<div><span>${esc(t.title)}</span><i></i><span class="tab">${t.page}</span></div>`).join('')}</div>
  <h3 class="h3" style="margin-top:12mm">Units at a glance</h3>
  <div class="toc units">${units.map(({ u, list }) => `<div><span>Unit ${u} · #${fmt(list[0].rank)}–${fmt(list.at(-1).rank)}</span><i></i><span class="tab">${toc.find((t) => t.title === 'Units 1–30').page + (u - 1) * 3 + Math.floor((u - 1) / 5) * 2}</span></div>`).join('')}</div>`

/* ---------- html ---------- */
const css = fs.readFileSync(new URL('./workbook.css', import.meta.url), 'utf8')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Top 1,500 Spanish Words — Workbook</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>${css}</style></head><body>
${pages.map((p, i) => `<section class="page ${p.cls}" data-n="${i + 1}"><div class="pin">${p.body}</div>${i > 0 ? `<footer class="pf"><span>${esc(p.run)}</span><span class="tab">${i + 1}</span></footer>` : ''}</section>`).join('\n')}
</body></html>`
const htmlPath = path.join(BUILD, 'workbook.html')
fs.writeFileSync(htmlPath, html)
console.log(`${pages.length} pages → ${htmlPath}`)
if (process.argv.includes('--html-only')) process.exit(0)

const browser = await puppeteer.launch()
const pg = await browser.newPage()
await pg.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle0' })
await pg.evaluateHandle('document.fonts.ready')
const over = await pg.evaluate(() => [...document.querySelectorAll('.page')].filter((p) => { const i = p.querySelector('.pin'); return i.scrollHeight > i.clientHeight + 1 }).map((p) => p.dataset.n))
if (over.length) console.warn(`OVERFLOW on pages: ${over.join(', ')}`)
const pdfPath = path.join(OUT, 'top-1500-spanish-words-workbook.pdf')
await pg.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: false, outline: false })
await browser.close()
console.log(`PDF → ${pdfPath} (${(fs.statSync(pdfPath).size / 1e6).toFixed(1)} MB)`)
