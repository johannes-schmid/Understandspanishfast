# CLAUDE.md

## Dev Server

```
PATH="/opt/homebrew/bin:$PATH" npm run dev
```

Runs Next.js dev server at `http://localhost:3000` (or 3001 if 3000 is taken). Hot reload is built-in.

---

## Visual Verification with Puppeteer

Puppeteer is installed as a dev dependency. Use it to screenshot pages and verify UI changes before reporting done.

```js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/tmp/screenshot.png', fullPage: false });
  await browser.close();
})();
```

Run with: `PATH="/opt/homebrew/bin:$PATH" node -e "<script above>"`

Then read `/tmp/screenshot.png` to inspect the result visually.

---

## Directory Map

| Path | What lives there |
|------|-----------------|
| `app/` | Next.js App Router pages (page.jsx per route) |
| `components/` | Shared components (Navbar, Footer, WaitlistForm, BlogPost, LevelTestClient, WordsPageClient) |
| `data/words.js` | High-frequency Spanish word list data |
| `workflows/` | Vercel Workflow (WDK) definitions — `buildPack.js` is the DurableAgent that builds AI vocab packs |
| `lib/packTools.js` | The agent's `"use step"` tool bodies (fetch/extract/search/download/analyze/define/save) |
| `lib/corpus.js`, `lib/spanishText.js`, `lib/subdl.js`, `lib/packArtifacts.js`, `lib/packProgress.js` | Pack-builder support: corpus map, tokenizer, Subdl subtitle client (search + unzip .srt), inter-step artifact store, progress stream |
| `lib/activePack.js` | Resolves the user's active pack (`user_settings.active_pack_id`; null = default 1500 corpus) + computes its dashboard stats/study queue. Drives dashboard hero/ring/stats and `/study`. |
| `lib/packLimit.js` | Free-pack gate: free accounts get 1 AI pack; the €5 `user_settings.unlocked` flag lifts it. |
| `app/api/packs/curation/[buildId]/`, `app/api/packs/save/`, `app/api/user/active-pack/` | Curation payload fetch; save selected words (sets new pack active); switch active pack |
| `components/PackBuilderClient.jsx` | 4-state builder: source → building animation → review/curate (tap words) → done/confetti |
| `components/DashboardPackSwitcher.jsx`, `components/PackPaywallModal.jsx` | Dashboard "Now studying" active-pack card; €5 paywall shown when the free pack is used |
| `app/packs/` | Packs UI — list, `new` (builder), `[id]` (study a pack) |
| `public/` | Static assets (robots.txt, sitemap, llms.txt, OG images, icons) |
| `words/` | Legacy static HTML word pages |
| `Design/` | Design references and mockups |
| `SEO-STRATEGY.md` | Full SEO keyword and content strategy |
| `SITE-STRUCTURE.md` | URL structure and page hierarchy plan |
| `SEO/Keywords.csv` | Master keyword list with volume/difficulty data |
| `SEO/used-keywords.md` | Primary keywords already used in blog posts (never reuse) |
| `SEO/humour.md` | Brand humour style guide for blog writing |
| `SEO/voice.md` | Brand voice/tone guide for blog writing |
| `SEO/opinions.md` | Opinionated takes to weave into blog posts |
| `SEO/stats.md` | Key stats and data points to reference in posts |
| `SEO/stories.md` | Personal anecdotes and stories to draw from |

---

## Blog Post Creation Standard

Follow this exact process every time a new blog post is created.

### Step 1 — Keyword Selection
- Open `SEO/Keywords.csv` and pick one primary keyword (not in `SEO/used-keywords.md`)
- **Filters:** keyword difficulty ≤30, search volume ≥100, informational intent only (not transactional/navigational)
- Pick 4–5 secondary keywords that form a coherent cluster (from CSV or invent related ones)
- After writing the post, add the primary keyword to `SEO/used-keywords.md` — never use it again

### Step 2 — SERP Research (do before writing)
- Search Google for the primary keyword
- Open and analyze the top 3 ranking pages
- Record: their format (listicle, guide, tutorial, comparison), word count, and topics covered
- The post must match their format and be within 10% of their average word count

### Step 3 — Content Requirements
- Cover every topic the top 3 results all discuss
- Add 1–2 extra topics they missed (differentiation)
- Answer the main question directly at the top (optimizes for featured snippet / AI Overview)
- Include an FAQ section using questions from "People Also Ask" on the SERP

### Step 4 — Voice & Style
Apply all four style files before writing:
- `SEO/voice.md` — tone, sentence structure, reading level
- `SEO/humour.md` — when and how to be funny
- `SEO/opinions.md` — opinionated angles to include
- `SEO/stats.md` — relevant stats to weave in
- `SEO/stories.md` — relevant stories or anecdotes to open with or reference

### Step 5 — Images
- Use the Pexels API to find relevant images for the post
- Place one image above each H2 section where it adds value
- Use descriptive, keyword-relevant alt text on every image

### Step 6 — SEO Non-Negotiables
Every blog post file must include:
- `<title>` with primary keyword near the front
- `<meta description>` (~155 chars, includes primary keyword)
- Canonical URL
- Open Graph tags (title, description, image)
- `Article` or `BlogPosting` JSON-LD schema with `datePublished` and `dateModified`
- At least one internal link to a related page on the site

### Step 7 — File & Route
- Create the post at `app/blog/[slug]/page.jsx` using the Next.js App Router
- Export `generateMetadata()` for all meta/OG tags (server component — no `'use client'`)
- Split into server wrapper + client component if interactivity is needed

---

## SEO Master Checklist

A structured status tracker for all SEO work on this project, derived from the masterclass framework. Update checkboxes as items are completed.

### Keyword Research Rules
Every keyword used must pass all three filters before being written about:
- Keyword difficulty ≤30 (realistic chance to rank)
- Search volume ≥100/month (enough traffic to matter)
- Informational intent (how/what/why queries — not buy/hire/find)
- Build a cluster: 1 root keyword + 4–5 secondary keywords per post

### On-Page SEO Checklist (apply to every blog post)
Claude must verify each item before declaring a post done:
- [ ] Primary keyword appears in the first 100 words
- [ ] Exactly one H1 on the page
- [ ] H2s used for each major section
- [ ] 4–8 FAQ questions sourced from "People Also Ask" on the SERP
- [ ] 2–3 internal links to related posts on this site
- [ ] 2–3 external links to authoritative sources
- [ ] Meta title ≤60 chars, primary keyword near the front
- [ ] Meta description ~155 chars, includes primary keyword
- [ ] Every image has descriptive, keyword-relevant alt text
- [ ] `BlogPosting` JSON-LD schema with `datePublished` + `dateModified`
- [ ] Canonical URL set
- [ ] Open Graph tags (title, description, image)

### Technical SEO Status
- [x] Next.js App Router — pages pre-rendered as static HTML
- [x] `public/sitemap.xml` — updated 2026-06-04, covers all 13 blog posts + all landing pages
- [x] `public/robots.txt` in place
- [x] `public/llms.txt` for AI crawler access
- [x] Google Analytics wired up
- [x] `/spanish-vocabulary-app` landing page created (primary keyword: "spanish vocabulary app", WebApplication + FAQPage schema)
- [x] Google Search Console verified
- [ ] **TODO** — Submit updated `sitemap.xml` to Google Search Console (sitemap was updated 2026-06-04 — resubmit)
- [ ] **TODO** — Run Google Lighthouse audit; target 90+ on all 4 categories (Performance, Accessibility, Best Practices, SEO). Paste the full report into Claude and iterate until fixed.

### Content Publishing Cadence
Do not publish all blog posts at once — sudden content spikes are a Google red flag.
- Week 1–2: 1 post/day max
- Week 3–4: 2 posts/day max
- Month 2+: 3 posts/day max
- Use GSC "Request Indexing" on each new URL after publish (limit: ~10/day)

### GSC Indexing Workflow (after every new page)
1. Go to Google Search Console
2. Paste the new page URL into the top search bar
3. Click "Request Indexing" — indexed within ~24h
4. Rate limit: ~10 requests/day

### Off-Page SEO (backlinks — do later)
Not a current priority. When ready:
- **Broken backlink swap**: audit a competitor in SEMrush → find their broken outbound links → offer your page as replacement
- **Guest posting**: search `[topic] "write for us"` on Google → pitch a post with a backlink
- **HARO / journalist queries**: answer expert questions; journalist includes your link in their article
- **Paid placements**: some authority domains accept sponsored posts with a backlink (~$100–$1000)
- **NEVER** use PBN services or bulk cheap backlinks — Google detects and permanently penalises

---

## Success / Failure Log

**What worked:**
- Packs redesign (2026-07-23): integrated the `Packs.dc.html` design. Split the pack builder from autonomous auto-save into **analyze → curate → save**: the agent's final tool is now `prepareCuration` (in `lib/packTools.js`), which stores a `curation` artifact (auto-selected words keyed by canonical **lemma** + an in-context token stream) and emits a `curate` progress event instead of saving. `PackBuilderClient` reads the stream, GETs `/api/packs/curation/[buildId]`, shows the tap-to-select review UI, then POSTs `/api/packs/save` (authoritative free-pack gate; sets the new pack active). Added the **active pack** concept: `user_settings.active_pack_id` (migration `006`), `lib/activePack.js` re-drives the dashboard hero/ring/stats and `/study` (custom active pack → redirects to `/packs/[id]`). Dashboard shows `DashboardPackSwitcher`; free-pack limit reuses the €5 `unlocked` flag via `lib/packLimit.js`. Design keyframes + `.dash-switcher{order:0}` + `.pack-curate-grid` responsive rule added to `globals.css`. Build: "16 steps, 1 workflow". **Requires migration `006_active_pack.sql` applied in Supabase before dashboard/packs/save work.**
- SEO growth pass (2026-07-23): built the `/words` frequency hub (`/words`, top-100, top-500, verbs, spanish-frequency-list) from `data/words.js` via a shared server component `components/WordListPage.jsx`; fixed the flagship words page (removed `display:none` cloaking, deduped conflicting JSON-LD, single H1); consolidated brand to "Most Common Spanish"; dynamic `app/sitemap.js` (replaces static file); real OG PNG; blog `RelatedPosts` cross-linking; email-gated PDF lead magnet (`app/api/lead-magnet` + `005_pdf_leads.sql` + `components/PdfDownloadForm.jsx`). Reconciled comprehension numbers to top-1,000 = ~74%, 1,500 = ~80%. Details in memory `project_seo_log.md`.
- Next.js App Router + Tailwind — clean migration from Vite/React Router
- Adding Privacy/Terms pages to fix GSC 404 errors
- Google Analytics via `next/script` with `strategy="afterInteractive"` in layout
- `jsconfig.json` with `@/*` path alias pointing to project root
- `postcss.config.cjs` (CJS extension required when `"type": "module"` is set in package.json)
- Node 20 via Homebrew (`/opt/homebrew/bin`) — system Node is v14 and won't work
- AI Vocab Packs (agentic): Vercel Workflow DevKit (`workflow` + `@workflow/ai` `DurableAgent`) + `unpdf`. `withWorkflow(nextConfig)` in `next.config.mjs`; WDK auto-generates `/.well-known/workflow/*` routes and reports "N steps, 1 workflow" on build. Agent = haiku loop over deterministic `"use step"` tools; definitions via one sonnet `Output.object` call. Tools return metadata + opaque refs only — raw text/candidates stashed in `pack_build_artifacts` (never sent to the LLM). Progress streamed on a `'progress'` WDK namespace as NDJSON, read by `PackBuilderClient`.

**What failed / watch out for:**
- WDK requires the DB migration `004_vocab_packs.sql` applied + a `pack-uploads` Storage bucket + `SUBDL_API_KEY` (subtitles via Subdl; download is a ZIP unzipped with `fflate`, free tier ~300 downloads/day per IP) before the pack builder works end-to-end.
- **DurableAgent model MUST be a serializable STRING id (gateway), never a provider SDK instance** — it crosses a `use step` boundary (`doStreamStep`), so an instance throws "Failed to serialize step arguments at path .args[1]". `AGENT_MODEL`/`AGENT_MODEL_STRONG` are now plain gateway strings (`anthropic/claude-haiku-4.5`), which means the **agentic sources (url/pdf/srt) require `AI_GATEWAY_API_KEY`** locally and on Vercel. **Topic packs bypass the agent** (deterministic `prepareTopicCurationStep` using `TOPIC_MODEL` = openai instance locally / gateway string in prod), so they work locally with just `OPENAI_API_KEY`.
- Never run `npm run build` while `npm run dev` is live — they share `.next` and the build clobbers the dev server (500s / vendor-chunks errors). Restart dev + `rm -rf .next` to recover.
- `/seed` (themed session) is merged into the pack builder's **Topic** tab and now redirects to `/packs/new?tab=topic`; it creates a saved pack via the curate→save flow instead of an ephemeral deck. `ThemedSeedClient.jsx` + `/api/ai/seed` are now unused by the app.
- Workflow steps run outside the request/cookie context — they MUST use the service-role client (`lib/supabase/admin.js`), never the cookie-based `createClient()`.
- `unpdf` build warning "Accessing import.meta directly is unsupported" is benign (bundled pdf.js); loaded via dynamic `import('unpdf')` inside the step.
- `next.config.mjs` gains a `turbopack` key from `withWorkflow` that Next 14 flags as "Unrecognized" — harmless warning.
- `metadata` export cannot be in a `'use client'` component — must split into server wrapper + client component
- `postcss.config.js` with ESM export breaks Next.js — rename to `.cjs` and use `module.exports`
- `src/pages/` directory gets picked up by Next.js as Pages Router — deleted old Vite source files entirely
- Run npm with `PATH="/opt/homebrew/bin:$PATH"` — system npm is broken (Node 14 compatibility issue)

---

## 🧠 Project Overview

This project is a prototype for a language learning product focused on one core outcome:

> Helping users achieve functional Spanish comprehension in the shortest time possible.

This is NOT a general language learning app.

It is a **focused system** that enables users to understand real-world Spanish using the most efficient path possible.


---

## 🎯 Core Value Proposition

Users should be able to:

- Understand ~80% of everyday Spanish
- After learning ~1500–2000 high-frequency words
- With clear progress toward real-world comprehension

The product is built around:

> “Learn the right words, in the right order, to unlock real understanding fast.”


---

## 👤 Target User

Primary user:

- English (or German) speakers learning Spanish
- Frustrated with slow progress
- Have tried apps but don’t feel they can understand real content
- Want practical results (understanding conversations, Netflix, reading)

User motivations:

- “I want to understand real Spanish as soon as possible”
- NOT: “I want to study vocabulary”

User frustrations:

- Learning words that are not useful
- Not knowing what to learn next
- Not knowing when they are “ready”
- Overcomplicated tools (e.g. manual flashcard systems)


---

## 🚫 What This Product Is NOT

Avoid building:

- A Duolingo-style gamified app
- A generic flashcard system
- A grammar-heavy learning system
- A streak-based motivation system
- A feature-heavy “all-in-one” platform

Avoid:

- XP points
- leaderboards
- unnecessary animations
- childish UI patterns

This product should feel:

- focused
- efficient
- intentional


---

## ✅ Core Principles

### 1. Outcome over activity
Everything should move the user toward:
→ understanding real Spanish

Not:
→ completing lessons or earning points


### 2. Frequency over completeness
We prioritize:

- most commonly used words
- real-world usage
- practical comprehension

Not:
- exhaustive vocabulary coverage


### 3. Clarity over cleverness
The product should always answer:

- What am I learning?
- Why does it matter?
- What can I understand now?


### 4. Reduce friction
No setup required.

Avoid:

- manual deck imports
- complex onboarding
- configuration steps


---

## 🧩 Core Features (Prototype Scope)

### Vocabulary System
- High-frequency Spanish words (ranked by usage)
- Focus on top ~1500–2000 words
- Words grouped by usefulness, not theme

### Context Layer
- Real example sentences
- Indication of where/how words are used
- Emphasis on spoken language

### Progress System
- Show % of comprehension
- Show what user can now understand:
  - conversations
  - shows
  - texts

### Motivation Layer
- Recommend:
  - what to watch (Netflix-style content)
  - what to read
- Show readiness milestones:
  - “You can now understand X% of Y”

---

## 🎨 UI / UX Guidelines

Design should feel:

- minimal
- clean
- fast
- distraction-free

Avoid:

- clutter
- gamified UI elements
- excessive colors

Prefer:

- strong typography
- clear hierarchy
- simple progress visualization

---

## ✍️ Copywriting Guidelines

Tone:

- direct
- confident
- outcome-focused

Avoid:

- “fun”
- “engaging”
- “interactive”
- generic edtech buzzwords

Use:

- specific promises
- measurable outcomes

Examples:

❌ Bad:
“Learn Spanish in a fun and engaging way”

✅ Good:
“Understand 80% of everyday Spanish with 1500 words”

---

## 🧪 Landing Page Goals

The landing page should:

1. Clearly communicate the outcome within 5 seconds
2. Differentiate from existing tools
3. Capture email signups (waitlist or early access)
4. Test willingness to pay

Primary CTA:

- “Get Early Access”
- “Join the Waitlist”

---

## 📁 Assets

Screenshots and visual references will be stored in:

`/assets`

These should be used to:

- guide UI generation
- maintain visual consistency
- inspire layout decisions

---

## 🔮 Future Vision (Not MVP)

Potential expansions:

- Personalized learning paths
- Content recommendations based on vocabulary level
- Multi-language support (German → Spanish, etc.)
- Deeper comprehension tracking

These should NOT be prioritized in the prototype.

---

## ⚠️ Key Constraint

This product must remain:

> A fast, focused system for reaching real-world comprehension.

If a feature does not directly contribute to this goal, it should not be included.

---

## 🛠️ Developer Workflow

After every finished change, Chrome automatically opens with the latest `index.html`.
This is wired via a `Stop` hook in `.claude/settings.json` — not AI behaviour, so it executes regardless of what Claude says.

---

## 🔍 SEO Strategy

Full plan in `SEO-STRATEGY.md` and `SITE-STRUCTURE.md`.

### Primary SEO Wedge

The #1 SEO priority is owning **"most common Spanish words"**, **"most frequent Spanish words"**, and the entire frequency/common-word keyword cluster.

**Why:** These searches are currently served by old, outdated, poorly designed pages. The opportunity to rank is high and the audience is a perfect match for the product.

All frequency/word pages live under `/words/`:
- `/words/most-common-spanish-words` — main beachhead
- `/words/most-frequent-spanish-words`
- `/words/top-100/500/1000/2000-spanish-words`
- `/words/spanish-frequency-list`
- `/words/most-common-spanish-verbs`
- `/words/most-common-spanish-phrases`

### What makes these pages beat the competition

Don't build a plain numbered list. Build a resource that:
- Shows comprehension coverage: "These 1000 words cover ~74% of spoken Spanish"
- Includes example sentences per word
- Is interactive (filter, mark as learned, show/hide translations)
- Cites sources (corpus data, frequency research)
- Is fast, mobile-first, and visually clean
- Has `dateModified` schema so Google shows it as fresh

### SEO Non-Negotiables (Day 1)

Every page must have: `<title>`, `<meta description>`, canonical URL, Open Graph tags, and the correct schema type. See `SEO-STRATEGY.md` for full checklists and schema templates.