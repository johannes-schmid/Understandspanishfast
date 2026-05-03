# CLAUDE.md

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

### Local Server

Always spin up a local HTTP server before testing any pages. Use:

```
python3 -m http.server 8080 --directory "/Users/johannesschmid/Desktop/Development Project/UnderstandSpanishFast"
```

Then open pages at `http://localhost:8080/` (index) or `http://localhost:8080/words/most-common-spanish-words.html` etc.
This ensures root-relative links (e.g. `/words/`) resolve correctly — opening HTML files directly via `file://` breaks these links.

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