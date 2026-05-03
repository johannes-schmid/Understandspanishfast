# Site Structure — UnderstandSpanishFast

> URL hierarchy designed for SEO from day one.
> Phase labels indicate when each page should be built.

---

## Full URL Map

```
yourdomain.com/
│
├── /                                          [Phase 1] Homepage
│   └── Target: "understand Spanish fast", "learn Spanish fast"
│
├── /how-it-works                              [Phase 1] Method/product page
│   └── Target: "how to understand Spanish", "Spanish comprehension method"
│
├── /words/                                    [Phase 1] ★★ PRIMARY SEO HUB
│   ├── /most-common-spanish-words             [Phase 1] ★ Beachhead page #1
│   │   └── Target: "most common Spanish words", "most used Spanish words", "common Spanish words list"
│   ├── /most-frequent-spanish-words           [Phase 1] ★ Beachhead page #2
│   │   └── Target: "most frequent Spanish words", "frequently used Spanish words"
│   ├── /spanish-frequency-list                [Phase 1] ★ Beachhead page #3
│   │   └── Target: "Spanish frequency list", "Spanish word frequency", "high frequency Spanish words"
│   ├── /top-1000-spanish-words                [Phase 1] ★ Beachhead page #4
│   │   └── Target: "1000 most common Spanish words", "top 1000 Spanish words"
│   ├── /top-100-spanish-words                 [Phase 2]
│   │   └── Target: "top 100 Spanish words", "100 most common Spanish words", "basic Spanish words"
│   ├── /top-500-spanish-words                 [Phase 2]
│   │   └── Target: "top 500 Spanish words", "500 most common Spanish words"
│   ├── /top-2000-spanish-words                [Phase 2]
│   │   └── Target: "2000 most common Spanish words", "top 2000 Spanish words"
│   ├── /most-common-spanish-verbs             [Phase 2]
│   │   └── Target: "most common Spanish verbs", "most used Spanish verbs"
│   └── /most-common-spanish-phrases           [Phase 2]
│       └── Target: "most common Spanish phrases", "most used Spanish phrases"
│
├── /blog/                                     SEO content hub
│   ├── /how-many-words-to-understand-spanish  [Phase 1] ★ High-value
│   │   └── Target: "how many Spanish words to be fluent"
│   ├── /why-most-spanish-apps-fail            [Phase 1] ★ High-value
│   │   └── Target: "why duolingo doesn't work", "duolingo doesn't teach comprehension"
│   ├── /understand-spanish-netflix            [Phase 2]
│   │   └── Target: "understand Spanish Netflix", "watch Spanish shows"
│   ├── /spanish-comprehension-guide           [Phase 2]
│   │   └── Target: "Spanish comprehension", "improve Spanish comprehension"
│   ├── /comprehensible-input-spanish          [Phase 2]
│   │   └── Target: "comprehensible input Spanish"
│   ├── /understand-spoken-spanish             [Phase 3]
│   │   └── Target: "understand spoken Spanish"
│   ├── /spanish-listening-comprehension       [Phase 3]
│   │   └── Target: "Spanish listening comprehension"
│   ├── /learn-spanish-without-grammar         [Phase 3]
│   │   └── Target: "learn Spanish without grammar rules"
│   └── /80-20-rule-spanish-vocabulary         [Phase 3]
│       └── Target: "80/20 rule Spanish", "Pareto Spanish vocabulary"
│
├── /compare/                                  Comparison / high-converting
│   ├── /vs-duolingo                           [Phase 2] ★ High-converting
│   │   └── Target: "understandspanishfast vs duolingo"
│   ├── /duolingo-alternative                  [Phase 2] ★ High-converting
│   │   └── Target: "duolingo alternative", "duolingo alternative Spanish"
│   ├── /vs-babbel                             [Phase 3]
│   │   └── Target: "babbel alternative", "vs babbel Spanish"
│   └── /vs-anki                               [Phase 3]
│       └── Target: "anki alternative Spanish"
│
├── /about                                     [Phase 1]
├── /privacy                                   [Phase 1]
└── /terms                                     [Phase 1]
```

---

## German Version (when ready)

Add `/de/` prefix to all pages. Implement `hreflang` across all page pairs.

```
/de/                                                  German homepage
/de/woerter/haeufigste-spanische-woerter              Most common Spanish words (DE)
/de/woerter/top-1000-spanische-woerter                Top 1000 Spanish words (DE)
/de/blog/wie-viele-woerter-spanisch-verstehen         How many words (DE)
/de/vergleich/vs-duolingo                             vs Duolingo (DE)
```

---

## Internal Linking Rules

| From | Must link to |
|---|---|
| Homepage | `/how-it-works`, `/words/most-common-spanish-words`, `/blog/how-many-words-to-understand-spanish` |
| `/how-it-works` | Homepage, `/words/most-common-spanish-words`, `/compare/vs-duolingo` |
| `/words/*` pages | `/how-it-works`, Homepage, 2–3 sibling `/words/` pages |
| `/words/most-common-spanish-words` | `/words/top-1000-spanish-words`, `/words/most-frequent-spanish-words`, `/words/spanish-frequency-list` |
| Blog posts | `/words/` hub, `/how-it-works`, 1–2 related blog posts |
| Comparison pages | Homepage, `/how-it-works`, `/words/most-common-spanish-words` |

Every page must have at least **2 internal links pointing to it** from other pages.

---

## robots.txt (Day 1)

```
User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /staging/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## sitemap.xml Priority Values

| URL | Priority | Change Frequency |
|---|---|---|
| / | 1.0 | weekly |
| /how-it-works | 0.9 | monthly |
| /vocabulary/* | 0.8 | monthly |
| /compare/* | 0.8 | monthly |
| /blog/* | 0.7 | weekly |
| /about | 0.5 | yearly |
| /privacy, /terms | 0.1 | yearly |
