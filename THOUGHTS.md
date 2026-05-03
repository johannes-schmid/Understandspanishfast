# Project Thoughts Log — UnderstandSpanishFast

Running log of important insights, decisions, and observations.
Most recent entries at the top.

---

## 2026-05-02 — SEO Wedge: Frequency & Common Word Pages

**Observation:** Searches for "most common Spanish words", "most frequent Spanish words", and related queries are dominated by old, outdated, poorly designed pages. The top results appear to be from 2010–2018 with no interactivity, bad UX, and no connection to a learning outcome.

**Decision:** Make the `/words/` frequency cluster the #1 SEO priority — build it before everything else, even before the full product is ready.

**Why this matters:**
- These users are actively looking for what the product is built on (frequency-first learning)
- Old pages = low authority, bad UX, no updates = beatable with quality content
- Frequency pages earn natural backlinks from teachers, Reddit, Quora without outreach
- They attract the exact right user: someone who has already decided frequency-based learning is the right approach

**What to build first:**
1. `/words/most-common-spanish-words` — highest volume, clearest intent
2. `/words/most-frequent-spanish-words` — captures variant searches
3. `/words/top-1000-spanish-words` — core list, highly searched
4. `/words/spanish-frequency-list` — researchers + teachers

**What makes a frequency page genuinely better than competitors:**
- Show comprehension coverage per tier (e.g., "Top 1000 words → ~74% of spoken Spanish")
- Example sentence for each word
- Interactive: filter by part of speech, mark as learned
- Mobile-first, fast, clean
- Cite the underlying corpus data
- Keep `dateModified` current so Google shows a fresh date

---

## 2026-05-02 — Project Kickoff

**Core product bet:** Most Spanish learners fail not because they lack motivation, but because they learn the wrong words in the wrong order. If you give them the right 1500–2000 words in frequency order with comprehension tracking, they reach real-world understanding much faster.

**Differentiator from Duolingo/Babbel:** Outcome-oriented. Progress is measured in "% of real Spanish you can now understand", not XP or streaks.

**Target user state:** "I've been studying Spanish for months/years but still can't understand real conversations or shows."

**SEO files created:**
- `SEO-STRATEGY.md` — full strategy with keyword priorities, schema plan, technical checklist, content roadmap
- `SITE-STRUCTURE.md` — complete URL hierarchy with phase labels and internal linking rules
