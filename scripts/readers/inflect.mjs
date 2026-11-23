// Self-contained Spanish inflection generator: lemma list -> Map(form -> best rank).
// Forward generation (rules + irregular tables). Over-generation is harmless for checking.

const ACC = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }
const UNACC = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
export const deaccent = (s) => s.replace(/[áéíóú]/g, (c) => UNACC[c])
const accentLastVowel = (s) => {
  const i = s.search(/[aeiou][^aeiou]*$/)
  return i < 0 ? s : s.slice(0, i) + ACC[s[i]] + s.slice(i + 1)
}

// Closed-class grammar words that the frequency list leaves out. Always allowed, reported separately.
export const GRAMMAR = new Set(`el la los las un una unos unas al del de a en y e u o que por para no sí se me mi mis tu tus su sus os
vosotros vosotras vuestro vuestra vuestros vuestras donde quien quienes cual cuales cuanto cuanta cuantos cuantas`.split(/\s+/))

const STEM = {
  ie: `pensar querer entender empezar sentar despertar perder cerrar comenzar preferir sentir mentir sugerir divertir convertir referir negar
recomendar defender atender encender calentar nevar gobernar tender extender advertir hervir invertir confesar fregar regar temblar tropezar
apretar quebrar sembrar manifestar consentir arrepentir herir requerir mantener tener venir`.split(/\s+/),
  ue: `poder volver recordar encontrar morir dormir mover contar costar acordar sonar volar probar mostrar soñar devolver resolver llover doler
almorzar colgar rogar demostrar aprobar soler morder envolver promover remover renovar comprobar acostar forzar torcer cocer avergonzar`.split(/\s+/),
  i: `pedir seguir servir repetir vestir despedir impedir medir elegir corregir conseguir perseguir competir gemir rendir`.split(/\s+/),
  u: ['jugar'],
}
const stemType = new Map()
for (const [t, list] of Object.entries(STEM)) for (const v of list) stemType.set(v, t)

const IRR = {
  ser: { pres: 'soy eres es somos sois son', pret: 'fui fuiste fue fuimos fuisteis fueron', impf: 'era eras era éramos erais eran', subj: 'sea seas sea seamos seáis sean', imp: 'sé', ger: 'siendo', part: 'sido' },
  estar: { pres: 'estoy estás está estamos estáis están', pretStem: 'estuv', subj: 'esté estés esté estemos estéis estén', imp: 'está' },
  ir: { pres: 'voy vas va vamos vais van', pret: 'fui fuiste fue fuimos fuisteis fueron', impf: 'iba ibas iba íbamos ibais iban', subj: 'vaya vayas vaya vayamos vayáis vayan', imp: 've id', ger: 'yendo', part: 'ido' },
  tener: { pres1: 'tengo', pretStem: 'tuv', fut: 'tendr', subjStem: 'teng', imp: 'ten' },
  haber: { pres: 'he has ha hemos habéis han hay', pretStem: 'hub', fut: 'habr', subjStem: 'hay' },
  hacer: { pres1: 'hago', pret: 'hice hiciste hizo hicimos hicisteis hicieron', fut: 'har', subjStem: 'hag', imp: 'haz', part: 'hecho' },
  poder: { pretStem: 'pud', fut: 'podr', ger: 'pudiendo' },
  decir: { pres: 'digo dices dice decimos decís dicen', pretStem: 'dij', fut: 'dir', subjStem: 'dig', imp: 'di', ger: 'diciendo', part: 'dicho' },
  querer: { pretStem: 'quis', fut: 'querr' },
  saber: { pres1: 'sé', pretStem: 'sup', fut: 'sabr', subjStem: 'sep' },
  ver: { pres: 'veo ves ve vemos veis ven', pret: 'vi viste vio vimos visteis vieron', impf: 'veía veías veía veíamos veíais veían', subjStem: 've', part: 'visto' },
  dar: { pres: 'doy das da damos dais dan', pret: 'di diste dio dimos disteis dieron', subj: 'dé des dé demos deis den' },
  venir: { pres1: 'vengo', pretStem: 'vin', fut: 'vendr', subjStem: 'veng', imp: 'ven', ger: 'viniendo' },
  poner: { pres1: 'pongo', pretStem: 'pus', fut: 'pondr', subjStem: 'pong', imp: 'pon', part: 'puesto' },
  salir: { pres1: 'salgo', fut: 'saldr', subjStem: 'salg', imp: 'sal' },
  valer: { pres1: 'valgo', fut: 'valdr', subjStem: 'valg' },
  oír: { pres: 'oigo oyes oye oímos oís oyen', pret: 'oí oíste oyó oímos oísteis oyeron', subjStem: 'oig', ger: 'oyendo', part: 'oído', imp: 'oye oíd' },
  traer: { pres1: 'traigo', pretStem: 'traj', subjStem: 'traig' },
  caer: { pres1: 'caigo', subjStem: 'caig' },
  andar: { pretStem: 'anduv' },
  caber: { pres1: 'quepo', pretStem: 'cup', fut: 'cabr', subjStem: 'quep' },
  conducir: { pretStem: 'conduj' }, producir: { pretStem: 'produj' }, traducir: { pretStem: 'traduj' }, reducir: { pretStem: 'reduj' }, introducir: { pretStem: 'introduj' },
  reír: { pres: 'río ríes ríe reímos reís ríen', pret: 'reí reíste rió reímos reísteis rieron', subj: 'ría rías ría riamos riáis rían', ger: 'riendo', part: 'reído' },
  oler: { pres: 'huelo hueles huele olemos oléis huelen', subj: 'huela huelas huela olamos oláis huelan', imp: 'huele' },
  morir: { part: 'muerto' }, volver: { part: 'vuelto' }, devolver: { part: 'devuelto' }, resolver: { part: 'resuelto' }, envolver: { part: 'envuelto' },
  escribir: { part: 'escrito' }, describir: { part: 'descrito' }, abrir: { part: 'abierto' }, romper: { part: 'roto' }, cubrir: { part: 'cubierto' }, descubrir: { part: 'descubierto' },
  freír: { part: 'frito' }, imprimir: { part: 'impreso' },
}
const PREFIXED = {
  detener: 'tener', mantener: 'tener', obtener: 'tener', contener: 'tener', sostener: 'tener', retener: 'tener', entretener: 'tener',
  suponer: 'poner', componer: 'poner', proponer: 'poner', exponer: 'poner', imponer: 'poner', oponer: 'poner', disponer: 'poner', reponer: 'poner',
  convenir: 'venir', prevenir: 'venir', intervenir: 'venir', deshacer: 'hacer', rehacer: 'hacer', predecir: 'decir', contradecir: 'decir',
  atraer: 'traer', distraer: 'traer', contraer: 'traer', prever: 'ver', sobresalir: 'salir', equivaler: 'valer', desandar: 'andar', recaer: 'caer',
}

const ENDINGS = {
  ar: { pres: ['o', 'as', 'a', 'amos', 'áis', 'an'], pret: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], impf: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], subj: ['e', 'es', 'e', 'emos', 'éis', 'en'], ger: 'ando', part: 'ado' },
  er: { pres: ['o', 'es', 'e', 'emos', 'éis', 'en'], pret: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], impf: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], subj: ['a', 'as', 'a', 'amos', 'áis', 'an'], ger: 'iendo', part: 'ido' },
  ir: { pres: ['o', 'es', 'e', 'imos', 'ís', 'en'], pret: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], impf: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], subj: ['a', 'as', 'a', 'amos', 'áis', 'an'], ger: 'iendo', part: 'ido' },
}
const FUT = ['é', 'ás', 'á', 'emos', 'éis', 'án']
const COND = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían']
const STRONG = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron']

function changeStem(stem, type) {
  const target = type === 'u' ? 'u' : type === 'ue' ? 'o' : 'e'
  const i = stem.lastIndexOf(target)
  if (i < 0) return stem
  const rep = type === 'ue' && i === 0 ? 'hue' : type === 'u' ? 'ue' : type
  return stem.slice(0, i) + rep + stem.slice(i + 1)
}

// Orthography: make a stem + ending pair spell correctly.
function join(stem, end, cls, inf) {
  const front = /^[eéií]/.test(end)
  const back = /^[aáoó]/.test(end)
  if (cls === 'ar' && front) {
    if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'qu'
    else if (stem.endsWith('g')) stem = stem.slice(0, -1) + 'gu'
    else if (stem.endsWith('z')) stem = stem.slice(0, -1) + 'c'
  }
  if (cls !== 'ar' && back) {
    if (stem.endsWith('gu') && inf.endsWith('guir')) stem = stem.slice(0, -1)
    else if (stem.endsWith('g')) stem = stem.slice(0, -1) + 'j'
    else if (/[aeiou]c$/.test(stem) && !/^(hacer|decir|cocer)$/.test(inf)) stem = stem.slice(0, -1) + 'zc'
    else if (stem.endsWith('c')) stem = stem.slice(0, -1) + 'z'
  }
  // vowel-final stems in -er/-ir (leer, creer, caer, oír, construir): unstressed i -> y
  if (cls !== 'ar' && /[aeiouü]$/.test(stem) && !stem.endsWith('qu') && !stem.endsWith('gu')) {
    if (end.startsWith('ie') || end === 'ió') end = 'y' + end.slice(1)
    else if (/^i/.test(end) && !/u$/.test(stem)) end = 'í' + end.slice(1)
  }
  return stem + end
}

export function conjugate(inf) {
  const forms = new Set([inf])
  const base = PREFIXED[inf]
  const prefix = base ? inf.slice(0, -base.length) : ''
  const irr = IRR[base || inf] || {}
  const P = (s) => (prefix && s ? prefix + s : s)
  const cls = inf.endsWith('ar') ? 'ar' : inf.endsWith('ír') || inf.endsWith('ir') ? 'ir' : 'er'
  const E = ENDINGS[cls]
  const stem = deaccent(inf).slice(0, -2)
  const st = stemType.get(inf) || stemType.get(base)
  const uir = /[^g]uir$/.test(inf) // construir
  const add = (f) => f && forms.add(f)
  const list = (s) => (s ? s.split(' ').map(P) : null)

  // present
  const pres = list(irr.pres) || E.pres.map((e, i) => {
    let s = stem
    if (st && [0, 1, 2, 5].includes(i)) s = changeStem(stem, st)
    if (uir && [0, 1, 2, 5].includes(i)) return s + 'y' + e
    return join(s, e, cls, inf)
  })
  if (irr.pres1 && !irr.pres) pres[0] = P(irr.pres1)
  pres.forEach(add)
  if (/[iu]ar$/.test(inf)) [0, 1, 2, 5].forEach((i) => add(stem.slice(0, -1) + ACC[stem.at(-1)] + E.pres[i])) // enviar -> envío

  // preterite
  const irStem2 = cls === 'ir' && st ? stem.slice(0, stem.lastIndexOf(st === 'ue' ? 'o' : 'e')) + (st === 'ue' ? 'u' : 'i') + stem.slice(stem.lastIndexOf(st === 'ue' ? 'o' : 'e') + 1) : stem
  let pret
  if (irr.pret) pret = list(irr.pret)
  else if (irr.pretStem) {
    const s = P(irr.pretStem)
    pret = STRONG.map((e) => s + (s.endsWith('j') && e === 'ieron' ? 'eron' : e))
  } else pret = E.pret.map((e, i) => (uir && (i === 2 || i === 5) ? stem + (i === 2 ? 'yó' : 'yeron') : join([2, 5].includes(i) ? irStem2 : stem, e, cls, inf)))
  pret.forEach(add)

  // imperfect
  ;(list(irr.impf) || E.impf.map((e) => stem + e)).forEach(add)
  // future + conditional
  const fstem = irr.fut ? P(irr.fut) : deaccent(inf)
  FUT.forEach((e) => add(fstem + e)); COND.forEach((e) => add(fstem + e))
  // present subjunctive
  let subj = list(irr.subj)
  if (!subj) {
    if (irr.subjStem) subj = E.subj.map((e) => P(irr.subjStem) + (cls === 'ar' ? e : e))
    else {
      const p1 = pres[0]
      const s1 = p1.endsWith('o') ? p1.slice(0, -1) : stem
      subj = E.subj.map((e, i) => {
        if ([3, 4].includes(i) && !uir) return join(cls === 'ir' && st ? irStem2 : stem, e, cls, inf)
        return cls === 'ar' ? join(st ? changeStem(stem, st) : stem, e, cls, inf) : s1 + e
      })
    }
  }
  subj.forEach(add)
  if (/[iu]ar$/.test(inf)) [0, 1, 2, 5].forEach((i) => add(stem.slice(0, -1) + ACC[stem.at(-1)] + E.subj[i]))
  // imperfect subjunctive from preterite 3pl
  const p6 = pret[5]
  if (p6?.endsWith('ron')) {
    const s = p6.slice(0, -3)
    for (const [a, b] of [['ra', 'se']]) {
      ;['', 's', '', 'mos', 'is', 'n'].forEach((x, i) => {
        const st2 = i === 3 ? accentLastVowel(s) : s
        add(st2 + a + x); add(st2 + b + x)
      })
    }
  }
  // imperative
  if (irr.imp) list(irr.imp).forEach((f) => { add(f); if (prefix) add(accentLastVowel(f)) })
  add(pres[2]) // tú affirmative = 3sg
  add(deaccent(inf).slice(0, -1) + 'd')
  // gerund + participle
  const ger = irr.ger ? P(irr.ger) : uir ? stem + 'yendo' : join(cls === 'ir' && st ? irStem2 : stem, E.ger, cls, inf)
  add(ger)
  const part = irr.part ? P(irr.part) : /[aeo]$/.test(stem) && cls !== 'ar' ? stem + 'ído' : stem + E.part
  for (const x of ['', 'a', 's', 'as'].map((x) => (x === 's' ? 'os' : x))) add(part.slice(0, -1) + (x === '' ? 'o' : x))
  return forms
}

const IRR_NOMINAL = {
  ese: ['esa', 'esos', 'esas'], este: ['estos', 'estas'], esta: ['estas'], aquel: ['aquella', 'aquellos', 'aquellas'],
  cualquier: ['cualquiera', 'cualesquiera'], alguno: ['algún'], ninguno: ['ningún'], bueno: ['buen'], malo: ['mal'], grande: ['gran'],
  primero: ['primer'], tercero: ['tercer'], uno: ['un', 'una', 'unos', 'unas'], cuál: ['cuáles'], quién: ['quiénes'], cuánto: ['cuánta', 'cuántos', 'cuántas'],
  nosotros: ['nosotras'], ellos: ['ellas'], joven: ['jóvenes'], orden: ['órdenes'], examen: ['exámenes'], imagen: ['imágenes'], crimen: ['crímenes'],
  origen: ['orígenes'], carácter: ['caracteres'], 'él': [], mí: [], ti: [], mil: ['miles'], millón: ['millones'], santo: ['san'], cien: ['ciento', 'cientos'],
}

export function plural(w) {
  if (/[sx]$/.test(w) && !/[áéíóú]s$/.test(w)) return [w]
  if (/z$/.test(w)) return [w.slice(0, -1) + 'ces']
  if (/[aeiouéó]$/.test(w) || /[áéó]$/.test(w)) return [w + 's']
  if (/[íú]$/.test(w)) return [w + 's', w + 'es']
  if (/[áéíóú][nsl]$/.test(w) || /[áéíóú][^aeiou]$/.test(w)) return [deaccent(w) + 'es']
  return [w + 'es']
}

function nominal(w, pos) {
  const out = new Set([w])
  const isAdj = pos === 'adj.' || pos === 'det.' || pos === 'pron.' || pos === 'num.'
  for (const f of IRR_NOMINAL[w] || []) out.add(f)
  if (w.includes(' ')) return out
  plural(w).forEach((p) => out.add(p))
  if (isAdj && w.length > 2) {
    let fem = null
    if (w.endsWith('o')) fem = w.slice(0, -1) + 'a'
    else if (/(or|ón|án|és|ín)$/.test(w)) fem = deaccent(w) + 'a'
    if (fem) { out.add(fem); plural(fem).forEach((p) => out.add(p)) }
    if (pos === 'adj.') out.add((fem || w) + 'mente')
  }
  return out
}

// Turn a words.json entry into its bare lemmas ("un jefe una jefa" -> [jefe, jefa]).
export function entryLemmas(word) {
  const w = word.toLowerCase().trim()
  const pair = w.match(/^(?:un|una|el|la|los|las) (\S+) (?:un|una|el|la) (\S+)$/)
  if (pair) return [pair[1], pair[2]]
  const single = w.match(/^(?:un|una|el|la|los|las) (\S+)$/)
  if (single) return [single[1]]
  if (w.includes(' ')) return w.split(' ').filter((x) => !GRAMMAR.has(x)) // de acuerdo -> acuerdo
  return [w]
}

// Build form -> { rank, lemma } using the best (lowest) rank for collisions.
export function buildFormMap(words) {
  const map = new Map()
  const put = (form, rank, lemma, verb) => {
    const cur = map.get(form)
    if (!cur || rank < cur.rank) map.set(form, { rank, lemma, verb: verb || cur?.verb || false })
    else if (verb) cur.verb = true
  }
  for (const e of words) {
    for (const lemma of entryLemmas(e.word)) {
      const isVerb = e.pos === 'v.' && /(ar|er|ir|ír)$/.test(lemma)
      const forms = isVerb ? conjugate(lemma) : nominal(lemma, e.pos)
      for (const f of forms) put(f, e.rank, lemma, isVerb)
    }
  }
  return map
}

const CLITICS = ['me', 'te', 'se', 'lo', 'la', 'los', 'las', 'le', 'les', 'nos', 'os']
// Strip up to two enclitic pronouns from a verb form (dímelo, sentaos, vámonos, comiéndolo).
export function stripClitics(tok, lookup) {
  const tries = []
  for (const a of CLITICS) {
    if (!tok.endsWith(a) || tok.length - a.length < 2) continue
    const r1 = tok.slice(0, -a.length)
    tries.push([r1, [a]])
    for (const b of CLITICS) if (r1.endsWith(b) && r1.length - b.length >= 2) tries.push([r1.slice(0, -b.length), [b, a]])
  }
  for (const [rest, cl] of tries) {
    for (const cand of [rest, deaccent(rest), deaccent(rest) + (cl[0] === 'nos' ? 's' : ''), cl[0] === 'os' ? rest + 'd' : null]) {
      if (!cand) continue
      const hit = lookup(cand)
      if (hit?.verb) return { ...hit, clitics: cl }
    }
  }
  return null
}
