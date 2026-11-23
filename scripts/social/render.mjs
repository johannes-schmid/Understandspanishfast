import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'marketing', 'reddit')
const words = JSON.parse(readFileSync(join(ROOT, 'data', 'words.json'), 'utf8'))

const W = 1080
const H = 1350
const SCALE = 2

const SOURCE = 'Ranked by frequency in spoken Spanish, compiled mainly from film and TV subtitles. Coverage figures are approximate.'
const SITE = 'mostcommonspanish.com'

const WORD_OVERRIDE = { 65: 'Dios' }
const MEANING_OVERRIDE = { 81: 'time (once, twice)', 96: 'friend' }
const EL_FEMININE = new Set(['agua', 'alma', 'arma', 'hambre', 'área', 'águila', 'hacha', 'ala', 'aula', 'arte'])

function display(w) {
  if (WORD_OVERRIDE[w.rank]) return WORD_OVERRIDE[w.rank]
  const bare = w.word.replace(/^(un|una) /, '')
  if (w.pos === 'n.m.') return `el ${bare}`
  if (w.pos === 'n.f.') return `${EL_FEMININE.has(bare) ? 'el' : 'la'} ${bare}`
  return bare
}
const meaning = (w) => MEANING_OVERRIDE[w.rank] ?? w.meanings[0]
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const rankOf = (lemma) => words.find((w) => w.word.replace(/^(un|una) /, '') === lemma)?.rank

const CSS = `
:root{
  --navy:#14204a;--ink-2:#4b5478;--ink-3:#565e80;--line:#dfe2f3;--line-2:#eceefa;
  --paper:#fcfcff;--paper-2:#f5f6fd;--peri-1:#e3e6fb;--peri-2:#d4d8f7;--lilac:#c9c3f2;
  --coral:#f26b3a;--coral-ink:#b23d12;--coral-soft:#fde9e0;
  --sans:'Plus Jakarta Sans',ui-sans-serif,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;background:var(--paper);color:var(--navy);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.sheet{width:${W}px;height:${H}px;padding:50px 56px 34px;display:flex;flex-direction:column;position:relative;overflow:hidden;
  background:radial-gradient(520px 340px at 100% 0%,rgba(201,195,242,.45),rgba(201,195,242,0) 70%),var(--paper)}
h1{font-size:var(--h1,58px);line-height:1;letter-spacing:-.045em;font-weight:800;text-wrap:balance}
h1 .soft{color:var(--ink-3)}
.sub{margin-top:16px;font-size:21px;line-height:1.4;color:var(--ink-2);max-width:880px;text-wrap:pretty}
.tab{font-variant-numeric:tabular-nums}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;gap:32px;padding-top:14px;border-top:1px solid var(--line)}
.src{font-size:14px;line-height:1.45;color:var(--ink-3);max-width:700px}
.site{font:600 15px/1 var(--mono);color:var(--ink-2);white-space:nowrap}

.grid5{margin-top:20px;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-flow:column;grid-template-rows:repeat(20,auto);column-gap:14px}
.cell{display:grid;grid-template-columns:30px 1fr;align-items:baseline;padding:3px 0 4px;border-bottom:1px solid var(--line-2)}
.cell.g5{border-bottom-color:var(--peri-2)}
.cell .r{font:500 12.5px/1 var(--mono);color:var(--ink-3)}
.cell .w{font-size:20.5px;line-height:1.08;font-weight:750;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cell .m{grid-column:2;font-size:14.5px;line-height:1.2;color:var(--ink-2);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cell.v .w{color:var(--coral-ink)}

.note{margin-top:14px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;background:var(--peri-1);border-radius:18px;padding:14px 22px}
.note.plain{grid-template-columns:1fr;padding:18px 24px}
.note .big{font-size:40px;font-weight:800;letter-spacing:-.04em;line-height:1;color:var(--navy)}
.note .big small{font-size:20px;letter-spacing:-.01em;font-weight:700;color:var(--ink-2);margin-left:4px}
.note p{font-size:16.5px;line-height:1.4;color:var(--navy);text-wrap:pretty}
.note b{font-weight:750}
.legend{white-space:nowrap}
.legend i{font-style:normal;font-weight:750;color:var(--coral-ink)}

.grid2{margin-top:30px;display:grid;grid-template-columns:1fr 1fr;grid-auto-flow:column;grid-template-rows:repeat(25,auto);column-gap:40px}
.vrow{display:grid;grid-template-columns:28px auto 1fr;align-items:baseline;gap:0 12px;padding:6px 0;border-bottom:1px solid var(--line-2)}
.vrow.g5{border-bottom-color:var(--peri-2)}
.vrow .r{font:500 13px/1 var(--mono);color:var(--ink-3)}
.vrow .w{font-size:25px;line-height:1.1;font-weight:750;letter-spacing:-.02em;color:var(--navy)}
.vrow .m{font-size:17px;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.forms{margin-top:30px;display:flex;flex-direction:column}
.frow{display:grid;grid-template-columns:340px 56px 1fr;align-items:center;padding:22px 0;border-bottom:1px solid var(--line-2)}
.frow .said{font-size:38px;font-weight:800;letter-spacing:-.03em;color:var(--coral-ink);line-height:1.05}
.frow .arrow{color:var(--ink-3)}
.frow .arrow svg{display:block}
.frow .full{font-size:27px;font-weight:700;letter-spacing:-.02em;line-height:1.15}
.frow .full .rk{font:500 13px/1 var(--mono);color:var(--ink-3);margin-left:10px;letter-spacing:0;vertical-align:3px}
.frow .ctx{display:block;font-size:17px;font-weight:500;color:var(--ink-2);letter-spacing:0;margin-top:5px}
`

const ARROW = '<svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8h27M21 1.5 28 8l-7 6.5"/></svg>'

function page(body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600&display=block" rel="stylesheet">
<style>${CSS}</style></head><body><div class="sheet">${body}</div></body></html>`
}

function foot(extra = '') {
  return `<div class="foot"><p class="src">${extra}${esc(SOURCE)}</p><span class="site">${SITE}</span></div>`
}

function cells(list, start) {
  return list.map((w, i) => {
    const g5 = (i % 20) % 5 === 4 && (i % 20) !== 19
    return `<div class="cell${w.pos === 'v.' ? ' v' : ''}${g5 ? ' g5' : ''}"><span class="r tab">${w.rank}</span><span class="w">${esc(display(w))}</span><span class="m">${esc(meaning(w))}</span></div>`
  }).join('')
}

const GLUE = 'de, que, no, y, a, el, la, en, se, me, un, por, para'

function top100() {
  const list = words.slice(0, 100)
  return page(`
<h1 style="--h1:50px">The 100 most common Spanish words</h1>
<p class="sub">Ranked by how often they appear in spoken Spanish. Read top to bottom, column by column. <span class="legend"><i>Verbs</i>&nbsp;in orange.</span></p>
<div class="grid5">${cells(list)}</div>
<div class="note"><div class="big tab">~50<small>%</small></div>
<p>Add the small glue words this list leaves out (<b>${GLUE}</b>) and the top 100 cover <b>roughly half</b> of the words in everyday spoken Spanish.</p></div>
${foot()}`)
}

function next100() {
  const list = words.slice(100, 200)
  return page(`
<h1 style="--h1:50px">Spanish words 101 to 200 <span class="soft">by frequency</span></h1>
<p class="sub">Already know the top 100? These are next, in order, column by column. <span class="legend"><i>Verbs</i>&nbsp;in orange.</span></p>
<div class="grid5">${cells(list)}</div>
<div class="note"><div class="big tab">~60<small>%</small></div>
<p>Know the first <b>250</b> words (plus the small glue words) and you cover about <b>60%</b> of everyday spoken Spanish. These 100 get you most of the way there.</p></div>
${foot()}`)
}

function verbs50() {
  const list = words.filter((w) => w.pos === 'v.').slice(0, 50)
  const rows = list.map((w, i) => {
    const g5 = (i % 25) % 5 === 4 && (i % 25) !== 24
    return `<div class="vrow${g5 ? ' g5' : ''}"><span class="r tab">${i + 1}</span><span class="w">${esc(w.word)}</span><span class="m">${esc(meaning(w))}</span></div>`
  }).join('')
  return page(`
<h1>The 50 most common Spanish verbs</h1>
<p class="sub">Ranked by how often they appear in spoken Spanish, from film and TV dialogue. Infinitive first, then the main meaning.</p>
<div class="grid2">${rows}</div>
${foot()}`)
}

const FORMS = [
  { said: 'pa’', full: 'para', ctx: 'pa’ que, pa’ ti, pa’lante. Casual speech almost everywhere.' },
  { said: '’tá / ’toy', full: 'está / estoy', lemmas: ['estar'], ctx: '¿Dónde ’tá? Common in casual Caribbean and Latin American speech.' },
  { said: 'terminao', full: 'terminado', lemmas: ['terminar'], ctx: 'The d in -ado drops: cansao, he llegao. Very common in Spain and the Caribbean.' },
  { said: 'pos / pus', full: 'pues', lemmas: ['pues'], ctx: 'Pos sí. Typical of Mexico.' },
  { said: 'na’ / to’', full: 'nada / todo', lemmas: ['nada', 'todo'], ctx: 'No pasa na’. Caribbean and southern Spain.' },
  { said: 'lo’ amigo’', full: 'los amigos', lemmas: ['amigo'], ctx: 'Final s softens to an h or vanishes. Caribbean, Andalusia, much of coastal Latin America.' },
  { said: 'mijo / mija', full: 'mi hijo / mi hija', lemmas: ['hijo'], ctx: 'Two words fused into one. Across Latin America.' },
  { said: '¿quiubo?', full: '¿qué hubo?', lemmas: ['haber'], ctx: 'A greeting, from haber. Mexico, Colombia, Chile.' },
]

function spoken() {
  const rows = FORMS.map((f) => {
    const rk = (f.lemmas || []).map((l) => [l, rankOf(l)]).filter(([, r]) => r).map(([l, r]) => `${l} #${r}`).join(', ')
    return `<div class="frow"><span class="said">${esc(f.said)}</span><span class="arrow">${ARROW}</span><span class="full">${esc(f.full)}${rk ? `<span class="rk tab">${esc(rk)}</span>` : ''}<span class="ctx">${esc(f.ctx)}</span></span></div>`
  }).join('')
  return page(`
<h1>You can read it<br><span class="soft">but you can’t hear it</span></h1>
<p class="sub">Part of the answer: in fast, casual speech, the most common words get clipped and fused. Same words, different sound. Orange is what you hear, dark blue is what you read.</p>
<div class="forms">${rows}</div>
<div class="note plain"><p>The small numbers are ranks in our 1,500-word frequency list. Almost every clipped form is a word you meet in your first few hundred, so the gap is your ear, not your vocabulary. The fix is hours of real listening.</p></div>
<div class="foot"><p class="src">Regional notes are general tendencies, not rules. Plenty of speakers in every region pronounce the full forms.</p><span class="site">${SITE}</span></div>`)
}

const SHEETS = [
  ['top-100-spanish-words', top100],
  ['spanish-words-101-200', next100],
  ['top-50-spanish-verbs', verbs50],
  ['read-vs-listen-spoken-forms', spoken],
]

mkdirSync(OUT, { recursive: true })
const only = process.argv[2]
const browser = await puppeteer.launch()
try {
  const pg = await browser.newPage()
  await pg.setViewport({ width: W, height: H, deviceScaleFactor: SCALE })
  for (const [name, fn] of SHEETS) {
    if (only && only !== name) continue
    const html = fn()
    await pg.setContent(html, { waitUntil: 'load', timeout: 90000 })
    await pg.evaluate(() => document.fonts.ready)
    const fontsOk = await pg.evaluate(() => document.fonts.check("800 20px 'Plus Jakarta Sans'") && document.fonts.check("500 12px 'JetBrains Mono'"))
    if (!fontsOk) throw new Error(`${name}: web fonts did not load`)
    const overflow = await pg.evaluate(() => {
      const s = document.querySelector('.sheet')
      const clipped = [...document.querySelectorAll('.w,.m')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent)
      return { tooTall: s.scrollHeight > s.clientHeight, over: s.scrollHeight - s.clientHeight, clipped }
    })
    if (overflow.tooTall) console.warn(`! ${name}: content ${overflow.over}px taller than ${H}px`)
    if (overflow.clipped.length) console.warn(`! ${name}: truncated text: ${overflow.clipped.join(' | ')}`)
    await pg.screenshot({ path: join(OUT, `${name}.png`) })
    console.log(`✓ ${name}.png (${W * SCALE}×${H * SCALE})`)
  }
} finally {
  await browser.close()
}
