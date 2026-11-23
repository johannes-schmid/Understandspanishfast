// Renders a graded-reader story JSON to an A4 PDF.
// Usage: node scripts/readers/render.mjs samples/readers/level1-story01.json [--html-only]
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const file = process.argv[2]
const s = JSON.parse(fs.readFileSync(file, 'utf8'))
const m = s.measured
const esc = (x = '') => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (n) => n.toLocaleString('en')
const L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ'

// Glossed words: numbered by first appearance, marked inline, explained beside their paragraph.
const gloss = []
const order = new Map()
const glossRe = s.glossary.length
  ? new RegExp(`(?<![${L}])(${s.glossary.map((g) => g.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|')})(?![${L}])`, 'gi')
  : null
const paras = s.paragraphs.map((p) => {
  const notes = []
  let html = esc(p)
  if (glossRe) {
    html = html.replace(glossRe, (w) => {
      const g = s.glossary.find((x) => x.word.toLowerCase() === w.toLowerCase())
      if (!order.has(g.lemma)) { order.set(g.lemma, order.size + 1); gloss.push(g) }
      const n = order.get(g.lemma)
      if (!notes.some((x) => x.n === n)) notes.push({ n, g })
      return `<span class="g">${w}<sup>${n}</sup></span>`
    })
  }
  const aside = notes.map(({ n, g }) => `<div><b>${n}</b> <i>${esc(g.word)}</i> ${esc(g.en)}</div>`).join('')
  return `<div class="para${p.trim().startsWith('—') ? ' dlg' : ''}"><p>${html}</p><div class="notes">${aside}</div></div>`
}).join('\n')

const usedRanks = new Set(m.lemmasUsed.map((l) => l.rank))
const map = Array.from({ length: s.rankLimit }, (_, i) => `<i${usedRanks.has(i + 1) ? ' class="on"' : ''}></i>`).join('')
const pctList = (100 * m.listTokens / m.words).toFixed(1)
const levelName = `Level ${s.level} · Top ${fmt(s.rankLimit)} words`

const audio = s.audio?.length
  ? `<p class="audio"><b>Listen too.</b> This story comes with ${s.audio.length} narrations: ${s.audio.map((a) => `${a.voice.name[0].toUpperCase() + a.voice.name.slice(1)} (${a.accent})`).join(', ')}, read slightly slower than normal speech.</p>`
  : ''

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(s.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>${fs.readFileSync(new URL('./reader.css', import.meta.url), 'utf8')}</style></head><body>

<section class="cover">
  <div class="cv-top"><span class="mono">MOST COMMON SPANISH</span><span class="mono">GRADED READER</span></div>
  <div class="cv-map">
    <div class="map">${map}</div>
    <p>Each square is one of the ${fmt(s.rankLimit)} most common Spanish words. The coral ones are the ${m.uniqueListWords} this story uses.</p>
  </div>
  <div>
    <div class="cv-level">${esc(levelName)}</div>
    <h1 class="cv-title">${esc(s.title)}</h1>
    <div class="cv-en">${esc(s.title_en)}</div>
    <p class="cv-sum">${esc(s.summary_en)}</p>
  </div>
  <div class="cv-foot">
    <div><b class="tab">${m.coverage}%</b><span class="mono">OF WORDS FROM THE LIST</span></div>
    <div><b class="tab">${fmt(s.wordCount)}</b><span class="mono">WORDS · ABOUT ${Math.max(5, Math.round(s.wordCount / 120))} MIN</span></div>
    <div><b class="tab">${gloss.length}</b><span class="mono">${gloss.length ? 'NEW WORDS, ALL EXPLAINED' : 'WORDS OUTSIDE THE LIST'}</span></div>
  </div>
</section>

<section class="sec">
  <h2>Before you read</h2>
  <p class="lead">Every word in this story comes from the ${fmt(s.rankLimit)} most common Spanish words, apart from ${gloss.length ? `names and ${gloss.length} word${gloss.length > 1 ? 's' : ''} explained in the margin` : 'the names of the characters'}. If you know the list, you can read all of it.</p>
  <div class="howto">
    <ol>
      <li><b>Read it once without stopping.</b> Follow the story, not every word.</li>
      ${gloss.length ? '<li><b>Check the margin.</b> Words marked with a dotted line and a number are explained beside the paragraph.</li>' : '<li><b>Guess before you look up.</b> Every word is on the list, so the meaning is already in your head somewhere.</li>'}
      <li><b>Read it again, out loud.</b> Then answer the five questions at the end.</li>
    </ol>
    <div class="cast">
      <h3>Names in this story</h3>
      <p>${s.names.map(esc).join(', ')}</p>
      ${audio}
    </div>
  </div>
  <div class="story-head">
    <h1>${esc(s.title)}</h1>
    <p>${esc(s.title_en)}</p>
  </div>
  ${paras}
  <div class="fin">FIN</div>
</section>

${gloss.length ? `<section class="sec">
  <h2>Glossary</h2>
  <p class="lead">The only words in the story that are not in the top ${fmt(s.rankLimit)}, in the order they appear.</p>
  <div class="gloss">
    <div><span class="mono">#</span><span class="mono">IN THE STORY</span><span class="mono">DICTIONARY FORM</span><span class="mono">MEANING</span></div>
    ${gloss.map((g, i) => `<div><span class="n">${i + 1}</span><span class="w">${esc(g.word)}</span><span class="l">${esc(g.lemma)}</span><span>${esc(g.en)}</span></div>`).join('')}
  </div>
</section>` : ''}

<section class="${gloss.length ? '' : 'sec'}" style="${gloss.length ? 'margin-top:14mm' : ''}">
  <h2>Questions</h2>
  <p class="lead">Answer in Spanish. Short answers are fine.</p>
  <ol class="qs">${s.questions.map((q) => `<li><div class="q">${esc(q.q)}</div><div class="lines"></div></li>`).join('')}</ol>
</section>

<section class="sec">
  <h2>Answer key</h2>
  <ol class="keys">${s.questions.map((q) => `<li><div class="es">${esc(q.q)}<span>${esc(q.a)}</span></div><div class="en">${esc(q.q_en)}<span>${esc(q.a_en)}</span></div></li>`).join('')}</ol>

  <h2 style="margin-top:14mm">Words this story uses</h2>
  <div class="cov-top">
    <div>
      <div class="big tab">${m.coverage}<small>%</small></div>
      <dl class="tab">
        <dt>${fmt(m.words)}</dt><dd>words counted (names left out)</dd>
        <dt>${fmt(m.listTokens)}</dt><dd>top-${fmt(s.rankLimit)} words, ${pctList}%</dd>
        <dt>${fmt(m.grammarTokens)}</dt><dd>grammar words</dd>
        <dt>${fmt(m.words - m.listTokens - m.grammarTokens)}</dt><dd>glossed words</dd>
      </dl>
    </div>
    <div class="map">${map}</div>
  </div>
  <p class="note"><b>How this was measured.</b> A script reads every word, works out its dictionary form (so <i>pudo</i> counts as <i>poder</i> and <i>casas</i> as <i>casa</i>) and checks it against the Most Common Spanish frequency list. Short grammar words that the list leaves out (articles like <i>el</i> and <i>una</i>, <i>de</i>, <i>que</i>, <i>en</i>, <i>y</i>, <i>no</i>, <i>se</i>, <i>por</i>, <i>para</i>, <i>mi</i>, <i>su</i> and similar) count as known. The story uses ${m.uniqueListWords} different list words; the rarest is #${m.highestRankUsed}.</p>
  <div class="used">${m.lemmasUsed.map((l) => `<span><em>${l.rank}</em>${esc(l.lemma)}</span>`).join('')}</div>
  <div class="colophon">${esc(s.title)} · ${esc(levelName)} · Most Common Spanish · mostcommonspanish.com</div>
</section>
</body></html>`

const base = path.join(path.dirname(file), path.basename(file, '.json'))
fs.writeFileSync(`${base}.html`, html)
if (process.argv.includes('--html-only')) process.exit(0)
const browser = await puppeteer.launch()
const pg = await browser.newPage()
await pg.goto('file://' + path.resolve(`${base}.html`), { waitUntil: 'networkidle0' })
await pg.evaluateHandle('document.fonts.ready')
await pg.pdf({ path: `${base}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true })
await browser.close()
fs.unlinkSync(`${base}.html`)
console.log(`PDF → ${base}.pdf`)
