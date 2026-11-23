import Link from 'next/link'
import WordListPage from '@/components/WordListPage'
import { words } from '@/data/words'
import { BASE, DATE_MODIFIED, itemListSchema, pageMetadata, wordByText } from '../_components/wordSets'
import SourceNote from '../_components/SourceNote'

const SLUG = 'spanish-connectors'

export const metadata = pageMetadata({
  slug: SLUG,
  title: 'Spanish Connectors: Linking Words by Frequency, with Audio',
  description: 'Spanish connectors ranked by how often they are used: pero, porque, cuando, aunque, entonces and more, plus sin embargo, por eso and other key linking phrases.',
})

const FUNCTION = {
  si: 'condition', pero: 'contrast', cuando: 'time', o: 'alternative', porque: 'cause', ni: 'addition',
  mientras: 'time', aunque: 'contrast', sino: 'contrast', como: 'comparison', según: 'source',
  entonces: 'result', también: 'addition', además: 'addition', incluso: 'addition', tampoco: 'addition',
  luego: 'sequence', después: 'sequence', antes: 'sequence', finalmente: 'sequence', pues: 'cause',
  hasta: 'time', apenas: 'time', aun: 'contrast',
}

const ranked = words.filter((w) => FUNCTION[w.word])

const PHRASES = [
  { es: 'y', fn: 'addition', en: 'and', ex: 'Compré pan y leche.', exEn: 'I bought bread and milk.', parts: [] },
  { es: 'que', fn: 'linking', en: 'that; than', ex: 'Creo que tienes razón.', exEn: 'I think that you’re right.', parts: [] },
  { es: 'sin embargo', fn: 'contrast', en: 'however', ex: 'Estudió mucho. Sin embargo, suspendió el examen.', exEn: 'He studied a lot. However, he failed the exam.', parts: ['sin'] },
  { es: 'por eso', fn: 'result', en: 'that’s why', ex: 'Llovía, por eso no salimos.', exEn: 'It was raining, that’s why we didn’t go out.', parts: ['eso'] },
  { es: 'así que', fn: 'result', en: 'so', ex: 'Estoy cansado, así que me voy a casa.', exEn: 'I’m tired, so I’m going home.', parts: ['así'] },
  { es: 'o sea', fn: 'clarifying', en: 'I mean; in other words', ex: 'No tengo dinero, o sea, no puedo ir.', exEn: 'I have no money, I mean, I can’t go.', parts: ['o', 'ser'] },
  { es: 'ya que', fn: 'cause', en: 'since; because', ex: 'Ya que estás aquí, ayúdame.', exEn: 'Since you’re here, help me.', parts: ['ya'] },
  { es: 'aun así', fn: 'contrast', en: 'even so', ex: 'Estaba enfermo y aun así vino.', exEn: 'He was sick and came even so.', parts: ['aun', 'así'] },
  { es: 'por lo tanto', fn: 'result', en: 'therefore', ex: 'No hay pruebas; por lo tanto, es inocente.', exEn: 'There’s no evidence; therefore, he’s innocent.', parts: ['lo', 'tanto'] },
  { es: 'es decir', fn: 'clarifying', en: 'that is', ex: 'Llega pasado mañana, es decir, el jueves.', exEn: 'She arrives the day after tomorrow, that is, on Thursday.', parts: ['ser', 'decir'] },
  { es: 'mientras que', fn: 'contrast', en: 'whereas', ex: 'Él trabaja de día, mientras que ella trabaja de noche.', exEn: 'He works by day, whereas she works at night.', parts: ['mientras'] },
  { es: 'además de', fn: 'addition', en: 'besides; as well as', ex: 'Además de inglés, habla francés.', exEn: 'Besides English, she speaks French.', parts: ['además'] },
  { es: 'a pesar de', fn: 'contrast', en: 'despite', ex: 'Salimos a pesar de la lluvia.', exEn: 'We went out despite the rain.', parts: [] },
  { es: 'en cambio', fn: 'contrast', en: 'on the other hand', ex: 'Yo prefiero el té; mi hermana, en cambio, toma café.', exEn: 'I prefer tea; my sister, on the other hand, drinks coffee.', parts: ['cambio'] },
  { es: 'por un lado, por otro lado', fn: 'contrast', en: 'on one hand, on the other', ex: 'Por un lado es barato; por otro lado, es lento.', exEn: 'On one hand it’s cheap; on the other, it’s slow.', parts: ['lado', 'otro'] },
  { es: 'para que', fn: 'purpose', en: 'so that', ex: 'Te lo explico para que lo entiendas.', exEn: 'I’m explaining it so that you understand.', parts: [] },
  { es: 'por ejemplo', fn: 'example', en: 'for example', ex: 'Me gusta la fruta tropical, por ejemplo, el mango.', exEn: 'I like tropical fruit, for example, mango.', parts: ['ejemplo'] },
  { es: 'de todos modos', fn: 'contrast', en: 'anyway', ex: 'No me invitaron, pero de todos modos no quería ir.', exEn: 'They didn’t invite me, but I didn’t want to go anyway.', parts: ['todo', 'modo'] },
  { es: 'en primer lugar', fn: 'sequence', en: 'first of all', ex: 'En primer lugar, quiero darte las gracias.', exEn: 'First of all, I want to thank you.', parts: ['primero', 'lugar'] },
  { es: 'al final', fn: 'sequence', en: 'in the end', ex: 'Al final, todo salió bien.', exEn: 'In the end, everything turned out fine.', parts: ['final'] },
  { es: 'en resumen', fn: 'summary', en: 'in short', ex: 'En resumen, fue un buen año.', exEn: 'In short, it was a good year.', parts: [] },
  { es: 'no obstante', fn: 'contrast', en: 'nevertheless', ex: 'El plan es caro. No obstante, vale la pena.', exEn: 'The plan is expensive. Nevertheless, it’s worth it.', parts: [] },
].map((p) => ({ ...p, found: p.parts.map(wordByText).filter(Boolean) }))

const SIBLINGS = [
  { href: '/words/most-common-spanish-adverbs', label: 'Adverbs' },
  { href: '/words/most-common-spanish-verbs', label: 'Verbs' },
  { href: '/words/most-common-spanish-nouns', label: 'Nouns' },
  { href: '/words/most-common-spanish-adjectives', label: 'Adjectives' },
  { href: '/words/top-1000-spanish-words', label: 'Top 1000' },
  { href: '/words/spanish-frequency-list', label: 'How this list is built' },
]

const FAQS = [
  { q: 'What are connectors in Spanish?', a: 'Connectors (conectores, also called linking or transition words) join ideas inside a sentence or between sentences. They show how the ideas relate: contrast (pero, sin embargo), cause (porque, ya que), result (entonces, por eso), time (cuando, mientras) or addition (también, además).' },
  { q: 'What are the most common Spanish connectors?', a: 'In spoken Spanish the most frequent are y, que, si, pero, cuando, o and porque. Among the words ranked in our top 1,500, si (#14), pero (#18), cuando (#46), o (#53) and porque (#68) are the highest.' },
  { q: 'What is the difference between pero and sino?', a: 'Both translate as "but". Pero adds a contrast: Es caro, pero es bueno (It’s expensive, but it’s good). Sino replaces something you just denied: No es caro, sino barato (It’s not expensive but cheap). Sino always follows a negative.' },
  { q: 'Is sin embargo formal?', a: 'A little. Sin embargo means "however" and is common in writing, news and careful speech. In casual conversation people mostly say pero instead. Por lo tanto and no obstante are more formal still.' },
  { q: 'What does o sea mean?', a: 'O sea means "I mean" or "in other words". It introduces a rephrasing or a conclusion and is extremely common in casual spoken Spanish, often as a filler. Es decir does the same job in more formal speech and writing.' },
  { q: 'How many connectors do I need to learn?', a: 'Around 20 to 30 cover nearly everything you will hear in conversation. Learn the single-word ones in the ranked list first, because they are far more frequent, then add phrases like por eso, así que and sin embargo.' },
]

const FN_GROUPS = [
  { h: 'Contrast', fn: ['contrast'] },
  { h: 'Cause and result', fn: ['cause', 'result'] },
  { h: 'Time and sequence', fn: ['time', 'sequence'] },
  { h: 'Adding and clarifying', fn: ['addition', 'clarifying', 'example'] },
]

export default function Page() {
  const all = [...ranked.map((w) => ({ key: w.word, label: w.word, rank: w.rank, fn: FUNCTION[w.word] })), ...PHRASES.map((p) => ({ key: p.es, label: p.es, fn: p.fn }))]
  const phraseSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Common Spanish connector phrases',
    url: `${BASE}/words/${SLUG}#phrases`,
    hasDefinedTerm: PHRASES.map((p) => ({ '@type': 'DefinedTerm', name: p.es, description: p.en })),
  }

  return (
    <WordListPage
      title="Spanish connectors ranked by how often you hear them"
      level={1500}
      slug={SLUG}
      coverage={String(ranked.length + PHRASES.length)}
      coverageLabel={`connectors: ${ranked.length} ranked in our top 1,500 and ${PHRASES.length} key phrases`}
      breadcrumbName="Spanish connectors"
      schemaName="Spanish Connectors by Frequency"
      schemaDescription="Spanish connectors and linking words ranked by real-world frequency, with their function, English meaning, example sentences and native audio, plus common multi-word connector phrases."
      dateModified={DATE_MODIFIED}
      factsNote={<SourceNote>The ranked connectors are part of the top 1,500 words, which cover ~80% of everyday spoken Spanish.</SourceNote>}
      intro={
        <>
          Spanish connectors are the words that link ideas: pero, porque, cuando, aunque, entonces. The most
          common ones are in the top 100 words of the language, so they unlock more understanding per word than
          almost anything else. Below are the {ranked.length} connectors in our top 1,500, <strong>ranked by frequency</strong> with
          native audio, then {PHRASES.length} essential phrases like <em>sin embargo</em> and <em>por eso</em>.
        </>
      }
      words={ranked}
      siblings={SIBLINGS}
      faqs={FAQS}
      showAudio
      anki
      typeHeader="Function"
      typeOf={(w) => FUNCTION[w.word]}
      listNote={`${ranked.length} single-word connectors from the top 1,500. Rank = position in the full list.`}
      extraSchema={[itemListSchema({ name: 'Spanish Connectors by Frequency', slug: SLUG, list: ranked }), phraseSchema]}
    >
      <section className="sec-sm" id="phrases">
        <div className="sec-head">
          <h2>Connector phrases you also need</h2>
          <p className="lead">
            These phrases are not ranked: our frequency list counts single words, and it doesn’t rank y and que on
            their own. Where a phrase is built from words in the top 1,500, their ranks are shown.
          </p>
        </div>
        <div className="card list-card wl">
          <table className="phr">
            <thead>
              <tr><th>Connector</th><th>Function</th><th>Meaning</th><th>Example</th><th>Parts in top 1,500</th></tr>
            </thead>
            <tbody>
              {PHRASES.map((p) => (
                <tr key={p.es}>
                  <td className="w">{p.es}<span className="w-sub">{p.en}</span></td>
                  <td className="pos">{p.fn}</td>
                  <td className="mn">{p.en}</td>
                  <td className="ex"><span className="es">{p.ex}</span><small>{p.exEn}</small></td>
                  <td className="parts">
                    {p.found.length ? p.found.map((w, i) => <span key={w.rank}>{i > 0 && ', '}<b>{w.word.replace(/^(un|una) /, '')}</b> #{w.rank}</span>) : 'not ranked'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sec-sm">
        <div className="sec-head">
          <h2>Connectors by what they do</h2>
        </div>
        <div className="notes">
          {FN_GROUPS.map((g) => (
            <div key={g.h} className="card note">
              <h3>{g.h}</h3>
              <div className="terms">
                {all.filter((c) => g.fn.includes(c.fn)).map((c) => <span key={c.key}>{c.label}{c.rank && <i>#{c.rank}</i>}</span>)}
              </div>
            </div>
          ))}
        </div>
        <p className="src">
          Many connectors are adverbs. See the full <Link href="/words/most-common-spanish-adverbs" className="tlink">most common Spanish adverbs</Link> list.
        </p>
      </section>
    </WordListPage>
  )
}
