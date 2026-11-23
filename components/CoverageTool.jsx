'use client'

import { useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import { analyze, buildIndex, LEVELS } from '@/components/CoverageEngine'
import { CoverageMeter, FunctionWordNote, LEVEL_LABEL, pct } from '@/components/CoverageShared'

const SAMPLES = {
  conversation: `- Oye, ¿tienes un momento? Quería hablar contigo de lo que pasó ayer.
- Claro, dime. ¿Qué pasa?
- Mira, no sé si te diste cuenta, pero mi hermana estaba muy triste en la cena. Creo que tiene problemas en el trabajo y no quiere decir nada a nadie.
- Ya lo vi. Le pregunté si estaba bien y me dijo que sí, pero no parecía verdad.
- Por eso te llamo. ¿Puedes ir a verla mañana? A ti te cuenta más cosas que a mí.
- Vale, paso por su casa después de comer. Le llevo un café y hablamos tranquilas.
- Gracias. De verdad, no sé qué haría sin ti.`,
  news: `El ayuntamiento aprobó ayer un plan para reducir el tráfico en el centro de la ciudad. A partir de marzo, los coches que no cumplan las nuevas normas ambientales no podrán circular por las calles principales entre las siete de la mañana y las ocho de la tarde. Según el alcalde, la medida permitirá mejorar la calidad del aire y ampliar las zonas peatonales. Los comerciantes, sin embargo, temen perder clientes y piden más aparcamientos en las afueras. La oposición criticó que la decisión se tomara sin un periodo de consulta pública y anunció que presentará un recurso.`,
}

const MAX_BYTES = 3 * 1024 * 1024
const MIN_WORDS = 30
const SUB_RE = /\d{1,2}:\d{2}(:\d{2})?[.,]\d{1,3}\s*-->/

export default function CoverageTool() {
  const [idx, setIdx] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [level, setLevel] = useState(1500)
  const fileRef = useRef(null)
  const deferred = useDeferredValue(text)

  const load = () => {
    setLoadError(false)
    fetch('/coverage/forms.json')
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then((d) => setIdx(buildIndex(d)))
      .catch(() => setLoadError(true))
  }
  useEffect(load, [])

  const result = useMemo(() => {
    if (!idx || !deferred.trim()) return null
    return analyze(deferred, idx, { subtitles: SUB_RE.test(deferred), topUncovered: 12 })
  }, [idx, deferred])

  const onFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setFileError(null)
    if (f.size > MAX_BYTES) { setFileError('That file is over 3 MB. Upload a single episode or chapter.'); return }
    if (!/\.(srt|vtt|txt)$/i.test(f.name)) { setFileError('Upload an .srt, .vtt or .txt file.'); return }
    const reader = new FileReader()
    reader.onload = () => { setText(String(reader.result || '')); setFileName(f.name) }
    reader.onerror = () => setFileError('Could not read that file. Try saving it as UTF-8 text.')
    reader.readAsText(f)
  }

  const pickSample = (key) => { setText(SAMPLES[key]); setFileName(null); setFileError(null) }
  const clear = () => { setText(''); setFileName(null); setFileError(null) }

  const tooShort = result && result.total < MIN_WORDS
  const stale = text !== deferred

  return (
    <section className="cv-tool card" aria-label="Spanish text coverage checker">
      <div className="cv-in">
        <div className="cv-in-head">
          <label htmlFor="cv-text" className="cv-label">Spanish text or subtitles</label>
          {fileName && <span className="cv-file tab">{fileName}</span>}
        </div>
        <textarea
          id="cv-text"
          className="cv-text"
          value={text}
          onChange={(e) => { setText(e.target.value); setFileName(null) }}
          placeholder="Pega aquí un diálogo, un artículo o los subtítulos de un episodio."
          spellCheck={false}
          lang="es"
        />
        <div className="cv-in-bar">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>Upload .srt or .vtt</button>
          <input ref={fileRef} type="file" accept=".srt,.vtt,.txt,text/plain" onChange={onFile} hidden />
          <span className="cv-try">Try</span>
          <button type="button" className="cv-pill" onClick={() => pickSample('conversation')}>A conversation</button>
          <button type="button" className="cv-pill" onClick={() => pickSample('news')}>A news story</button>
          {text && <button type="button" className="cv-pill cv-clear" onClick={clear}>Clear</button>}
        </div>
        {fileError && <p className="cv-err" role="alert">{fileError}</p>}
        <p className="cv-privacy">Runs in your browser. Your text is never uploaded.</p>
      </div>

      <div className={`cv-out${stale ? ' stale' : ''}`} aria-live="polite">
        {loadError ? (
          <div className="cv-empty">
            <h2>The word list did not load</h2>
            <p>Check your connection and try again.</p>
            <button type="button" className="btn btn-navy btn-sm" onClick={load}>Try again</button>
          </div>
        ) : !result ? (
          <div className="cv-empty">
            <h2>{idx ? 'Paste some Spanish to see your number' : 'Loading the word list'}</h2>
            <p>You get the share of words you would recognise after learning the top 100, 500, 1,000 and 1,500 words, and the words worth learning next.</p>
            <CoverageMeter values={{ 100: 0, 500: 0, 1000: 0, 1500: 0 }} label="No result yet" empty />
          </div>
        ) : (
          <Result result={result} level={level} setLevel={setLevel} tooShort={tooShort} />
        )}
      </div>
    </section>
  )
}

function Result({ result, level, setLevel, tooShort }) {
  const values = Object.fromEntries(LEVELS.map((L) => [L, result.coverage[L] * 100]))
  const missing = result.missing[level].slice(0, 10)
  return (
    <div className="cv-res">
      <div className="cv-big">
        <span className="cv-big-n tab">{pct(values[level])}</span>
        <p>of the {result.total.toLocaleString('en')} words in this text are in the top {LEVEL_LABEL[level]}</p>
      </div>
      {tooShort && <p className="cv-warn">Short texts swing a lot. Paste at least a few paragraphs for a stable number.</p>}

      <div className="seg cv-seg" role="group" aria-label="Words learned">
        {LEVELS.map((L) => (
          <button key={L} type="button" className={L === level ? 'on' : ''} aria-pressed={L === level} onClick={() => setLevel(L)}>{LEVEL_LABEL[L]}</button>
        ))}
      </div>
      <CoverageMeter values={values} highlight={level} />
      <FunctionWordNote listOnly={result.listOnly[level] * 100} level={level} />

      {missing.length > 0 && (
        <div className="cv-miss">
          <h3>Most frequent words you would still miss</h3>
          <ol>
            {missing.map((g) => (
              <li key={g.rank || g.word}>
                <span className="cv-miss-w">{g.word}</span>
                <span className="cv-miss-m">{g.rank ? `#${g.rank.toLocaleString('en')} ${g.meaning}` : 'outside the top 1,500'}</span>
                <span className="cv-miss-n tab">{g.n}×</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {result.excluded > 0 && <p className="cv-small">{result.excluded.toLocaleString('en')} names left out of the count.</p>}
    </div>
  )
}
