const fs = require('fs')
const path = require('path')
const ROOT = '/Users/johannesschmid/Desktop/Development-Projects/UnderstandSpanishFast'
const W = require(path.join(ROOT, 'data/words.json'))
const byRank = (r) => W[r - 1]
const font = (f) => fs.readFileSync(path.join(ROOT, 'app/fonts', f)).toString('base64')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const bare = (w) => w.replace(/^(un|una|el|la) /, '')

const LEVELS = [
  { n: '500', range: '1–500', from: 1, to: 500, cov: 67, words: 'five hundred', idx: 1 },
  { n: '1,000', range: '501–1,000', from: 501, to: 1000, cov: 74, words: 'one thousand', idx: 2 },
  { n: '1,500', range: '1,001–1,500', from: 1001, to: 1500, cov: 80, words: 'fifteen hundred', idx: 3 },
  { n: '2,000', range: '1,501–2,000', from: 1501, to: 2000, cov: 84, words: 'two thousand', idx: 4 },
]

// ---------- coverage curve (monotone cubic through the site's own points) ----------
const P = [[0, 0], [100, 50], [250, 60], [500, 67], [750, 72], [1000, 74], [1500, 80], [2000, 84]]
function monotone(pts) {
  const n = pts.length, d = [], m = []
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]))
  m[0] = d[0] * 1.6; m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i] }
  }
  return (x) => {
    let i = 0
    while (i < n - 2 && x > pts[i + 1][0]) i++
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], h = x1 - x0, t = (x - x0) / h
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2
    return h00 * y0 + h10 * h * m[i] + h01 * y1 + h11 * h * m[i + 1]
  }
}
const cov = monotone(P)
const lin = (n) => { for (let i = 1; i < P.length; i++) { const [x1, y1] = P[i]; if (n <= x1) { const [x0, y0] = P[i - 1]; return Math.round(y0 + ((n - x0) / (x1 - x0)) * (y1 - y0)) } } return 84 }

// ---------- fonts ----------
const cab = ['300', '500', '800'].map((w) => `@font-face{font-family:'Cabinet Grotesk';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${font(`CabinetGrotesk-${w}.woff2`)}) format('woff2')}`).join('\n')

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// ---------- covers ----------
function clarityCover(L) {
  const segs = [1, 2, 3, 4].map((i) => `<i class="${i < L.idx ? 'done' : i === L.idx ? 'now' : ''}"></i>`).join('')
  return `<div class="book clarity cl-${L.idx}"><div class="face">
    <div class="cl-ring"></div><div class="cl-ring cl-ring2"></div>
    <div class="cl-top"><span class="cl-mark"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.5"/><path d="M5.5 12.5 9 8.5l2.5 2.5 3.5-4"/></svg>Most Common Spanish</span><span>Book ${L.idx} of 4</span></div>
    <div class="cl-num">${L.n}</div>
    <div class="cl-bar">${segs}</div>
    <div class="cl-barl"><span>500</span><span>1,000</span><span>1,500</span><span>2,000</span></div>
    <div class="cl-card">
      <div class="cl-title">The Top ${L.n}</div>
      <p>Spanish words ${L.idx === 1 ? 'you will hear most' : `ranked ${L.range}`}. Learn them, practise them, keep them.</p>
      <div class="cl-cov"><b>${L.cov}%</b><span>of everyday Spanish<br>understood</span></div>
    </div>
  </div></div>`
}

function editorialCover(L) {
  const h = (L.cov * 0.55 - 8).toFixed(1)
  return `<div class="book editorial ed-${L.idx}"><div class="face">
    <div class="ed-head"><span>Most Common Spanish</span><span>No. ${L.idx}</span></div>
    <div class="ed-title">The Top</div>
    <div class="ed-num">${L.n}</div>
    <div class="ed-sub">The ${L.words} words of spoken Spanish that matter most, ${L.idx === 1 ? 'with a method to master them' : 'in order of use'}.</div>
    <div class="ed-panel" style="height:${h}%">
      <div class="ed-claim">Understand ${L.cov}% of everyday Spanish.</div>
      <div class="ed-foot"><span>Words ${L.range}</span><span>A printable workbook</span></div>
    </div>
  </div></div>`
}

function signalCover(L) {
  const X = (x) => 24 + (x / 2000) * 262, Y = (y) => 176 - (y / 100) * 150
  let line = ''
  for (let x = 0; x <= 2000; x += 10) line += `${x ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(cov(x)).toFixed(1)}`
  let band = `M${X(L.from - 1).toFixed(1)} ${Y(0)}`
  let seg = ''
  for (let x = L.from - 1; x <= L.to; x += 10) {
    band += `L${X(x).toFixed(1)} ${Y(cov(x)).toFixed(1)}`
    seg += `${x === L.from - 1 ? 'M' : 'L'}${X(x).toFixed(1)} ${Y(cov(x)).toFixed(1)}`
  }
  band += `L${X(L.to).toFixed(1)} ${Y(0)}Z`
  const px = X(L.to), py = Y(L.cov)
  const grid = [25, 50, 75, 100].map((g) => `<line x1="24" x2="286" y1="${Y(g)}" y2="${Y(g)}" class="g"/>`).join('')
  const ticks = [0, 500, 1000, 1500, 2000].map((t) => `<text x="${X(t)}" y="190" class="t" text-anchor="${t === 0 ? 'start' : t === 2000 ? 'end' : 'middle'}">${t.toLocaleString('en')}</text>`).join('')
  const lx = L.idx === 4 ? px - 8 : px + 8, anchor = L.idx === 4 ? 'end' : 'start'
  return `<div class="book signal sg-${L.idx}"><div class="face">
    <div class="sg-head"><span>Most Common Spanish</span><span>${String(L.idx).padStart(2, '0')} / 04</span></div>
    <div class="sg-title">Top <b>${L.n}</b></div>
    <div class="sg-sub">Spanish words by frequency. A workbook.</div>
    <svg class="sg-chart" viewBox="0 0 300 196" aria-hidden="true">
      ${grid}
      <path d="${band}" class="band"/>
      <path d="${line}" class="curve"/>
      <path d="${seg}" class="seg"/>
      <line x1="${px}" x2="${px}" y1="${py}" y2="176" class="drop"/>
      <line x1="24" x2="${px}" y1="${py}" y2="${py}" class="drop"/>
      <circle cx="${px}" cy="${py}" r="9" class="halo"/>
      <circle cx="${px}" cy="${py}" r="4.2" class="pt"/>
      <text x="${lx}" y="${py - 9}" class="pl" text-anchor="${anchor}">${L.cov}%</text>
      <line x1="24" x2="286" y1="176" y2="176" class="ax"/>
      ${ticks}
    </svg>
    <div class="sg-data">
      <div><span>Ranks</span><b>${L.range}</b></div>
      <div><span>Coverage</span><b>${L.cov}%</b></div>
      <div><span>Level</span><b>${L.idx}/4</b></div>
    </div>
  </div></div>`
}

const caption = (L) => `<figcaption><b>The Top ${L.n}</b><span>Words ${L.range} · ≈${L.cov}% · €5</span></figcaption>`
const series = (fn) => `<div class="series">${LEVELS.map((L) => `<figure>${fn(L)}${caption(L)}</figure>`).join('')}</div>`

// ---------- interior: Clarity spread ----------
function calendar() {
  let cells = ''
  for (let d = 1; d <= 42; d++) {
    const nu = d <= 25 ? d : null
    const rev = [1, 3, 7, 14].map((k) => d - k).filter((u) => u >= 1 && u <= 25)
    const test = { 6: 'Test 1', 11: 'Test 2', 16: 'Test 3', 21: 'Test 4', 26: 'Test 5', 40: 'Final' }[d]
    const body = d > 40 ? '' : `${nu ? `<em class="n">U${nu}</em>` : ''}<small>${rev.join(' ')}</small>`
    cells += `<div class="cal-d${d > 40 ? ' off' : ''}${test ? ' test' : ''}"><span>${d <= 40 ? d : ''}${test ? `<b>${test}</b>` : ''}</span>${body}</div>`
  }
  return cells
}

function clarityWordEntry(w) {
  return `<div class="cw">
    <div class="cw-r">${String(w.rank).padStart(3, '0')}</div>
    <div class="cw-main">
      <div class="cw-h"><b>${esc(w.word)}</b><span class="cw-pos">${esc(w.pos)}</span><span class="cw-m">${esc(w.meanings.slice(0, 2).join(' · '))}</span><span class="cw-write"><i></i></span></div>
      <div class="cw-ex">${esc(w.example_es)} <span>${esc(w.example_en)}</span></div>
    </div>
    <div class="cw-box" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </div>`
}

const claritySpread = `<div class="spread sp-clarity">
  <div class="page"><div class="pg">
    <div class="pc-run"><span>The mastery method</span><span>Part I</span></div>
    <h4 class="pc-h">20 words a day.<br>Five looks at each.</h4>
    <p class="pc-lead">You do not need willpower. You need the right words, in order, seen again just before you forget them. Every unit in this book is 20 words. You learn one unit a day and review earlier units on a fixed schedule.</p>
    <div class="pc-steps">
      <div><b>Day 0</b><span>Learn</span><p>Read each word aloud, copy it once, cover the meaning and recall it.</p></div>
      <div><b>+1 · +3</b><span>Recall</span><p>Cover the English column. Tick each word you know in under 3 seconds.</p></div>
      <div><b>+7 · +14</b><span>Use</span><p>Redo the unit's cloze story without looking at the word list.</p></div>
    </div>
    <div class="pc-calh"><b>Your review calendar</b><span><em class="n">U10</em> new unit <small>9 7 3</small> units to review <em class="t">Test</em> checkpoint</span></div>
    <div class="cal">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<div class="cal-w">${d}</div>`).join('')}${calendar()}</div>
    <p class="pc-note">About 25 minutes a day. 25 days of new words, 40 days to finish every review. Cross out each day when it is done.</p>
    <div class="pc-folio">8</div>
  </div></div>
  <div class="page"><div class="pg">
    <div class="pc-run"><span>Unit 10 · Words 181–200</span><span>Coverage after this unit: ${Math.round(cov(200))}%</span></div>
    <div class="pc-uh"><h4>Unit 10</h4><div class="pc-umeta"><span>Day 10</span><span>Review on day 11, 13, 17, 24</span></div></div>
    <div class="cws">${[181, 182, 183, 184, 185, 186, 187, 188, 189, 190].map((r) => clarityWordEntry(byRank(r))).join('')}</div>
    <div class="pc-folio r">54</div>
  </div></div>
</div>`

// ---------- interior: Editorial spread ----------
const gaps = [
  ['Llegaste ______ tarde.', 'You arrived too late.'],
  ['Voy al gimnasio ______ mañana.', 'I go to the gym every morning.'],
  ['Cerré la ______ al salir de la casa.', 'I closed the door when I left the house.'],
  ['Mi ______ viene a cenar esta noche.', 'My family is coming for dinner tonight.'],
  ['Se golpeó la ______ con la puerta.', 'He hit his head on the door.'],
  ['El servicio de internet está muy ______ hoy.', 'The internet is very slow today.'],
]
const matchEs = ['contar', 'quizá', 'regresar', 'terminar', 'algún', 'allá']
const matchEn = ['over there', 'to finish', 'to count', 'maybe', 'some, any', 'to return']
const translate = ['Maybe I\'ll go to the movies tonight.', 'My brother is studying at the university.', 'I want to finish the puzzle before going to sleep.', 'I need some advice on how to study.']

const editorialSpread = `<div class="spread sp-editorial">
  <div class="page"><div class="pg">
    <div class="pe-run"><span>Unit 10</span><span>Practice</span></div>
    <h4 class="pe-h">Practice</h4>
    <div class="pe-sec"><div class="pe-st"><b>A</b>Fill the gap</div><p class="pe-ins">One word from this unit per sentence. The English is there if you need it.</p>
      <ol class="pe-gaps">${gaps.map(([es, en]) => `<li><span>${es.replace('______', '<i></i>')}</span><small>${en}</small></li>`).join('')}</ol>
      <div class="pe-bank">demasiado · cada · puerta · familia · cabeza · lento</div>
    </div>
    <div class="pe-sec"><div class="pe-st"><b>B</b>Match</div><p class="pe-ins">Draw a line from each word to its meaning.</p>
      <div class="pe-match"><ul>${matchEs.map((w, i) => `<li><span>${i + 1}</span>${w}<i></i></li>`).join('')}</ul><ul>${matchEn.map((w, i) => `<li><i></i>${w}<span>${'abcdefgh'[i]}</span></li>`).join('')}</ul></div>
    </div>
    <div class="pe-folio">56</div>
  </div></div>
  <div class="page"><div class="pg">
    <div class="pe-run"><span>Unit 10</span><span>Use it</span></div>
    <div class="pe-sec"><div class="pe-st"><b>C</b>Translate into Spanish</div>
      <ol class="pe-tr">${translate.map((t) => `<li><span>${t}</span><i></i></li>`).join('')}</ol>
    </div>
    <div class="pe-sec pe-story"><div class="pe-st"><b>D</b>Story cloze</div><p class="pe-ins">Ten gaps. Every missing word is from Units 1–10.</p>
      <div class="pe-tale"><h5>La pizza del martes</h5>
      <p>Esta <u>1</u> mi <u>2</u> quiso <u>3</u> algo nuevo: <u>4</u> el horno sin <u>5</u> ayuda. <u>6</u> cinco minutos abría la <u>7</u> del horno. «Es <u>8</u> lento», decía. Al final, toda la familia comió pizza fría. <u>9</u> el <u>10</u> intento salga mejor.</p></div>
    </div>
    <div class="pe-check"><div><b>Unit checkpoint</b><p>Cover the meanings on pages 54–55. Say each word's meaning out loud.</p></div>
      <div class="pe-score"><span>Recalled</span><i></i><span>/ 20</span></div>
      <div class="pe-rule">18 or more: move on. Fewer: repeat tomorrow's review twice.</div>
    </div>
    <div class="pe-folio r">57</div>
  </div></div>
</div>`

// ---------- interior: Signal spread ----------
const recall = [7, 13, 25, 34, 43, 57, 63, 72, 80, 84, 92, 99].map(byRank)
const choose = [
  ['¿______ estás? — Bien, gracias.', ['Cómo', 'Dónde', 'Quién']],
  ['No ______ nada de él desde el lunes.', ['sé', 'soy', 'voy']],
  ['Mi ______ vive cerca de la playa.', ['amigo', 'noche', 'verdad']],
  ['______ llueve, nos quedamos en casa.', ['Si', 'Pero', 'Hasta']],
  ['Ella ______ a casa a las ocho.', ['llega', 'mira', 'mata']],
  ['¿Qué quieres ______ esta noche?', ['hacer', 'haber', 'deber']],
]
let tracker = ''
for (let u = 1; u <= 25; u++) {
  const pct = Math.round(cov(u * 20))
  const mile = { 5: 'half of speech', 13: '', 25: 'short stories' }[u]
  tracker += `<div class="tr-row${u % 5 === 0 ? ' tr-five' : ''}"><span class="tr-u">${String(u).padStart(2, '0')}</span><span class="tr-r">${(u - 1) * 20 + 1}–${u * 20}</span><div class="tr-cells">${'<i></i>'.repeat(20)}</div><span class="tr-p">${pct}%</span></div>`
}
const keys = [
  ['A', '1 demasiado · 2 cada · 3 puerta · 4 familia · 5 cabeza · 6 lento'],
  ['B', '1c · 2d · 3f · 4b · 5e · 6a'],
  ['C', '1 Quizá vaya al cine esta noche. 2 Mi hermano está estudiando en la universidad. 3 Quiero terminar el rompecabezas antes de dormir. 4 Necesito algún consejo sobre cómo estudiar.'],
  ['D', '1 semana · 2 hermano · 3 intentar · 4 usar · 5 pedir · 6 Cada · 7 puerta · 8 demasiado · 9 Quizá · 10 segundo'],
]

const signalSpread = `<div class="spread sp-signal">
  <div class="page"><div class="pg">
    <div class="ps-run"><span>Cumulative test 1</span><span>Words 0001–0100</span></div>
    <div class="ps-hd"><h4>Test 1</h4><div class="ps-big"><b>50%</b><span>of everyday Spanish is built from the 100 words on this test.</span></div></div>
    <div class="ps-sec"><div class="ps-st"><span>A</span>Meaning recall <em>12 pts</em></div>
      <div class="ps-recall">${recall.map((w) => `<div><span class="ps-rk">${String(w.rank).padStart(4, '0')}</span><b>${esc(bare(w.word))}</b><i></i></div>`).join('')}</div>
    </div>
    <div class="ps-sec"><div class="ps-st"><span>B</span>Choose the word <em>6 pts</em></div>
      <ol class="ps-choose">${choose.map(([s, o]) => `<li><span>${s.replace('______', '<i></i>')}</span><div>${o.map((x) => `<em>${x}</em>`).join('')}</div></li>`).join('')}</ol>
    </div>
    <div class="ps-score"><div><span>Score</span><b><i></i>/ 18</b></div><div><span>Pass mark</span><b>16</b></div><div><span>Below 16</span><b>Redo Units 1–5 reviews</b></div></div>
    <div class="ps-folio">35</div>
  </div></div>
  <div class="page"><div class="pg">
    <div class="ps-run"><span>Progress tracker</span><span>500 words · 25 units</span></div>
    <div class="ps-hd2"><h4>Every word, one square.</h4><p>Fill a square when you recall the word on its +14 review. The right column is what the filled rows give you.</p></div>
    <div class="tr-head"><span>Unit</span><span>Ranks</span><span></span><span>Cover</span></div>
    <div class="tr">${tracker}</div>
    <div class="ps-key"><div class="ps-kh">Answer key · Unit 10</div>${keys.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>
    <div class="ps-folio r">146</div>
  </div></div>
</div>`

// ---------- TOC ----------
const TOC = [
  ['Front matter', 'Title, contents, how to read a word entry', '1–4', 4],
  ['Part I · The method', 'Why 500 words cover 67% · the mastery method · 40-day review calendar · placement check', '5–14', 10],
  ['Part II · Word units', '25 units × 20 words, ranks 1–500. Each unit: 2 pp word entries, 1 p practice (fill the gap, match), 1 p use it (translate, story cloze, checkpoint)', '15–118', 100],
  ['Cumulative tests', 'After every 100 words: Tests 1–5, 3 pp each, placed after Units 5, 10, 15, 20, 25', 'in Part II', 15],
  ['Final mastery test', '100 words sampled across all 500, with a coverage score', '119–122', 4],
  ['Answer key', 'All units, tests and the final test', '123–134', 12],
  ['Progress tracker', '500-square tracker, review log, coverage milestones', '135–138', 4],
  ['Index', 'A–Z word list with rank and unit', '139–146', 8],
  ['Notes', 'Lined pages', '147–148', 2],
]
// recompute running ranges honestly (tests interleaved in Part II)
let pg = 1
const tocRows = TOC.map(([a, b, , n]) => {
  if (a === 'Cumulative tests') return `<tr><td>${a}</td><td>${b}</td><td class="num">incl.</td><td class="num">${n}</td></tr>`
  const span = a === 'Part II · Word units' ? n + 15 : n
  const r = `${pg}–${pg + span - 1}`
  pg += span
  return `<tr><td>${a}</td><td>${b}</td><td class="num">${r}</td><td class="num">${span}</td></tr>`
}).join('')
const TOTAL = pg - 1

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Workbook Cover Concepts</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=block" rel="stylesheet">
<style>
${cab}
:root{
  --cream:#EFE9DE;--cream2:#E6DED0;--ink:#1C1A3A;--muted:#5E5C78;--line:rgba(28,26,58,.12);
  --ease:cubic-bezier(.23,1,.32,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--cream);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{font-family:'Cabinet Grotesk',system-ui,sans-serif;font-weight:300;color:var(--ink);background:var(--cream);font-size:17px;line-height:1.6}
::selection{background:#534AB7;color:#FAF7F2}
.wrap{max-width:1280px;margin:0 auto;padding:0 48px}
header.top{padding:96px 0 56px;display:grid;grid-template-columns:1.25fr 1fr;gap:64px;align-items:end;border-bottom:.5px solid var(--line)}
h1{font-family:'Fraunces',Georgia,serif;font-weight:900;font-size:76px;line-height:.98;letter-spacing:-.035em;font-variation-settings:'opsz' 144;text-wrap:balance}
header.top p{color:var(--muted);max-width:52ch}
.lineup{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:28px;border-top:.5px solid var(--line)}
.lineup div{padding:14px 12px 0 0}
.lineup b{display:block;font-family:'Fraunces',serif;font-weight:700;font-size:22px;letter-spacing:-.02em;font-variant-numeric:lining-nums}
.lineup span{font-size:13px;color:var(--muted)}
section.concept{padding:88px 0 96px;border-bottom:.5px solid var(--line)}
.c-head{display:grid;grid-template-columns:1fr 1.35fr;gap:64px;align-items:start;margin-bottom:56px}
h2{font-family:'Fraunces',Georgia,serif;font-weight:900;font-size:54px;letter-spacing:-.03em;line-height:1;font-variation-settings:'opsz' 144}
h2 small{display:block;font-family:'Cabinet Grotesk';font-weight:500;font-size:15px;letter-spacing:0;color:var(--muted);margin-top:14px;line-height:1.5}
.c-notes{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.c-notes b{display:block;font-weight:500;font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px}
.c-notes p{font-size:15px;color:var(--muted);line-height:1.55}
.sw{display:flex;gap:6px;margin-top:10px}.sw i{width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 .5px rgba(0,0,0,.15)}
.series{display:grid;grid-template-columns:repeat(4,1fr);gap:36px;align-items:start}
figure{margin:0}
figcaption{display:flex;flex-direction:column;gap:2px;margin-top:22px;font-size:14px;padding-top:10px;border-top:.5px solid var(--line)}
figcaption b{font-weight:500;white-space:nowrap}figcaption span{color:var(--muted);font-variant-numeric:tabular-nums}

/* ---------- book object ---------- */
.book{position:relative;aspect-ratio:210/297;container-type:inline-size;border-radius:2px 5px 5px 2px;
  box-shadow:0 1px 1px rgba(28,26,58,.08),0 6px 14px -4px rgba(28,26,58,.18),0 28px 48px -18px rgba(28,26,58,.38);
  transition:transform 260ms var(--ease),box-shadow 260ms var(--ease)}
@media (hover:hover) and (pointer:fine){.book:hover{transform:translateY(-6px)}}
.face{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.book::before{content:'';position:absolute;z-index:5;left:0;top:0;bottom:0;width:4.2%;border-radius:2px 0 0 2px;pointer-events:none;
  background:linear-gradient(90deg,rgba(0,0,0,.22),rgba(255,255,255,.18) 38%,rgba(0,0,0,.08) 62%,rgba(0,0,0,0))}
.book::after{content:'';position:absolute;z-index:4;inset:0;border-radius:inherit;pointer-events:none;background-image:${GRAIN};opacity:.16;mix-blend-mode:multiply}

/* Clarity */
.clarity{--navy:#141C52;--or:#F06A35;font-family:'Outfit',sans-serif;color:var(--navy)}
.clarity .face{background:linear-gradient(160deg,var(--a) 0%,var(--b) 100%)}
.cl-1{--a:#E9EDFF;--b:#BCC7FB}.cl-2{--a:#D6DDFE;--b:#9DAEF5}.cl-3{--a:#BFCAFB;--b:#7F93EC}.cl-4{--a:#A6B4F6;--b:#5F74DE}
.cl-ring{position:absolute;width:118cqw;height:118cqw;border-radius:50%;right:-52cqw;top:-30cqw;border:12cqw solid rgba(255,255,255,.34)}
.cl-ring2{width:70cqw;height:70cqw;right:-28cqw;top:-6cqw;border-width:1px;border-color:rgba(255,255,255,.7)}
.cl-top{position:absolute;left:8cqw;right:7cqw;top:7cqw;display:flex;justify-content:space-between;align-items:center;font-size:3.3cqw;font-weight:500;letter-spacing:.01em}
.cl-mark{display:flex;align-items:center;gap:1.6cqw;font-weight:600}
.cl-mark svg{width:5cqw;height:5cqw;fill:none;stroke:var(--navy);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cl-mark svg path{stroke:var(--or)}
.cl-num{position:absolute;left:7cqw;top:24cqw;font-weight:800;font-size:27cqw;line-height:.9;letter-spacing:-.05em;font-variant-numeric:lining-nums}
.cl-bar{position:absolute;left:8cqw;right:8cqw;top:56cqw;display:grid;grid-template-columns:repeat(4,1fr);gap:1.4cqw}
.cl-bar i{height:2.4cqw;border-radius:9px;background:rgba(255,255,255,.62)}
.cl-bar i.done{background:var(--navy)}.cl-bar i.now{background:var(--or)}
.cl-barl{position:absolute;left:8cqw;right:8cqw;top:60.4cqw;display:grid;grid-template-columns:repeat(4,1fr);gap:1.4cqw;font-size:2.7cqw;font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}
.cl-card{position:absolute;left:6cqw;right:6cqw;bottom:6cqw;background:#FBFCFF;border-radius:4.2cqw;padding:7cqw 7cqw 6.5cqw;box-shadow:0 2cqw 6cqw -2cqw rgba(20,28,82,.25)}
.cl-title{font-weight:700;font-size:9.2cqw;line-height:1;letter-spacing:-.03em}
.cl-card p{font-size:3.6cqw;line-height:1.4;margin-top:3cqw;color:#3B4278;font-weight:400;max-width:62cqw}
.cl-cov{display:flex;align-items:center;gap:3cqw;margin-top:5cqw;padding-top:4.5cqw;border-top:1px solid #E3E7F7}
.cl-cov b{font-size:9cqw;font-weight:800;color:var(--or);letter-spacing:-.03em;line-height:1}
.cl-cov span{font-size:3.2cqw;line-height:1.25;font-weight:500}

/* Editorial */
.editorial{font-family:'Fraunces',serif}
.editorial .face{background:#F1E9DA}
.ed-1{--c:#A64B2A}.ed-2{--c:#5E6127}.ed-3{--c:#2D4656}.ed-4{--c:#26221F}
.ed-head{position:absolute;left:9cqw;right:8cqw;top:8cqw;display:flex;justify-content:space-between;padding-bottom:3.4cqw;border-bottom:1px solid rgba(38,34,31,.45);font-family:'Cabinet Grotesk';font-weight:500;font-size:3cqw;letter-spacing:.16em;text-transform:uppercase;color:#3A332D}
.ed-title{position:absolute;left:9cqw;top:20cqw;font-weight:600;font-size:8.6cqw;letter-spacing:-.02em;color:#26221F;font-variation-settings:'opsz' 72}
.ed-num{position:absolute;left:7.6cqw;top:31.5cqw;font-weight:900;font-size:30cqw;line-height:1;letter-spacing:-.055em;color:var(--c);font-variation-settings:'opsz' 144;font-variant-numeric:lining-nums}
.ed-sub{position:absolute;left:9cqw;right:14cqw;top:66cqw;font-weight:400;font-size:3.9cqw;line-height:1.38;color:#3A332D;font-variation-settings:'opsz' 14}
.ed-panel{position:absolute;left:0;right:0;bottom:0;background:var(--c);color:#F1E9DA;padding:7cqw 9cqw 7.5cqw;display:flex;flex-direction:column;justify-content:space-between}
.ed-claim{font-weight:700;font-size:7.4cqw;line-height:1.08;letter-spacing:-.02em;max-width:70cqw;font-variation-settings:'opsz' 72}
.ed-foot{display:flex;justify-content:space-between;font-family:'Cabinet Grotesk';font-weight:500;font-size:2.9cqw;letter-spacing:.12em;text-transform:uppercase;padding-top:3.2cqw;border-top:1px solid rgba(241,233,218,.4);opacity:.92}

/* Signal */
.signal{font-family:'Hanken Grotesk',sans-serif;color:#E9E8FA;font-variant-numeric:tabular-nums}
.signal .face{background:radial-gradient(120% 80% at 80% 0%,var(--hi) 0%,rgba(0,0,0,0) 60%),linear-gradient(180deg,var(--a),var(--b))}
.sg-1{--a:#0D1230;--b:#111843;--hi:#22296A}.sg-2{--a:#101338;--b:#16194F;--hi:#2C2B83}.sg-3{--a:#13133F;--b:#1C1A5C;--hi:#38329A}.sg-4{--a:#171546;--b:#231E6B;--hi:#4639B0}
.sg-head{position:absolute;left:8cqw;right:8cqw;top:7.5cqw;display:flex;justify-content:space-between;font-size:2.9cqw;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#A9A6E6}
.sg-title{position:absolute;left:7.4cqw;top:16cqw;font-weight:500;font-size:9cqw;letter-spacing:-.02em;line-height:1;color:#C9C6F5}
.sg-title b{display:block;font-weight:800;font-size:25cqw;letter-spacing:-.055em;color:#F5F4FF;margin-top:1.5cqw;line-height:.92}
.sg-sub{position:absolute;left:8cqw;top:54cqw;font-size:3.5cqw;font-weight:500;color:#A9A6E6}
.sg-chart{position:absolute;left:4.5cqw;right:4.5cqw;top:62cqw;width:91cqw;overflow:visible}
.sg-chart .g{stroke:rgba(169,166,230,.14);stroke-width:.6}
.sg-chart .ax{stroke:rgba(169,166,230,.5);stroke-width:.8}
.sg-chart .curve{fill:none;stroke:rgba(169,166,230,.55);stroke-width:1.4}
.sg-chart .seg{fill:none;stroke:#F5F4FF;stroke-width:2.4;stroke-linecap:round}
.sg-chart .band{fill:rgba(124,114,240,.28)}
.sg-chart .drop{stroke:#E2B65A;stroke-width:.8;stroke-dasharray:2 2.5;opacity:.85}
.sg-chart .halo{fill:rgba(226,182,90,.22)}
.sg-chart .pt{fill:#E2B65A}
.sg-chart .pl{fill:#E2B65A;font-family:'Hanken Grotesk';font-weight:700;font-size:15px;font-variant-numeric:tabular-nums}
.sg-chart .t{fill:#8D8AC9;font-family:'Hanken Grotesk';font-size:8.5px;font-weight:500}
.sg-data{position:absolute;left:8cqw;right:8cqw;bottom:7cqw;display:grid;grid-template-columns:1.5fr 1fr .7fr;border-top:1px solid rgba(169,166,230,.3);padding-top:3.4cqw}
.sg-data span{display:block;font-size:2.6cqw;letter-spacing:.12em;text-transform:uppercase;color:#8D8AC9;font-weight:600}
.sg-data b{display:block;font-size:4.4cqw;font-weight:700;margin-top:1cqw;color:#F5F4FF}

/* ---------- structure section ---------- */
section.structure{padding:96px 0 40px}
.st-grid{display:grid;grid-template-columns:1.45fr 1fr;gap:64px;margin-top:48px;align-items:start}
table.toc{width:100%;border-collapse:collapse;font-size:15px}
.toc th{text-align:left;font-weight:500;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:0 12px 10px 0;border-bottom:1px solid var(--ink)}
.toc td{padding:14px 12px 14px 0;border-bottom:.5px solid var(--line);vertical-align:top;line-height:1.45}
.toc td:first-child{font-weight:500;width:26%}
.toc td:nth-child(2){color:var(--muted)}
.toc .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;width:9%}
.toc tfoot td{border-bottom:0;border-top:1px solid var(--ink);font-weight:500;color:var(--ink)}
.side h3{font-family:'Fraunces',serif;font-weight:700;font-size:22px;letter-spacing:-.015em;margin-bottom:10px}
.side p,.side li{font-size:15px;color:var(--muted);line-height:1.6}
.side ul{list-style:none;margin-top:8px}
.side li{padding:10px 0;border-top:.5px solid var(--line)}
.side li b{color:var(--ink);font-weight:500}
.side .blk{margin-bottom:40px}
.flag{background:#F7E7DF;border-radius:12px;padding:18px 20px;color:#6B2A14}
.flag b{font-weight:500}
.flag p{color:#6B2A14}

.spreads{padding:24px 0 120px}
.sp-label{display:flex;justify-content:space-between;align-items:baseline;margin:72px 0 22px;gap:24px}
.sp-label h3{font-family:'Fraunces',serif;font-weight:700;font-size:28px;letter-spacing:-.02em}
.sp-label p{font-size:15px;color:var(--muted);max-width:60ch;text-align:right}

/* ---------- spreads ---------- */
.spread{display:grid;grid-template-columns:1fr 1fr;position:relative;box-shadow:0 2px 3px rgba(28,26,58,.08),0 40px 70px -30px rgba(28,26,58,.4);border-radius:3px}
.spread::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:90px;transform:translateX(-50%);pointer-events:none;
  background:linear-gradient(90deg,rgba(0,0,0,0),rgba(28,26,58,.07) 40%,rgba(28,26,58,.16) 50%,rgba(28,26,58,.07) 60%,rgba(0,0,0,0))}
.page{aspect-ratio:210/297;container-type:inline-size;position:relative;overflow:hidden}
.page:first-child{border-radius:3px 0 0 3px}.page:last-child{border-radius:0 3px 3px 0}
.pg{position:absolute;inset:0;padding:8cqw 8.5cqw 9cqw}
.page:first-child .pg{padding-right:10.5cqw}.page:last-child .pg{padding-left:10.5cqw}

/* Clarity interior */
.sp-clarity .page{background:#FBFCFF;font-family:'Outfit',sans-serif;color:#141C52}
.pc-run,.pe-run,.ps-run{display:flex;justify-content:space-between;font-size:1.85cqw;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#5A6092;padding-bottom:2cqw;border-bottom:1px solid #E3E7F7}
.pc-h{font-weight:700;font-size:6.4cqw;line-height:1.05;letter-spacing:-.03em;margin-top:6cqw}
.pc-lead{font-size:2.35cqw;line-height:1.55;color:#3B4278;margin-top:3cqw;max-width:72cqw}
.pc-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2.4cqw;margin-top:4.5cqw}
.pc-steps div{background:#EEF1FE;border-radius:2.4cqw;padding:3cqw}
.pc-steps b{display:block;font-weight:700;font-size:3.4cqw;letter-spacing:-.02em;color:#C9461A;font-variant-numeric:tabular-nums}
.pc-steps span{display:block;font-weight:600;font-size:2.4cqw;margin-top:.6cqw}
.pc-steps p{font-size:1.95cqw;line-height:1.45;color:#3B4278;margin-top:1.2cqw}
.pc-calh{display:flex;justify-content:space-between;align-items:center;margin-top:5cqw;font-size:2.4cqw}
.pc-calh b{font-weight:700;font-size:2.9cqw}
.pc-calh span{display:flex;align-items:center;gap:1cqw;font-size:1.8cqw;color:#5A6092}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:.8cqw;margin-top:2cqw}
.cal-w{font-size:1.7cqw;font-weight:600;color:#5A6092;text-transform:uppercase;letter-spacing:.06em;padding-bottom:.4cqw}
.cal-d{border:1px solid #DDE2F6;border-radius:1.3cqw;height:9.6cqw;padding:.9cqw 1cqw;display:flex;flex-direction:column;align-items:flex-start;gap:.5cqw}
.cal-d>span{display:flex;justify-content:space-between;align-self:stretch;font-size:1.6cqw;font-weight:600;color:#5A6092;font-variant-numeric:tabular-nums}
.cal-d>span b{font-weight:700;color:#141C52}
.cal-d.test{border-color:#141C52;border-width:1.5px}
.cal-d small,.pc-calh small{font-size:1.5cqw;color:#5A6092;font-weight:500;font-variant-numeric:tabular-nums;word-spacing:.2em}
.cw{display:grid;grid-template-columns:5.4cqw 1fr 5.6cqw;gap:1.8cqw;padding:1.45cqw 0 1.35cqw;border-bottom:1px solid #E3E7F7}
.cw-h b{font-weight:700;font-size:3.2cqw;letter-spacing:-.02em}
.cw-ex{font-size:1.85cqw;color:#3B4278;margin-top:.5cqw;line-height:1.4}
.cw-write{flex:1;min-width:14cqw;align-self:flex-end}
.cw-write i{display:block;border-bottom:1px solid #C9CFEA;height:1px}
.cw-box{display:grid;grid-template-columns:repeat(2,1fr);gap:.6cqw;align-content:start;padding-top:.4cqw}
.pe-h{font-weight:900;font-size:7.6cqw;letter-spacing:-.045em;line-height:1;margin-top:4cqw;color:#A64B2A;font-variation-settings:'opsz' 144}
.pe-tale p{font-size:2.7cqw;line-height:2;margin-top:1.2cqw;font-variation-settings:'opsz' 14;text-wrap:pretty}
.cal-d.off{border-style:dashed;opacity:.5}
em{font-style:normal}
.cal em,.pc-calh em{font-size:1.55cqw;font-weight:600;line-height:1;padding:.45cqw .7cqw;border-radius:9px;background:#E3E7FB;color:#141C52;font-variant-numeric:tabular-nums}
.cal em.n,.pc-calh em.n{background:#C9461A;color:#fff}
.cal em.t,.pc-calh em.t{background:#141C52;color:#fff}
.pc-note{font-size:1.95cqw;color:#5A6092;margin-top:2.4cqw;line-height:1.45}
.pc-folio,.pe-folio,.ps-folio{position:absolute;bottom:4.5cqw;left:8.5cqw;font-size:1.9cqw;font-weight:600;font-variant-numeric:tabular-nums;color:#5A6092}
.pc-folio.r,.pe-folio.r,.ps-folio.r{left:auto;right:8.5cqw}
.pc-uh{display:flex;justify-content:space-between;align-items:end;margin-top:4cqw;padding-bottom:2.4cqw}
.pc-uh h4{font-weight:800;font-size:8.6cqw;letter-spacing:-.04em;line-height:.9}
.pc-umeta{text-align:right;font-size:1.95cqw;color:#5A6092;line-height:1.5}
.pc-umeta span{display:block}.pc-umeta span:first-child{color:#C9461A;font-weight:700;font-size:2.4cqw}
.cws{border-top:1.5px solid #141C52}
.cw-r{font-size:1.9cqw;font-weight:600;color:#C9461A;font-variant-numeric:tabular-nums;padding-top:.9cqw}
.cw-h{display:flex;align-items:baseline;gap:1.6cqw;flex-wrap:wrap}
.cw-pos{font-size:1.7cqw;font-weight:600;color:#5A6092;background:#EEF1FE;padding:.2cqw .9cqw;border-radius:9px}
.cw-m{font-size:2.15cqw;color:#141C52;font-weight:500}
.cw-ex span{color:#8D92B8}
.cw-box i{aspect-ratio:1;border:1px solid #C3CAEC;border-radius:.6cqw}

/* Editorial interior */
.sp-editorial .page{background:#F4EDE0;color:#26221F;font-family:'Fraunces',serif}
.sp-editorial .page::after{content:'';position:absolute;inset:0;background-image:${GRAIN};opacity:.1;mix-blend-mode:multiply;pointer-events:none}
.pe-run{font-family:'Cabinet Grotesk';color:#6E6358;border-color:rgba(38,34,31,.35);letter-spacing:.16em}
.pe-sec{margin-top:4.4cqw}
.page:last-child .pe-sec:first-of-type{margin-top:6cqw}
.pe-st{display:flex;align-items:baseline;gap:2cqw;font-weight:700;font-size:3.6cqw;letter-spacing:-.015em;padding-bottom:1.4cqw;border-bottom:1px solid rgba(38,34,31,.75)}
.pe-st b{font-weight:900;color:#A64B2A;font-size:3.6cqw}
.pe-ins{font-size:2.15cqw;color:#6E6358;margin-top:1.6cqw;font-variation-settings:'opsz' 14;line-height:1.45}
.pe-gaps{list-style:none;counter-reset:g;margin-top:1.2cqw}
.pe-gaps li{counter-increment:g;display:grid;grid-template-columns:4cqw 1fr;column-gap:1cqw;padding:.85cqw 0;border-bottom:1px solid rgba(38,34,31,.13)}
.pe-gaps li::before{content:counter(g);font-family:'Cabinet Grotesk';font-weight:500;font-size:1.9cqw;color:#A64B2A;padding-top:.6cqw;grid-row:span 2}
.pe-gaps span{font-size:2.75cqw;font-weight:400;font-variation-settings:'opsz' 14}
.pe-gaps i{display:inline-block;width:17cqw;border-bottom:1px solid #26221F;margin:0 .6cqw;transform:translateY(.3cqw)}
.pe-gaps small{font-family:'Cabinet Grotesk';font-size:1.85cqw;color:#8A7F73;font-weight:300}
.pe-bank{margin-top:1.8cqw;font-family:'Cabinet Grotesk';font-weight:500;font-size:2cqw;letter-spacing:.04em;color:#5E6127;border:1px solid rgba(94,97,39,.5);border-radius:99px;padding:1.2cqw 2.6cqw;display:inline-block}
.pe-match{display:grid;grid-template-columns:1fr 1fr;column-gap:12cqw;margin-top:2cqw}
.pe-match ul{list-style:none}
.pe-match li{display:flex;align-items:center;gap:1.6cqw;font-size:2.8cqw;padding:.55cqw 0;font-variation-settings:'opsz' 14}
.pe-match ul:first-child li{font-weight:600}
.pe-match ul:first-child li i{margin-left:auto}
.pe-match li span{font-family:'Cabinet Grotesk';font-weight:500;font-size:1.9cqw;color:#A64B2A;width:2.4cqw}
.pe-match ul:last-child li span{margin-left:auto;text-align:right}
.pe-match li i{width:1.5cqw;height:1.5cqw;border-radius:50%;background:#26221F;flex:none}
.pe-tr{list-style:none;counter-reset:t;margin-top:1.4cqw}
.pe-tr li{counter-increment:t;padding:1.9cqw 0 0;display:grid;grid-template-columns:4cqw 1fr;column-gap:1cqw}
.pe-tr li::before{content:counter(t);font-family:'Cabinet Grotesk';font-weight:500;font-size:1.9cqw;color:#A64B2A;padding-top:.5cqw;grid-row:span 2}
.pe-tr span{font-size:2.6cqw;font-variation-settings:'opsz' 14;color:#3A332D}
.pe-tr i{display:block;border-bottom:1px solid rgba(38,34,31,.5);height:5.2cqw}
.pe-tale{margin-top:2.4cqw;background:#EBE1CF;border-radius:1.6cqw;padding:4cqw 4.4cqw}
.pe-tale h5{font-weight:900;font-size:4.6cqw;letter-spacing:-.025em;color:#2D4656;font-variation-settings:'opsz' 96}
.pe-tale u{text-decoration:none;display:inline-block;min-width:13cqw;border-bottom:1px solid #26221F;text-align:left;font-family:'Cabinet Grotesk';font-size:1.7cqw;font-weight:500;color:#A64B2A;line-height:1.2;vertical-align:baseline}
.pe-check{margin-top:5cqw;display:grid;grid-template-columns:1fr auto;gap:1.6cqw 4cqw;border:1px solid #26221F;border-radius:1.6cqw;padding:3.4cqw 4cqw}
.pe-check b{font-weight:700;font-size:3.2cqw;letter-spacing:-.015em}
.pe-check p{font-size:2.1cqw;color:#6E6358;margin-top:.6cqw;font-variation-settings:'opsz' 14;line-height:1.45}
.pe-score{display:flex;align-items:end;gap:1.2cqw;font-family:'Cabinet Grotesk';font-size:2cqw;font-weight:500;color:#6E6358}
.pe-score i{width:9cqw;height:7cqw;border:1px solid #26221F;border-radius:1cqw}
.pe-rule{grid-column:1/-1;font-family:'Cabinet Grotesk';font-size:1.95cqw;font-weight:500;color:#5E6127;padding-top:1.6cqw;border-top:1px solid rgba(38,34,31,.2)}
.pe-folio{font-family:'Cabinet Grotesk';color:#6E6358}

/* Signal interior */
.sp-signal .page{background:#F7F7FC;color:#121640;font-family:'Hanken Grotesk',sans-serif;font-variant-numeric:tabular-nums}
.ps-run{color:#5A5E92;border-color:#DCDDF0;letter-spacing:.12em;font-weight:600}
.ps-hd{display:grid;grid-template-columns:1fr 1.15fr;gap:4cqw;align-items:end;margin-top:5.5cqw;padding-bottom:3.4cqw;border-bottom:1.5px solid #121640}
.ps-hd h4{font-weight:800;font-size:10cqw;letter-spacing:-.05em;line-height:.9}
.ps-big b{display:block;font-weight:800;font-size:6.4cqw;letter-spacing:-.04em;color:#3B33B5;line-height:1}
.ps-big span{display:block;font-size:2cqw;color:#5A5E92;margin-top:.8cqw;line-height:1.4}
.ps-sec{margin-top:3.6cqw}
.ps-st{display:flex;align-items:center;gap:1.8cqw;font-weight:700;font-size:2.8cqw;letter-spacing:-.01em}
.ps-st span{width:4cqw;height:4cqw;border-radius:50%;background:#121640;color:#F7F7FC;display:grid;place-items:center;font-size:2cqw}
.ps-st em{margin-left:auto;font-size:1.9cqw;font-weight:600;color:#5A5E92;letter-spacing:.06em;text-transform:uppercase}
.ps-recall{display:grid;grid-template-columns:1fr 1fr;column-gap:5cqw;margin-top:1.6cqw}
.ps-recall div{display:grid;grid-template-columns:7cqw 13cqw 1fr;align-items:end;gap:1.4cqw;padding:1.45cqw 0;border-bottom:1px solid #E3E4F2}
.ps-rk{font-size:1.75cqw;color:#9A9DC6;font-weight:600}
.ps-recall b{font-size:2.75cqw;font-weight:700}
.ps-recall i{border-bottom:1px solid #A7AAD3;height:2.4cqw}
.ps-choose{list-style:none;counter-reset:c;margin-top:1.4cqw}
.ps-choose li{counter-increment:c;display:grid;grid-template-columns:4cqw 1fr auto;align-items:center;gap:1.4cqw;padding:1.45cqw 0;border-bottom:1px solid #E3E4F2;font-size:2.45cqw}
.ps-choose li::before{content:counter(c);font-size:1.75cqw;color:#9A9DC6;font-weight:600}
.ps-choose li span i{display:inline-block;width:11cqw;border-bottom:1px solid #121640;margin:0 .6cqw}
.ps-choose li div{display:flex;gap:.9cqw}
.ps-choose em{font-size:1.85cqw;font-weight:600;border:1px solid #C7C9E6;border-radius:99px;padding:.4cqw 1.5cqw}
.ps-score{display:grid;grid-template-columns:1fr .8fr 1.6fr;margin-top:3.2cqw;background:#121640;color:#F7F7FC;border-radius:1.8cqw;padding:3cqw 3.4cqw}
.ps-score span{display:block;font-size:1.6cqw;letter-spacing:.12em;text-transform:uppercase;color:#A9A6E6;font-weight:600}
.ps-score b{display:flex;align-items:end;gap:1cqw;font-size:3cqw;font-weight:700;margin-top:.8cqw}
.ps-score i{width:7cqw;height:4.4cqw;border-bottom:1.5px solid #E2B65A}
.ps-score div:last-child b{font-size:2.3cqw;font-weight:600;color:#E2B65A}
.ps-folio{color:#5A5E92}
.ps-hd2{margin-top:5cqw}
.ps-hd2 h4{font-weight:800;font-size:5.6cqw;letter-spacing:-.04em;line-height:1}
.ps-hd2 p{font-size:2.05cqw;color:#5A5E92;margin-top:1.4cqw;line-height:1.45;max-width:66cqw}
.tr-head{display:grid;grid-template-columns:4cqw 9.6cqw 1fr 6cqw;gap:1.2cqw;margin-top:3.6cqw;font-size:1.55cqw;letter-spacing:.1em;text-transform:uppercase;color:#9A9DC6;font-weight:600;padding-bottom:.8cqw}
.tr-head span:last-child{text-align:right}
.tr-row{display:grid;grid-template-columns:4cqw 9.6cqw 1fr 6cqw;gap:1.2cqw;align-items:center;height:2.62cqw}
.tr-five{margin-bottom:1.1cqw}
.tr-u{font-size:1.6cqw;font-weight:700}
.tr-r{font-size:1.5cqw;color:#5A5E92}
.tr-cells{display:grid;grid-template-columns:repeat(20,1fr);gap:.4cqw}
.tr-cells i{height:2.15cqw;border:1px solid #C7C9E6;border-radius:.35cqw}
.tr-row:nth-child(-n+7) .tr-cells i{background:#D9D7F7;border-color:#B9B5F0}
.tr-row:nth-child(8) .tr-cells i:nth-child(-n+11){background:#D9D7F7;border-color:#B9B5F0}
.tr-p{font-size:1.65cqw;font-weight:700;text-align:right;color:#3B33B5}
.tr-five .tr-p{color:#121640}
.ps-key{margin-top:3cqw;border-top:1.5px solid #121640;padding-top:2cqw;font-size:1.65cqw;line-height:1.45}
.ps-kh{font-weight:700;font-size:2.1cqw;margin-bottom:1cqw}
.ps-key div:not(.ps-kh){display:grid;grid-template-columns:3cqw 1fr;padding:.5cqw 0;color:#3E4270}
.ps-key b{font-weight:800;color:#3B33B5}
</style></head>
<body>
<div class="wrap">
<header class="top">
  <div><h1>Four workbooks. Three cover systems.</h1></div>
  <div><p>Printable PDF workbooks sold at €5 each. The Top 500 is the flagship: deep practice and a mastery method. Each later book takes the next band of words. Every concept below has to say one thing at a glance: how far this book takes you.</p>
  <div class="lineup">${LEVELS.map((L) => `<div><b>Top ${L.n}</b><span>Words ${L.range} · ≈${L.cov}%</span></div>`).join('')}</div></div>
</header>

<section class="concept">
  <div class="c-head"><h2>Clarity<small>Calm, exam-prep confidence. Reads like a trusted course book, not an app.</small></h2>
    <div class="c-notes">
      <div><b>Level signal</b><p>The periwinkle deepens one step per book, and the four-segment bar fills: navy for books behind you, orange for the one in your hands.</p></div>
      <div><b>Type</b><p>Outfit, a geometric sans, at 800 for the numeral. One size for all four numerals, so the series lines up on a shelf.</p></div>
      <div><b>Palette</b><p>Periwinkle gradients, white, navy, one orange accent.</p><div class="sw"><i style="background:#E9EDFF"></i><i style="background:#9DAEF5"></i><i style="background:#5F74DE"></i><i style="background:#141C52"></i><i style="background:#C9461A"></i></div></div>
    </div></div>
  ${series(clarityCover)}
</section>

<section class="concept">
  <div class="c-head"><h2>Editorial<small>Warm paper and a big serif numeral. The restraint of a modern-classics paperback.</small></h2>
    <div class="c-notes">
      <div><b>Level signal</b><p>The colour field rises with coverage: its height is set by the book's percentage, so the 2,000 book visibly holds more ink than the 500. One colour per book.</p></div>
      <div><b>Type</b><p>Fraunces 900 for the numeral, Fraunces 700 for the promise, Cabinet Grotesk caps for the series line.</p></div>
      <div><b>Palette</b><p>Paper, terracotta, olive, slate ink, near-black ink.</p><div class="sw"><i style="background:#F1E9DA"></i><i style="background:#A64B2A"></i><i style="background:#5E6127"></i><i style="background:#2D4656"></i><i style="background:#26221F"></i></div></div>
    </div></div>
  ${series(editorialCover)}
</section>

<section class="concept">
  <div class="c-head"><h2>Signal<small>The product's own argument as the cover: the coverage curve, with this book's point marked.</small></h2>
    <div class="c-notes">
      <div><b>Level signal</b><p>The same curve on every cover. The highlighted band and the gold point move right along it, from 67% to 84%. Background shifts navy to indigo.</p></div>
      <div><b>Type</b><p>Hanken Grotesk with tabular figures throughout, so ranks and percentages align like a data sheet.</p></div>
      <div><b>Palette</b><p>Deep navy, indigo, lavender greys, one gold.</p><div class="sw"><i style="background:#0D1230"></i><i style="background:#231E6B"></i><i style="background:#7C72F0"></i><i style="background:#A9A6E6"></i><i style="background:#E2B65A"></i></div></div>
    </div></div>
  ${series(signalCover)}
</section>

<section class="structure">
  <div class="c-head" style="margin-bottom:0"><h2>Inside the Top 500<small>Workbook structure for the flagship. ${TOTAL} pages, A4, printable at home in black and white with no loss of meaning.</small></h2>
  <div class="c-notes">
    <div><b>Unit size</b><p>25 units of 20 words, in strict rank order. One unit per day.</p></div>
    <div><b>Review rhythm</b><p>Each unit returns on day +1, +3, +7 and +14. A cumulative test every 100 words.</p></div>
    <div><b>Daily time</b><p>About 25 minutes. 25 days of new words, 40 days to finish.</p></div>
  </div></div>
  <div class="st-grid">
    <table class="toc"><thead><tr><th>Section</th><th>Contents</th><th class="num">Pages</th><th class="num">pp</th></tr></thead>
      <tbody>${tocRows}</tbody>
      <tfoot><tr><td>Total</td><td></td><td class="num"></td><td class="num">${TOTAL}</td></tr></tfoot></table>
    <div class="side">
      <div class="blk"><h3>Every unit, 4 pages</h3><ul>
        <li><b>Pp 1–2, word entries.</b> Rank, word, part of speech, meaning, the real example sentence with translation, a write-it line and four review tick-boxes.</li>
        <li><b>P 3, practice.</b> Fill the gap from the unit's own sentences, plus a 6-item match.</li>
        <li><b>P 4, use it.</b> Translate into Spanish, a 10-gap story cloze that recycles earlier units, and the unit checkpoint (18/20 to move on).</li></ul></div>
      <div class="blk"><h3>Top 1,000, 1,500, 2,000</h3><ul>
        <li><b>Next band only.</b> Each covers 500 new ranks (501–1,000, 1,001–1,500, 1,501–2,000) and assumes the bands before it.</li>
        <li><b>Lighter per word.</b> 25 words per unit on one page of entries; practice shifts from single sentences to longer stories, since the reader already has the core 500.</li>
        <li><b>Mixed-band tests.</b> Cumulative tests pull 20% of items from earlier books, so old words stay alive. About 110–120 pages each.</li></ul></div>
      <div class="flag"><p><b>Data gap for the Top 2,000.</b> <code>data/words.json</code> holds 1,500 ranked words today. The 2,000 book needs ranks 1,501–2,000 added, with meanings, POS and example sentences, before it can be typeset.</p></div>
    </div>
  </div>
</section>

<section class="spreads">
  <div class="sp-label"><h3>Clarity interior: method and word entries</h3><p>Left: the mastery method and the real 40-day review calendar. Right: Unit 10, words 181–190, from words.json.</p></div>
  ${claritySpread}
  <div class="sp-label"><h3>Editorial interior: practice pages</h3><p>Unit 10 exercises: fill the gap, match, translate, story cloze and the unit checkpoint.</p></div>
  ${editorialSpread}
  <div class="sp-label"><h3>Signal interior: test and tracker</h3><p>Left: cumulative test after the first 100 words. Right: the 500-square progress tracker with coverage per row, and the Unit 10 answer key.</p></div>
  ${signalSpread}
</section>
</div>
</body></html>`


const SPLIT = '/* ---------- spreads ---------- */'
function scaleCss(src) {
  const [head, rest] = src.split(SPLIT)
  const [css, tail] = rest.split('</style>')
  const scaled = css.split('\n').map((l) => /^\.pg\{|^\.page:(first|last)-child \.pg|folio/.test(l) ? l : l.replace(/(\d*\.?\d+)cqw/g, (m, n) => +(n * 0.82).toFixed(2) + 'cqw')).join('\n')
  return head + SPLIT + scaled + '</style>' + tail
}
fs.writeFileSync(path.join(ROOT, 'Design/workbooks/concepts.html'), scaleCss(html))
console.log('written', (html.length / 1024).toFixed(0) + 'KB', 'pages', TOTAL)
