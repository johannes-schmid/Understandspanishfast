# SEO Strategy — UnderstandSpanishFast

> Build-ready SEO plan to implement from page one.
> Business type: EdTech SaaS · Language learning · No live URL yet (planning phase)

---

## 0. The Primary SEO Wedge — Frequency & Common Word Pages

**This is the #1 priority. Build this cluster before everything else.**

The user identified a clear gap: searches for "most common Spanish words", "most frequent Spanish words", and related queries are dominated by **old, outdated, poorly designed sites**. The top results are often static pages from 2010–2018 with no interactivity, bad UX, thin content, and no connection to a product.

This is the beachhead. Own these keywords first — they:
1. Attract exactly the right user (someone who wants efficient, frequency-based learning)
2. Are naturally linkable (teachers, Reddit, Quora, language blogs all cite these constantly)
3. Demonstrate the product's core value before the user even signs up
4. Are low-to-medium competition despite high search volume

### What "outdated" means and how to beat it
Current ranking pages typically:
- Show a plain numbered list with no context, audio, or usage examples
- Have no mobile optimization
- Have no explanation of *why* frequency matters
- Have no connection to a comprehension goal or progress metric
- Load slowly with old tech

Beat them by building pages that are genuinely useful resources:
- **Show coverage**: "These 100 words cover X% of everyday Spanish"
- **Add context**: Example sentence for each word
- **Connect to the outcome**: "Learn these 1000 words → understand ~70% of spoken Spanish"
- **Make it interactive**: Filter by part of speech, show/hide translation, mark as learned
- **Make it linkable**: Include sources (corpus data, academic references)
- **Keep it updated**: Add `dateModified` schema so Google shows a fresh date in results

### Frequency page cluster to build (prioritized order)

| URL | Primary Keyword | Why this order |
|---|---|---|
| `/words/most-common-spanish-words` | most common Spanish words | Highest volume, clearest intent |
| `/words/most-frequent-spanish-words` | most frequent Spanish words | Near-identical intent, separate page = double ranking surface |
| `/words/top-100-spanish-words` | top 100 Spanish words | Easy entry list, broad appeal |
| `/words/top-500-spanish-words` | top 500 Spanish words | Bridge between 100 and 1000 |
| `/words/top-1000-spanish-words` | 1000 most common Spanish words | Core list, very searched |
| `/words/top-2000-spanish-words` | 2000 most common Spanish words | Serious learner tier |
| `/words/spanish-frequency-list` | Spanish frequency list / Spanish word frequency | Researchers, teachers, SEO long tail |
| `/words/most-common-spanish-verbs` | most common Spanish verbs | High volume sub-niche |
| `/words/most-common-spanish-phrases` | most common Spanish phrases | High volume sub-niche |

**Key insight:** `/words/` is a better URL prefix than `/vocabulary/` — it's shorter, cleaner, and matches how users search (they search for "words", not "vocabulary").

---

## 1. Positioning & Search Identity

**Core search identity:** The tool that gets you to real Spanish comprehension fast — not another vocabulary drill.

The brand occupies a clear gap between:
- Gamified apps (Duolingo, Babbel) — fun, but users don't feel ready for real content
- Flashcard systems (Anki) — effective but high-friction and manual
- Comprehensible input tools (Migaku, Dreaming Spanish) — immersion-first but no structured vocabulary path

Search angle: **outcome over method**. Every page targets users searching for *results* ("understand Spanish", "understand Netflix in Spanish") not tools ("best vocabulary app").

---

## 2. Keyword Strategy

### P0 — Frequency & Common Word Pages (the beachhead, build first)

These are the primary SEO wedge. Old, weak sites currently rank for these. Beat them with quality.

| Keyword | Intent | Difficulty | Page |
|---|---|---|---|
| most common Spanish words | Informational | Medium | `/words/most-common-spanish-words` |
| most frequent Spanish words | Informational | Low–Medium | `/words/most-frequent-spanish-words` |
| most used Spanish words | Informational | Low–Medium | `/words/most-common-spanish-words` (secondary) |
| common Spanish words list | Informational | Low–Medium | `/words/most-common-spanish-words` (secondary) |
| Spanish words by frequency | Informational | Low | `/words/spanish-frequency-list` |
| Spanish word frequency list | Informational | Low | `/words/spanish-frequency-list` |
| top 100 Spanish words | Informational | Low | `/words/top-100-spanish-words` |
| top 500 Spanish words | Informational | Low | `/words/top-500-spanish-words` |
| 1000 most common Spanish words | Informational | Low | `/words/top-1000-spanish-words` |
| top 1000 Spanish words | Informational | Low | `/words/top-1000-spanish-words` |
| 2000 most common Spanish words | Informational | Low | `/words/top-2000-spanish-words` |
| most common Spanish verbs | Informational | Low | `/words/most-common-spanish-verbs` |
| most common Spanish phrases | Informational | Low | `/words/most-common-spanish-phrases` |
| frequently used Spanish words | Informational | Low | secondary on frequency pages |
| basic Spanish words most used | Informational | Low | secondary on top-100 page |
| high frequency Spanish words | Informational | Low–Medium | secondary on frequency list |

### P1 — Product & Comprehension Pages (drive sign-ups)

| Keyword | Intent | Difficulty | Priority |
|---|---|---|---|
| understand Spanish | Informational → Product | Medium | P1 |
| understand spoken Spanish | Informational | Low–Medium | P1 |
| Spanish comprehension | Informational | Medium | P1 |
| how many words to be fluent in Spanish | Informational | Low | P1 |
| learn Spanish fast | Informational → Product | High | P1 |
| understand Spanish Netflix | Informational | Low | P1 |

### P2 — Acquisition & Comparison Pages

| Keyword | Intent | Difficulty | Priority |
|---|---|---|---|
| duolingo alternative | Commercial | Medium | P2 |
| duolingo doesn't work | Commercial Investigation | Low | P2 |
| Spanish vocabulary for beginners | Informational | Medium | P2 |
| Spanish listening comprehension | Informational | Medium | P2 |

### Long-Tail Goldmine (blog-ready, low competition)

- "how many Spanish words do I need to understand a conversation"
- "why can't I understand Spanish even after studying"
- "understand 80% of Spanish with 1500 words"
- "Spanish words that appear most often in conversation"
- "how to stop translating in your head Spanish"
- "understand Spanish TV shows without subtitles"
- "learn Spanish without grammar rules"
- "frequency list Spanish most used words"
- "Spanish words used in everyday speech"
- "most common Spanish words in conversation"
- "what are the most important Spanish words to learn"
- "Spanish words you need to know"

### Competitor Brand Keywords (comparison pages)

- "duolingo alternative Spanish"
- "babbel alternative"
- "anki alternative Spanish"
- "pimsleur alternative"
- "migaku alternative"
- "why duolingo doesn't teach comprehension"
- "clozemaster alternative"

---

## 3. Site Architecture

Full URL hierarchy in `SITE-STRUCTURE.md`. Summary:

```
/                                     → Primary landing page
/how-it-works                         → Method/product explanation
/words/                               → ★ PRIMARY SEO HUB (build first)
  /most-common-spanish-words          → P0 — main beachhead page
  /most-frequent-spanish-words        → P0 — captures variant searches
  /spanish-frequency-list             → P0 — researchers + teachers
  /top-100-spanish-words              → P0 — easy entry list
  /top-500-spanish-words              → P0
  /top-1000-spanish-words             → P0
  /top-2000-spanish-words             → P0
  /most-common-spanish-verbs          → P0 — high-volume sub-niche
  /most-common-spanish-phrases        → P0 — high-volume sub-niche
/blog/                                → Content marketing hub
/compare/                             → Competitor comparison hub
  /vs-duolingo
  /vs-babbel
  /vs-anki
  /duolingo-alternative
/about
/privacy
/terms
```

**Why `/words/` not `/vocabulary/`:** Shorter, matches how users search, easier to type and share.

---

## 4. On-Page SEO Checklist (implement on every page)

### `<head>` requirements

```html
<!-- Required on every page -->
<title>[Primary Keyword] — UnderstandSpanishFast</title>
<meta name="description" content="[Benefit-led, 150–160 chars, includes keyword]">
<link rel="canonical" href="https://yourdomain.com/[page-path]">

<!-- Open Graph (for social sharing and link previews) -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="/og/[page-slug].png">  <!-- 1200×630px -->
<meta property="og:url" content="https://yourdomain.com/[page-path]">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="/og/[page-slug].png">
```

### Content structure (every page)

- One `<h1>` per page — includes primary keyword
- `<h2>` / `<h3>` for sub-sections — use related/secondary keywords naturally
- First paragraph: answer the search intent within the first 100 words
- Internal links: every page links to at least 2 other pages
- Image `alt` attributes: descriptive, keyword-relevant, not stuffed
- URL slugs: lowercase, hyphen-separated, keyword-first (e.g. `/most-common-spanish-words`)

### Title tag formulas by page type

| Page | Formula | Example |
|---|---|---|
| Homepage | [Outcome] — [Brand] | Understand Spanish Fast — UnderstandSpanishFast |
| Blog post | [Question or Promise] — [Brand] | How Many Spanish Words Do You Really Need? |
| Vocabulary page | [Keyword] — Free List + Guide — [Brand] | Most Common Spanish Words — Free List + Guide |
| Comparison page | [Brand] vs Duolingo: [Differentiator] | UnderstandSpanishFast vs Duolingo: Real Comprehension vs Streaks |

---

## 5. Schema Markup Plan

Implement structured data from day one. Every page type gets its own schema.

### Homepage
```json
{
  "@type": "SoftwareApplication",
  "name": "UnderstandSpanishFast",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "description": "Learn the 1500 most-used Spanish words and understand 80% of everyday Spanish.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```
Also add: `Organization`, `WebSite` (with `SearchAction` for sitelinks search box).

### Blog posts
```json
{ "@type": "Article" }  // or BlogPosting
// Include: headline, author, datePublished, dateModified, image
```
Add `FAQPage` at the bottom of each post — AI systems (ChatGPT, Perplexity, Google AI Overviews) heavily cite FAQ-structured content.

### Vocabulary pages
```json
{ "@type": "ItemList" }  // for word list pages
{ "@type": "EducationalOccupationalCredential" }  // for milestone/comprehension pages
```

### Comparison pages
```json
{ "@type": "Product" }  // for the product being compared
```
Add `FAQPage` — comparison FAQs are frequently cited in AI Overviews.

---

## 6. Technical SEO — Non-Negotiables (Day 1)

These must be in place before the first page goes live.

### Infrastructure
- [ ] HTTPS enforced (no mixed content)
- [ ] Redirect `www` → non-www (or vice versa) — pick one, stick to it
- [ ] `/sitemap.xml` — auto-generated, submitted to Google Search Console
- [ ] `/robots.txt` — allow all, disallow `/api/`, `/admin/`, `/staging/`
- [ ] `404` page with navigation links (not a blank page)

### Performance (Core Web Vitals targets)
- [ ] LCP < 2.5s — hero image preloaded, no render-blocking JS
- [ ] CLS < 0.1 — all images/embeds have explicit `width` + `height`
- [ ] INP < 200ms — no heavy JS on initial load
- [ ] Fonts: use `font-display: swap`, self-host or preconnect to Google Fonts
- [ ] Images: WebP format, lazy-load below-fold, preload hero image

### Crawlability
- [ ] Every page reachable within 3 clicks from homepage
- [ ] No orphan pages (every page has at least one internal link pointing to it)
- [ ] No `noindex` on pages you want ranked
- [ ] Consistent internal linking — use exact-match or near-match anchor text

### URL hygiene
- [ ] Trailing slash consistency — pick one convention across entire site
- [ ] No query string parameters in canonical URLs
- [ ] `hreflang` if you launch both `/en/` and `/de/` versions (see section 9)

---

## 7. Content Strategy & Publishing Roadmap

### Phase 1: Foundation (before or at launch)

Start with the frequency/common word cluster. These are the beachhead.

| Page | Target Keyword | Priority |
|---|---|---|
| `/words/most-common-spanish-words` | most common Spanish words | **P0** |
| `/words/most-frequent-spanish-words` | most frequent Spanish words | **P0** |
| `/words/top-1000-spanish-words` | 1000 most common Spanish words | **P0** |
| `/words/spanish-frequency-list` | Spanish frequency list | **P0** |
| Homepage | understand Spanish fast | P1 |
| `/how-it-works` | how to understand Spanish | P1 |
| `/blog/how-many-words-to-understand-spanish` | how many Spanish words to be fluent | P1 |
| `/blog/why-most-spanish-apps-fail` | why duolingo doesn't work | P1 |

### Phase 2: Content Expansion (weeks 3–8 post-launch)

| Page | Target Keyword | Type |
|---|---|---|
| `/words/top-100-spanish-words` | top 100 Spanish words | SEO page |
| `/words/top-500-spanish-words` | top 500 Spanish words | SEO page |
| `/words/top-2000-spanish-words` | 2000 most common Spanish words | SEO page |
| `/words/most-common-spanish-verbs` | most common Spanish verbs | SEO page |
| `/words/most-common-spanish-phrases` | most common Spanish phrases | SEO page |
| `/compare/vs-duolingo` | duolingo alternative Spanish | Comparison |
| `/compare/duolingo-alternative` | duolingo alternative | Comparison |
| `/blog/understand-spanish-netflix` | understand Spanish Netflix | Blog |
| `/blog/spanish-comprehension-guide` | Spanish comprehension | Blog |

### Phase 3: Authority Building (months 3–6)

| Page | Target Keyword | Type |
|---|---|---|
| /compare/vs-babbel | babbel alternative | Comparison |
| /compare/vs-anki | anki alternative Spanish | Comparison |
| /blog/understand-spoken-spanish | understand spoken Spanish | Blog |
| /blog/spanish-listening-comprehension | Spanish listening comprehension | Blog |
| /blog/learn-spanish-without-grammar | learn Spanish without grammar | Blog |
| /blog/80-20-rule-spanish-vocabulary | 80/20 Spanish vocabulary | Blog |

### Blog post formula (apply to every post)

1. **Hook** (H1): Answer the search query in plain terms — no fluff
2. **Answer first**: Give the core answer in the first 100 words (satisfies featured snippet criteria)
3. **Evidence**: Data, study references, or concrete examples
4. **Product mention**: One natural, non-pushy reference to UnderstandSpanishFast per post
5. **CTA**: One clear CTA at the end ("See how UnderstandSpanishFast does it →")
6. **FAQ section**: 3–5 questions at the bottom (FAQPage schema on each)
7. **Length**: 1200–2000 words for informational posts. Quality over length.

---

## 8. Comparison Pages (High-Converting)

Comparison pages target users who are already considering tools and close to a decision. These convert at 4–7% vs 0.5–1.8% for generic blog posts.

### Template for each `/compare/vs-[competitor]` page

**Structure:**
1. **H1**: UnderstandSpanishFast vs [Competitor]: Which One Actually Gets You to Comprehension?
2. **Summary table** (top of page, above fold): feature-by-feature grid
3. **Who [Competitor] is good for**: honest, not dismissive
4. **Why UnderstandSpanishFast is different**: focus on outcome vs activity
5. **User testimonials / quotes** (once you have them)
6. **FAQ** (FAQPage schema): 4–5 questions about the comparison
7. **CTA**: "Try UnderstandSpanishFast free →"

### Comparison table columns to include

| Feature | UnderstandSpanishFast | Duolingo | Babbel | Anki |
|---|---|---|---|---|
| Approach | Comprehension-first | Gamified drills | Grammar-led | Flashcard SRS |
| Vocabulary focus | Top 1500–2000 by frequency | Mixed/random | Thematic | User-defined |
| Progress metric | % comprehension of real content | XP / streaks | Lesson completion | Due card count |
| Outcome tracked | Can you understand real Spanish? | Did you complete today's lesson? | Did you finish a unit? | Did you review cards? |
| Time to first real comprehension | Weeks | Months–never | Months | Depends on user |

**Important:** Keep competitor facts accurate. Verify claims regularly — stale data damages credibility.

---

## 9. Multilingual SEO (English + German)

Given the target audience includes German speakers, plan for this from the start even if you launch English-only.

### When you're ready to add German:
- Use `/de/` subdirectory (not a separate domain)
- Add `hreflang` tags to every page pair:
  ```html
  <link rel="alternate" hreflang="en" href="https://yourdomain.com/blog/[post]">
  <link rel="alternate" hreflang="de" href="https://yourdomain.com/de/blog/[post]">
  <link rel="alternate" hreflang="x-default" href="https://yourdomain.com/blog/[post]">
  ```
- German target keywords to start with:
  - "Spanisch schnell lernen" (learn Spanish fast)
  - "Spanisch verstehen" (understand Spanish)
  - "häufigste spanische Wörter" (most common Spanish words)
  - "Duolingo Alternative Spanisch"

---

## 10. GEO — AI Search Readiness (ChatGPT, Perplexity, Google AI Overviews)

AI-generated answers increasingly replace standard search results. Optimize for citation.

### Technical requirements
- [ ] `/llms.txt` file in root — structured summary of what the product is and does (AI crawlers read this)
- [ ] All pages have clear, quotable sentences (data + claim format: "Learning 1500 high-frequency Spanish words gives you comprehension of ~80% of everyday conversations, based on frequency corpus analysis")
- [ ] No JavaScript-only content — AI crawlers often skip JS-rendered text
- [ ] `FAQPage` schema on all blog posts and comparison pages

### Content requirements for AI citation
- Use authoritative, specific language: numbers, percentages, study references
- Structure content with clear H2/H3 sections (AI systems parse structure)
- Answer the "what", "why", "how" and "how much" questions explicitly
- Cite your data sources (even if linking to Wiktionary frequency lists, academic papers, etc.)

### llms.txt template
```
# UnderstandSpanishFast

## What it is
A focused web application that teaches the 1500–2000 most-used Spanish words 
in frequency order, enabling users to understand ~80% of everyday spoken Spanish.

## Who it's for
English and German speakers who have tried Spanish apps but cannot understand 
real Spanish conversations, TV shows, or written content.

## How it works
Users learn high-frequency vocabulary in ranked order. The app tracks 
comprehension coverage (not lessons or XP) and shows what percentage of 
real Spanish content the user can now understand.

## What makes it different
- Vocabulary ordered by real-world frequency, not theme or grammar sequence
- Progress measured in comprehension coverage, not gamification metrics
- No grammar drilling, no streaks, no XP
```

---

## 11. Link Building (Early-Stage, Zero-Budget)

Don't chase backlinks early — focus on content first. But these are worth pursuing from month 1.

### Quick wins
- Submit to **Product Hunt** at launch — gets a .producthunt.com backlink and traffic spike
- List on **AlternativeTo.net** under Duolingo, Babbel, Anki alternatives
- Submit to **EdTech directories**: e-learning industry lists, language learning resource pages
- Reddit communities: r/Spanish, r/languagelearning — participate genuinely, not promotional

### Medium-term (months 2–4)
- Guest posts on language learning blogs (Fluent in 3 Months, Hacking Chinese model)
- "Frequency list" pages tend to attract natural links from teachers, Reddit posts, Quora answers — make them exceptionally good
- Partner with Spanish-learning YouTubers for mentions (not ads — genuine reviews)

### Content that earns links naturally
- **/vocabulary/most-common-spanish-words** — teachers, bloggers, and Reddit users link to good free frequency lists constantly
- **Data-driven blog posts** — "We analyzed 10M words of Spanish subtitles: here's what you actually need" — linkbait for language learning communities

---

## 12. Analytics & Tracking Setup (Day 1)

Set these up before launch, not after.

- [ ] **Google Search Console** — verify domain, submit sitemap
- [ ] **Google Analytics 4** — configure conversion events:
  - `email_signup` (waitlist CTA)
  - `page_view` (all pages)
  - `scroll_depth` (75% threshold on blog posts)
- [ ] **Core Web Vitals monitoring** — Google Search Console > Core Web Vitals report
- [ ] **Rank tracking** — free option: Google Search Console > Performance > Queries. Paid: Ahrefs / Semrush when budget allows.

### KPI targets

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Indexed pages | 10 | 30 | 60 | 100+ |
| Organic sessions / month | 100 | 1,000 | 5,000 | 20,000+ |
| Top 10 rankings | 0 | 3–5 | 10–20 | 30+ |
| Email signups from organic | — | 50 | 300 | 1,500+ |
| Core Web Vitals (LCP) | < 2.5s | < 2.5s | < 2.5s | < 2.5s |

---

## 13. What NOT to Build (SEO Debt to Avoid)

- **Don't create thin location pages** — no "Learn Spanish in [City]" pages. Not relevant to this product.
- **Don't keyword-stuff** — one primary keyword per page. Write for the reader first.
- **Don't launch 50 blog posts at once** — Google prefers steady publishing cadence over bulk uploads.
- **Don't use HowTo schema** — deprecated by Google since September 2023.
- **Don't block Googlebot on staging** — use a password-protected subdomain instead (`staging.yourdomain.com`), not `noindex` on the production domain.
- **Don't launch without Analytics** — you need Day 1 data to understand what's working.
