# Deck 1,501–3,000 pipeline

Data pipeline for the intermediate Anki deck "Spanish Words 1,501–3,000". Output goes to `data/words-3000.json`, in the same shape as `data/words.json`.

```
PATH="/opt/homebrew/bin:$PATH" node scripts/deck3000/build-list.mjs                                 # 1. candidate pool (no API)
PATH="/opt/homebrew/bin:$PATH" node --env-file=.env.local scripts/deck3000/generate.mjs [--limit 30]  # 2. screen + content (Claude)
PATH="/opt/homebrew/bin:$PATH" node --env-file=.env.local scripts/deck3000/audio.mjs                  # 3. audio (ElevenLabs)
PATH="/opt/homebrew/bin:$PATH" node --env-file=.env.local scripts/deck3000/audio.mjs --sample 5 --out samples/deck3000   # voice comparison
```

Keys in `.env.local`: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY` (the script also accepts the misspelt `ELEVEN_LAPS_API_KEY` currently in the file).

## Where the words come from

**Frequency source: [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords), `content/2018/es/es_50k.txt`.** It counts the 50,000 most frequent word forms in the Spanish part of the [OpenSubtitles 2018](https://opus.nlpl.eu/OpenSubtitles2018.php) corpus (film and TV subtitles, which researchers use as a stand-in for everyday speech). This matches what the site already says about the first 1,500 ("compiled primarily from film and television subtitles"), and the order of `data/words.json` tracks this list closely: the median subtitle rank rises steadily from ~100 for our words 1–100 to ~3,500 for our words 1,401–1,500, and 1,388 of our 1,500 are among the source's top 3,000 lemmas.

Licence: the word list is **CC BY-SA 4.0** (the code is MIT). Attribution to show wherever the deck is described (deck description, product page, "Sources" note):

> Word frequencies: FrequencyWords by Hermit Dave (github.com/hermitdave/FrequencyWords), CC BY-SA 4.0, built from the OpenSubtitles 2018 corpus (opus.nlpl.eu).

Share-alike: our ranked headword list is an adaptation of that list, so if we publish the list itself (for example a downloadable CSV of the ranking) it has to be under CC BY-SA too. The example sentences, translations and audio are our own content, not derived from the list.

**Lemmatiser (build tool only): [michmech/lemmatization-lists](https://github.com/michmech/lemmatization-lists)** `lemmatization-es.txt`, ODbL 1.0. We only use it to group word forms (tengo, tiene, tenía → tener). The deck is a "Produced Work" under ODbL, which needs a notice: "Lemmatisation: lemmatization-lists by Michal Měchura, ODbL 1.0". We do not redistribute the lemma database.

Downloads are cached in `scripts/deck3000/.cache/` (not committed).

## Method

"Rank 1,501" here does **not** mean rank 1,501 of a raw frequency list. `data/words.json` leaves out the top function words (de, que, no, y, a, el, la, en, se, me, un, por, para, mi, su …), skips many very frequent cognates and greetings (problema, momento, hola, gracias), and counts sólo (#51) and solo (#76) as two words. So the new deck is **the next 1,500 content words after our current 1,500**, numbered 1,501–3,000:

1. `build-list.mjs` reads the 50k forms in frequency order, keeps lower-case Spanish-letter tokens, and maps each form to a lemma. Ambiguous forms (fue → ser/ir, podemos → poder/podar) go to whichever candidate lemma is itself most frequent in the corpus. Counts are summed per lemma and lemmas are sorted by total count. Anything whose lemma or surface form is already in `words.json` (ignoring un/una/el/la) is removed. The first 3,500 remaining lemmas go to `candidates.json` with their top surface forms.
2. `generate.mjs` sends the candidates to `claude-opus-5-5` in batches of 40, in order, with the full list of our first 1,500 words in the (cached) system prompt. For each candidate the model either keeps it or drops it with a reason:
   - `function_word`: articles, prepositions, conjunctions, pronouns, contractions
   - `proper_noun`: names, places, brands (john, york)
   - `sound_interjection`: oh, eh, ah, uh (real words used as interjections, like hola or vale, stay)
   - `profanity`: words whose main use is swearing (mierda, joder); mild ones like idiota stay
   - `foreign`: the, ok, hey
   - `not_a_word`: accent-less misspellings (aqui, asi), tokenisation noise
   - `duplicate`: a form or enclitic of a known word (dame → dar, verte → ver), checked again in code against `words.json` and earlier kept words
   
   Kept words get the dictionary headword (infinitive, masculine singular, no article), POS, 1–3 meanings, a spoken-register example sentence of at most 14 words that uses mostly our first 1,500 words, an English translation, and a `cognate` flag. Every batch is validated (item order, empty fields, meaning count, sentence length) and retried up to 3 times.
3. Kept words are numbered from 1,501 in source order until there are 1,500. Drop reasons are logged in `dropped.json`.

Fields in `data/words-3000.json`: `rank, word, pos, meanings, example_es, example_en, audio, sentence_audio` as in `words.json`, plus `cognate` (boolean, so the deck can tag or filter easy words). Unlike `words.json`, nouns never carry un/una in `word`; gender is in `pos` (n.m. / n.f. / n. for both).

## Audio

ElevenLabs text-to-speech, `POST /v1/text-to-speech/{voice_id}?output_format=mp3_44100_128`, model `eleven_v4` (their highest-quality model; same 1 credit per character as Multilingual v2; supports `language_code: "es"`), fixed `seed` for repeatable takes. Production alternates two voices by rank, like jhenny/juan in `public/audio`. Files: `<word>_<voice>.mp3` and `<word>_<voice>_<md5(example_es)[0:8]>.mp3`, written to `workbook/audio-3000/` by default (not `public/`, since this is paid content). Existing files are skipped, so reruns are resumable.

Commercial use: ElevenLabs output may be used commercially on any paid plan (Starter and up). Free-plan output is non-commercial and needs attribution, so generate production audio on a paid plan.
