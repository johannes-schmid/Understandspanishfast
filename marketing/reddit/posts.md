# Reddit distribution kit: mostcommonspanish.com

Drafts only. Nothing here has been posted. Re-read each sub's rules on reddit.com the day you post, because rules change and some of them could not be verified from here (see "Rules status").

## Assets

| File | Use |
|---|---|
| `top-100-spanish-words.png` | Lead artifact. Top 100 with meanings, verbs highlighted, coverage note, source line |
| `spanish-words-101-200.png` | Follow-up post a week or two later ("part 2") |
| `top-50-spanish-verbs.png` | Strongest fit for r/Spanish and r/SpanishLearning |
| `read-vs-listen-spoken-forms.png` | Hits the "I can read but can't understand speech" pain point. Best fit for r/dreamingspanish and listening threads |

All are 2160×2700 (4:5, 2× of 1080×1350). Regenerate with:

```
PATH="/opt/homebrew/bin:$PATH" node scripts/social/render.mjs            # all
PATH="/opt/homebrew/bin:$PATH" node scripts/social/render.mjs top-50-spanish-verbs   # one
```

Free things you can link without an email gate (prefer these on Reddit; email gates get called out):
- Full list with example sentences: https://mostcommonspanish.com/words/most-common-spanish-words
- Top 100 page: https://mostcommonspanish.com/words/top-100-spanish-words
- Verbs page: https://mostcommonspanish.com/words/most-common-spanish-verbs
- Free 100-word Anki sample (direct file): https://mostcommonspanish.com/anki/top-100-spanish-words-sample.apkg
- How the ranking works: https://mostcommonspanish.com/words/spanish-frequency-list

Do NOT lead with the PDF lead magnet (`/words/most-common-spanish-words-pdf`), because it collects an email.

## Before you post: answers you must have ready

Commenters will ask these. Fix or decide them first.

1. **"Where did you source the words?"** The site only says the list is "compiled from large corpora of spoken and conversational Spanish, primarily film and television subtitles." No corpus is named anywhere in the repo. Ranking signatures (`matar` #86, `Dios` #65, `señor` #69, `morir`, `policía`) look like a subtitle corpus such as OpenSubtitles / SUBTLEX-ESP. **Name the real source in the first comment.** If you don't know it, say "a lemmatised subtitle frequency list, cleaned by hand" and expect pushback.
2. **"Where are de, que, no, y, el, la?"** `data/words.json` leaves out the top glue words (de, que, no, y, a, el, la, en, se, me, un, por, para, es, mi, su...). In any corpus `de` and `que` are #1 and #2. The images say so and add them back in the coverage note. Be upfront: "I left out the glue words because you can't really flashcard them; you pick them up in your first week of listening."
3. **"50%? Really?"** The ~50% for the top 100 only holds with those glue words counted. The site's own pages say "the top 100 cover about half" without that caveat, so the site and the images now differ slightly. Consider adding the caveat to `/words/top-100-spanish-words`.
4. **`sólo` (#51) and `solo` (#76) are both in the list**, both "only". Since the 2010 RAE reform `solo` normally takes no accent, so this is one word counted twice. It's visible on the top-100 image. Someone will point it out. Fix in `data/words.json` (merge, promote #101) and re-render, or own it in a comment.
5. **AI disclosure.** The workbook content was generated with Claude (per CLAUDE.md). If the example sentences or Anki deck were also AI-assisted, say so plainly when you mention them. r/Anki explicitly asks for AI-built projects to be disclosed.

## Rules status

Reddit blocks my fetch and search tools, so I could only verify rules through search-engine snippets and mirrors. Treat this table as a starting point, not as verification.

| Sub | Rules page | What I could confirm | Status |
|---|---|---|---|
| r/Spanish | https://www.reddit.com/r/Spanish/wiki/rules | Wiki (via mirror) says self-promotion is allowed only after moderator approval, rejects blatant spam and violations of a separate self-promotion policy. Your research says promotion only in the Weekly Self-Promotion Mega Thread. Both can be true. | Partly verified. Message mods before any post that links the site |
| r/languagelearning | https://www.reddit.com/r/languagelearning/wiki/rules_for_promotion | Mandatory to read before promoting. New or non-participating users cannot post apps or anything they profit from. Free content may be allowed with heavy quality standards. Posts and comments both count toward limits. Disclosing affiliation reduces ban risk. Posts in the stickied "Share your resources" thread (every other Wednesday, 06:00 UTC) do not count toward limits. Fake supportive comments from other accounts count as self-promotion. | Verified via mirror snippets |
| r/dreamingspanish | https://www.reddit.com/r/dreamingspanish/about/rules | Not retrievable | Unverified. Read sidebar first |
| r/SpanishLearning | https://www.reddit.com/r/SpanishLearning/about/rules | Not retrievable | Unverified. Read sidebar first |
| r/Anki | https://www.reddit.com/r/Anki/about/rules | A recent mod update says Rule 3 (self-promotion) and Rule 5 (market research) apply with extra scrutiny, AI-built projects must be disclosed, and when in doubt post to r/AnkiAI | Partly verified (search snippet) |

General rule for all of them: post the image natively (image upload, not a link post), keep the site link out of the post body where possible, and put one link in your own first comment.

---

## 1. r/SpanishLearning (most tolerant, post here first)

**Image:** `top-50-spanish-verbs.png`

**Title:** I made a one-page cheat sheet of the 50 most common Spanish verbs, ranked by how often they're actually spoken

**Body:**

> Made this for myself and figured it's useful here. It's the 50 most frequent verbs from a spoken-Spanish frequency list (mostly film and TV subtitles), in order, with the main meaning.
>
> Two things surprised me when I ranked them:
> - `haber`, `deber` and `parecer` are all in the top 30 verbs. Textbooks treat them as intermediate, but you hear them constantly.
> - `matar` and `morir` are in the top 40 verbs. That's the TV-dialogue bias of subtitle data, so take that bit with a grain of salt.
>
> Full disclosure: I run a small site built around this frequency list (link in the comments if you want the full 1,500 with example sentences). The image is free to save, print or share.

**First comment:**

> Source and method, since someone always (rightly) asks: [NAME THE CORPUS]. [Confirm before posting: lemmatised, so `es`, `fue`, `soy` all count toward `ser`?] I left out tiny function words from the main list.
>
> Full list with an example sentence per word, free, no sign-up: https://mostcommonspanish.com/words/most-common-spanish-verbs
>
> Happy to make one for adjectives or nouns next if that's useful.

---

## 2. r/dreamingspanish (large, CI-focused, partly anti-Anki)

Lead with the listening problem, not with vocabulary or flashcards. This sub values hours of input. Don't argue with that, agree with it.

**Image:** `read-vs-listen-spoken-forms.png`

**Title:** Why you can read Spanish but can't follow it at full speed: the most common words get clipped

**Body:**

> A lot of posts here are some version of "I understand the video with subtitles, but not without." Part of the reason is that the words you know best are exactly the ones that get shortened in casual speech: `pa'`, `'tá`, `terminao`, `pos`, `na'`, `lo' amigo'`.
>
> I put the common ones on one page, with where you'll hear them. The point isn't to memorise this list. It's that the gap is your ear, not your vocabulary, which is basically the case for more input.
>
> Disclosure: I make a frequency-list site, so I had the word ranks handy (the small numbers). No link in the post; there's one in the comments if you want it.
>
> Corrections welcome, especially on the regional notes.

**First comment:**

> Regional notes are tendencies, not rules. Plenty of Mexicans don't say `pos`, plenty of Spaniards pronounce every `d`.
>
> If you want the ranked list the numbers come from: https://mostcommonspanish.com/words/spanish-frequency-list (explains the source and why coverage numbers differ between written and spoken corpora).
>
> What's a reduction that confused you the first time you heard it? I'll add the best ones to v2.

**Do not** mention the workbook or deck here. If someone asks how to combine a frequency deck with CI, answer the question and only then link the free list.

---

## 3. r/Spanish (biggest; promotion restricted)

Two options. Pick A unless mods approve B.

**A. Inside the weekly self-promotion thread (or after mod approval).**

**Comment text:**

> Made a set of free Spanish cheat sheets from a spoken-language frequency list: top 100 words, words 101 to 200, the top 50 verbs, and the most common clipped forms you hear in fast speech (`pa'`, `'tá`, `terminao`...). Images here: [imgur album link]. Full list with example sentences, free, no sign-up: https://mostcommonspanish.com/words/most-common-spanish-words. I made the site, so feedback (especially on translations) is very welcome.

**B. Standalone image post, only with written mod approval.** Send this modmail first:

> Hi mods, I made a free one-page image of the 100 most common Spanish words (frequency-ranked, meanings, source cited). I run the site the list comes from. Would you be OK with me posting the image itself, with no link in the post and one disclosed link in a comment? Happy to post only in the weekly thread if you prefer.

If approved: same image and title pattern as r/SpanishLearning, with `top-100-spanish-words.png`.

**Title:** The 100 most common Spanish words on one page (with meanings, verbs highlighted)

---

## 4. r/languagelearning (strict; build history first)

**Do not post anything linking the site until you have 3 to 4 weeks of genuine comments there.** Paid products are off-limits for you here entirely as a newer participant.

When ready (week 4), use the stickied **Share Your Resources** thread, which doesn't count toward promotion limits:

> I made free frequency cheat sheets for Spanish (top 100 words, top 50 verbs, and common clipped forms in fast speech). Image album: [imgur link]. Source: [corpus]. Disclosure: they come from my own site, https://mostcommonspanish.com/words/spanish-frequency-list, which is free to browse. Feedback welcome.

A language-agnostic standalone post is the better long-term play here (no link at all):

**Title:** For Spanish learners: the words you know best are the ones that get clipped in fast speech

Body: the `read-vs-listen` content as text plus the image, no link, ask other learners which reductions exist in their target language. Only add a link if someone asks, and disclose.

---

## 5. r/Anki (deck people; strict on self-promo and AI)

Only post the **free** sample deck. Mention the paid deck at most once, only if asked.

**Title:** Free Spanish frequency deck sample: top 100 words with audio and example sentences

**Body:**

> Sharing a free 100-card Spanish deck: the 100 most common words from a spoken-language frequency list, each with audio for the word and the example sentence [confirm: native-speaker recordings or TTS? say which].
>
> Direct .apkg, no sign-up: https://mostcommonspanish.com/anki/top-100-spanish-words-sample.apkg
>
> Disclosure: I made it, and it's the free sample of a larger paid deck. [If true: Example sentences were drafted with AI and checked by me / a native speaker.] Card design feedback welcome.

**First comment:** source of the frequency list, card fields, and note that IDs are stable so updates re-import cleanly.

Check before posting: does r/Anki allow a free sample of a paid deck under Rule 3? If unsure, modmail first.

---

## 4-week plan

Rhythm: one post per week maximum, spread across subs. Never cross-post the same image to two subs on the same day. Reply to every comment in the first 3 hours; that's what lifts posts.

**Week 1: participate, no links**
- r/languagelearning: 3 to 4 helpful comments every other day on threads about vocabulary, listening, plateaus. No links at all.
- r/dreamingspanish and r/Spanish: 5 to 10 comments each answering questions (word usage, "what does X mean in this clip"). No links.
- Fix the `sólo`/`solo` duplicate and decide what to say about the corpus source.

**Week 2: first post where it's tolerated**
- r/SpanishLearning: verbs post (Mon or Tue, 14:00 to 16:00 UTC, which catches Europe evening and US morning).
- Keep commenting in r/languagelearning (still no links).
- Modmail r/Spanish (option B text).

**Week 3: the listening angle**
- r/dreamingspanish: read-vs-listen post.
- r/Spanish: weekly self-promo thread comment, or the top-100 image if mods approved.
- 2 to 3 of the existing threads below, comment helpfully, link only where it truly answers the question.

**Week 4: decks and the strict sub**
- r/Anki: free sample deck post (after modmail if unsure).
- r/languagelearning: Share Your Resources thread entry. Optional language-agnostic text post.
- r/SpanishLearning: "part 2" post with `spanish-words-101-200.png`.

Track: upvotes, comments, saves, and site visits per post (add `?ref=reddit-<sub>` only if your analytics needs it; Reddit users dislike visible UTM tags, so prefer plain links and check referrers).

## Existing high-traffic threads to comment in

Reddit is blocked for my tools, so I could not open threads or confirm specific URLs. Instead of guessing links, these are search URLs that surface the recurring high-traffic thread types (sorted by top). Open each, pick a thread from the past year with many comments that is not archived, and leave one genuinely helpful comment. Link only where the link answers the question.

1. r/Spanish: "can read but can't understand" https://www.reddit.com/r/Spanish/search/?q=understand+spoken&restrict_sr=1&sort=top&t=year
2. r/Spanish: listening comprehension https://www.reddit.com/r/Spanish/search/?q=listening+comprehension&restrict_sr=1&sort=top&t=year
3. r/Spanish: most common words / frequency list https://www.reddit.com/r/Spanish/search/?q=most+common+words&restrict_sr=1&sort=top&t=all
4. r/Spanish: how many words to be fluent https://www.reddit.com/r/Spanish/search/?q=how+many+words&restrict_sr=1&sort=top&t=all
5. r/dreamingspanish: Anki alongside CI https://www.reddit.com/r/dreamingspanish/search/?q=anki&restrict_sr=1&sort=top&t=year
6. r/dreamingspanish: frequency deck https://www.reddit.com/r/dreamingspanish/search/?q=frequency&restrict_sr=1&sort=top&t=all
7. r/languagelearning: vocabulary vs input https://www.reddit.com/r/languagelearning/search/?q=frequency+list&restrict_sr=1&sort=top&t=year
8. r/languagelearning: listening plateau https://www.reddit.com/r/languagelearning/search/?q=can%27t+understand+native+speakers&restrict_sr=1&sort=top&t=year
9. r/Anki: Spanish deck recommendations https://www.reddit.com/r/Anki/search/?q=spanish+deck&restrict_sr=1&sort=top&t=year
10. r/SpanishLearning: verbs to learn first https://www.reddit.com/r/SpanishLearning/search/?q=verbs&restrict_sr=1&sort=top&t=all

Comment template (adapt, never paste verbatim twice):

> What helped me was splitting it in two: learn the top few hundred words by frequency so nothing in a sentence is totally new, then do lots of listening so your ear learns how those same words sound when they're clipped (`pa'`, `'tá`, `terminao`). The second part is the one most people skip. [Only if it fits:] I keep a free frequency list here if useful: [link]. (I made it.)
