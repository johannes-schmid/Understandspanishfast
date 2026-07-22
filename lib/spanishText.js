// Deterministic Spanish text analysis: tokenize, drop function words, count frequency.
// Lemmatization of genuinely-new (non-corpus) conjugations is delegated to the LLM
// definition step, which returns canonical lemmas; here we only do light plural
// stripping so noun/adjective plurals still hit the frequency corpus.

const STOPWORDS = new Set([
  // articles / determiners
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'aquel', 'aquella', 'aquellos', 'aquellas', 'esto', 'eso', 'aquello',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'vuestro', 'vuestra', 'vuestros', 'vuestras',
  // pronouns
  'yo', 'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'ti', 'usted', 'ustedes',
  'ellos', 'ellas', 'nosotros', 'nosotras', 'vosotros', 'vosotras',
  'que', 'quien', 'quienes', 'cuyo', 'cuya', 'cual', 'cuales',
  // prepositions / conjunctions
  'de', 'en', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'hasta', 'hacia',
  'desde', 'ante', 'bajo', 'tras', 'segun', 'durante', 'mediante',
  'y', 'e', 'o', 'u', 'ni', 'pero', 'sino', 'aunque', 'porque', 'pues',
  'como', 'cuando', 'donde', 'mientras', 'si', 'aun', 'ya',
  // very high-frequency verbs (ser/estar/haber/tener/ir/hacer common forms)
  'es', 'son', 'era', 'eran', 'fue', 'fueron', 'ser', 'soy', 'eres', 'sea',
  'esta', 'estan', 'estar', 'estaba', 'estoy', 'estamos', 'estas',
  'ha', 'han', 'he', 'has', 'hay', 'habia', 'haber', 'hemos',
  'tiene', 'tienen', 'tener', 'tengo', 'tenia',
  'va', 'van', 'ir', 'voy', 'vamos', 'iba',
  'hace', 'hacer', 'hizo', 'hacen',
  // adverbs / misc filler
  'no', 'mas', 'muy', 'tan', 'tanto', 'tambien', 'solo', 'todo', 'toda', 'todos', 'todas',
  'nada', 'algo', 'alguien', 'nadie', 'cada', 'otro', 'otra', 'otros', 'otras',
  'este', 'aqui', 'alli', 'ahi', 'asi', 'bien', 'mal', 'ahora', 'entonces',
  'a', 'ah', 'oh', 'eh',
])

export function tokenize(text) {
  const matches = text.toLowerCase().match(/[a-záéíóúüñ]+/gi) || []
  return matches
}

// Light singularization for corpus matching (nouns/adjectives).
export function singularize(token) {
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

// Count in-document frequency of content words. Returns [{ word, freq }] sorted desc.
export function wordFrequencies(text, { maxChars = 40000 } = {}) {
  const sample = text.slice(0, maxChars)
  const counts = new Map()
  for (const raw of tokenize(sample)) {
    if (raw.length < 3) continue
    if (STOPWORDS.has(raw)) continue
    counts.set(raw, (counts.get(raw) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([word, freq]) => ({ word, freq }))
    .sort((a, b) => b.freq - a.freq)
}

// Rough Spanish-ness signal for a text sample (0..1): share of tokens that are
// common Spanish function words. Used to reject mostly-English / wrong-language sources.
export function spanishScore(text) {
  const tokens = tokenize(text.slice(0, 20000))
  if (tokens.length === 0) return 0
  let hits = 0
  for (const t of tokens) if (STOPWORDS.has(t)) hits++
  return hits / tokens.length
}
