// Renders a graded-reader pack (all story JSONs in a folder) into one A4 book PDF, or one story with --single.
// Usage: node scripts/readers/pack.mjs readers/level1 [--out readers/out/level1.pdf] [--single level1-story01] [--html-only]
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'
import { popupSvg } from './cover-art.mjs'

const arg = (k, d) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d)
const dir = process.argv[2]
const single = arg('single')
let stories = fs.readdirSync(dir).filter((f) => /^level\d+-story\d+\.json$/.test(f)).sort()
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
if (single) stories = stories.filter((s) => s.id === single)
if (!stories.length) throw new Error('no stories found')
const out = arg('out', path.join(dir, single ? `${single}.pdf` : 'pack.pdf'))

const esc = (x = '') => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (n) => n.toLocaleString('en')
const pad = (n) => String(n).padStart(2, '0')
const mins = (w) => Math.max(5, Math.round(w / 120))
const L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ'
const { level, rankLimit } = stories[0]
const narrator = (s) => s.audio?.find((a) => a.kind === 'javier') || s.audio?.[0]

function grid(heat, cls = '') {
  return `<div class="map ${cls}" style="grid-template-columns:repeat(${rankLimit > 500 ? 40 : 25},1fr)">${Array.from({ length: rankLimit }, (_, i) => {
    const h = heat.get(i + 1) || 0
    return `<i${h ? ` class="h${Math.min(h, 4)}"` : ''}></i>`
  }).join('')}</div>`
}

function storyParts(s, n) {
  const gloss = []
  const order = new Map()
  const noted = new Set()
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
        const k = order.get(g.lemma)
        if (!noted.has(k)) { noted.add(k); notes.push({ k, g }) }
        return `<span class="g">${w}<sup>${k}</sup></span>`
      })
    }
    const aside = notes.map(({ k, g }) => `<div><b>${k}</b> <i>${esc(g.word)}</i> ${esc(g.en)}</div>`).join('')
    return `<div class="para${p.trim().startsWith('—') ? ' dlg' : ''}"><p>${html}</p><div class="notes">${aside}</div></div>`
  }).join('\n')

  const heat = new Map(s.measured.lemmasUsed.map((l) => [l.rank, 3]))
  const a = narrator(s)
  const opener = `<header class="opener">
    <div class="op-meta">
      <span class="kick">Historia ${pad(n)}</span>
      ${a ? `<span class="mono">TRACK ${pad(n)} · ${esc(a.voice.name.toUpperCase())}, ${esc((a.accent || '').toUpperCase())}</span>` : ''}
    </div>
    <div class="op-grid">
      <div>
        <h1 class="op-title">${esc(s.title)}</h1>
        <p class="op-en">${esc(s.title_en)}</p>
        <p class="op-sum">${esc(s.summary_en)}</p>
        <dl class="op-stats tab">
          <div><dt>${fmt(s.wordCount)}</dt><dd>words · ${mins(s.wordCount)} min</dd></div>
          <div><dt>${s.measured.uniqueListWords}</dt><dd>list words used</dd></div>
          <div><dt>${gloss.length}</dt><dd>${gloss.length === 1 ? 'new word, explained' : 'new words, explained'}</dd></div>
        </dl>
        <p class="op-names"><b>Names:</b> ${s.names.map(esc).join(', ')}</p>
      </div>
      <figure>${grid(heat, 'op-map')}<figcaption>The ${s.measured.uniqueListWords} words from the top ${fmt(rankLimit)} that this story uses.</figcaption></figure>
    </div>
  </header>`

  const questions = `<section class="qpage">
    <h2>Preguntas <span>· ${esc(s.title)}</span></h2>
    <p class="lead">Answer in Spanish. Short answers are fine. The answer key is at the back of the book.</p>
    <ol class="qs">${s.questions.map((q) => `<li><div class="q">${esc(q.q)}</div><div class="lines"></div></li>`).join('')}</ol>
    ${gloss.length ? `<h3 class="h3 gl-h">New words in this story</h3>
    <div class="gloss">${gloss.map((g, i) => `<div><span class="n">${i + 1}</span><span class="w">${esc(g.word)}</span><span class="l">${esc(g.lemma)}</span><span>${esc(g.en)}</span></div>`).join('')}</div>` : ''}
  </section>`

  const key = `<div class="key-block"><h3>${pad(n)} · ${esc(s.title)}</h3>
    <ol class="keys">${s.questions.map((q) => `<li><div class="es">${esc(q.q)}<span>${esc(q.a)}</span></div><div class="en">${esc(q.q_en)}<span>${esc(q.a_en)}</span></div></li>`).join('')}</ol></div>`

  return { body: `<section class="story">${opener}${paras}<div class="fin">FIN</div></section>${questions}`, key, gloss }
}

const heat = new Map()
for (const s of stories) for (const l of s.measured.lemmasUsed) heat.set(l.rank, (heat.get(l.rank) || 0) + 1)
const totalWords = stories.reduce((t, s) => t + s.wordCount, 0)
const usedAny = heat.size
const parts = stories.map((s, i) => storyParts(s, single ? Number(s.id.slice(-2)) : i + 1))
const minCov = Math.floor(Math.min(...stories.map((s) => s.measured.coverage)))
const levelName = `Level ${level} · Top ${fmt(rankLimit)} words`
const PAGE = { 1: 'spanish-short-stories-for-beginners', 2: 'spanish-short-stories-intermediate' }[level]

const audioMin = Math.round(stories.reduce((t, s) => t + (narrator(s)?.seconds || 0), 0) / 60)
const headphones = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>'
const sticker = `<div class="cv-sticker">${headphones}<b>Book +<br>audio</b><span>${single ? 'MP3 included' : `${stories.filter(narrator).length} MP3s · ${audioMin} min`}</span></div>`
const cover = single
  ? (() => {
    const s = stories[0]
    return `<section class="cover l${level}">
      <div class="cv-top"><span>Most Common Spanish</span><span>${esc(levelName)}</span></div>
      <div class="cv-stage">${popupSvg({ only: Number(s.id.slice(-2)), level })}${sticker}</div>
      <div class="cv-body">
        <div class="cv-kick">A graded short story</div>
        <h1 class="cv-title">${esc(s.title)}</h1>
        <p class="cv-sub">${esc(s.title_en)}. A short story in simple Spanish, read aloud by a native speaker.</p>
      </div>
      <div class="cv-foot">
        <div><b class="tab">${s.measured.coverage}%</b><span>of words from the list</span></div>
        <div><b class="tab">${fmt(s.wordCount)}</b><span>words · about ${mins(s.wordCount)} min</span></div>
        <div><b class="tab">Story ${Number(s.id.slice(-2))}</b><span>of 10 in the Level ${level} pack</span></div>
      </div>
    </section>`
  })()
  : `<section class="cover l${level}">
      <div class="cv-top"><span>Most Common Spanish</span><span>${esc(levelName)}</span></div>
      <div class="cv-stage">${popupSvg({ level })}${sticker}</div>
      <div class="cv-body">
        <div class="cv-kick">${stories.length} short stories · Level ${level}</div>
        <h1 class="cv-title">Diez historias</h1>
        <p class="cv-sub">Short stories for adults, written only with the ${fmt(rankLimit)} most common Spanish words. Read them, then hear them.</p>
      </div>
      <div class="cv-foot">
        <div><b class="tab">${stories.length}</b><span>stories, ${fmt(totalWords)} words</span></div>
        <div><b class="tab">${audioMin} min</b><span>of audio, read by a native speaker</span></div>
        <div><b class="tab">${minCov}%+</b><span>top-${fmt(rankLimit)} words</span></div>
      </div>
    </section>`

const intro = single ? ''
  : `<section class="intro">
    <h2>How to use this book</h2>
    <p class="lead">Every story is written with the ${fmt(rankLimit)} most common Spanish words. A script checked each word: at least ${minCov}% come from the list, and the few that don't are explained in the margin. The stories use ${usedAny} of the ${fmt(rankLimit)} words, many of them again and again, which is how they stick.</p>
    <ol class="steps">
      <li><b>Read it once without stopping.</b> Follow the story, not every word. Margin notes cover anything outside the list.</li>
      <li><b>Read it again with the audio.</b> Follow the text while you listen to the MP3 with the same number.</li>
      <li><b>Answer the five questions.</b> In Spanish, short answers. The answer key is at the back.</li>
      <li><b>Listen without the text.</b> A day or two later, play the track on a walk. You will understand more than you expect.</li>
    </ol>
    <h2 class="toc-h">Contents</h2>
    <ol class="toc">${stories.map((s, i) => `<li><span class="n">${pad(i + 1)}</span><span class="t"><b>${esc(s.title)}</b><i>${esc(s.title_en)}</i></span><span class="m tab">${fmt(s.wordCount)} words · ${mins(s.wordCount)} min</span></li>`).join('')}</ol>
  </section>`

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(single ? stories[0].title : 'Diez historias')}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&family=Literata:opsz,wght@7..72,400;7..72,500&display=swap" rel="stylesheet">
<style>${fs.readFileSync(new URL('./pack.css', import.meta.url), 'utf8')}</style></head><body>
${cover}
${intro}
${parts.map((p) => p.body).join('\n')}
<section class="keys-sec"><h2>Answer key</h2>${parts.map((p) => p.key).join('')}
${single ? `<p class="more">This is story ${Number(stories[0].id.slice(-2))} of <b>Diez historias</b>, ten stories at Level ${level} with an MP3 for each one: mostcommonspanish.com/${PAGE}</p>` : ''}
<div class="colophon">${single ? esc(stories[0].title) : 'Diez historias'} · ${esc(levelName)} · Most Common Spanish · mostcommonspanish.com</div></section>
</body></html>`

fs.mkdirSync(path.dirname(out), { recursive: true })
const htmlFile = out.replace(/\.pdf$/, '.html')
fs.writeFileSync(htmlFile, html)
if (process.argv.includes('--html-only')) { console.log(`HTML → ${htmlFile}`); process.exit(0) }
const browser = await puppeteer.launch()
const pg = await browser.newPage()
await pg.goto('file://' + path.resolve(htmlFile), { waitUntil: 'networkidle0' })
await pg.evaluateHandle('document.fonts.ready')
await pg.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true })
await browser.close()
fs.unlinkSync(htmlFile)
console.log(`PDF → ${out}`)
