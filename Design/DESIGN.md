# Neuro — Design Language

## Voice

Essence: "The app that respects your brain more than your screen time."
We are: honest · warm · scientifically grounded · direct · a little playful
We are not: gamified · cheerful · corporate · loud · Duolingo

Tone rules:
- Use plain language. No "amazing", "supercharge", or "unlock your potential".
- Celebrate milestones with facts, not confetti. ("You now cover 95% of spoken Spanish.")
- Streak copy uses loss aversion, not praise. ("Don't break it." not "You're on fire!")
- Error states are matter-of-fact. ("Wrong. Here's the word again.")
- Absurd example sentences are encouraged and celebrated. The science says they stick better.
- Headlines can be playful — short, punchy, broken across lines for typographic drama.


## Color

### Background palette (warm, never cold)

Cream:        #F2EDE4   — primary page background, hero, CTA sections
Cream Dark:   #E8E0D4   — alternate sections, trust bars, footer, anti-section
White Matter: #FAF7F2   — card backgrounds, flashcard back, raised surfaces

The background is always warm. Never use cool white (#F5F4FC or #FFFFFF).
Never use the cold purple-tinted backgrounds from earlier versions.

### Brand palette

Synapse:      #534AB7   — primary brand, CTAs, primary buttons, active states, inline accents
Deep Mind:    #1C1A3A   — flashcard front, dark section backgrounds, display type on light
Cortex:       #7B7FA8   — secondary text, labels, meta info, placeholders, muted UI
Fog:          #EAE8F5   — inactive states, card surfaces, pill backgrounds, progress track

### Accent palette

Mauve:        #B07FA8   — answer reveal, soft discovery, hint text, section deco shapes
Amber:        #EF9F27   — star shapes, inline illustration accents, warm energy
Dendrite:     #D4537E   — streak, urgency nudges, loss aversion UI, coral inline shapes
Nerve:        #C07050   — warm CTA variant, arrow accents, squiggle decorations
Signal:       #2D7A5F   — known word, easy recall, mastered state, smiley arc shapes

### Semantic usage

Known / Easy:    bg #E1F5EE  · text #085041  (Signal family)
Hard / Again:    bg #FAECE7  · text #712B13  (Coral family)
New word:        bg #FBEAF0  · text #72243E  (Pink family)
Neutral / UI:    bg #EAE8F5  · text #3C3489  (Synapse family)
Warning / Trap:  bg #FBEAF0  · border #D4537E  (used for "80% trap" callout)

### Rules

- Never use pure white (#FFFFFF) or pure black (#000000)
- Never use Duolingo green (#58CC02), iOS blue (#007AFF), or Spanish-flag red/yellow
- Flashcard front is always Deep Mind (#1C1A3A) — dark, focused, intentional
- Flashcard back is always White Matter (#FAF7F2) — the reveal should feel like warmth
- Streak / urgency UI uses Dendrite (#D4537E) only — never Synapse
- Inline illustration shapes use the full accent palette — each shape carries its own color


## Typography

### Typefaces

Display:  Fraunces 900  — headlines, flashcard word, section titles, hero type
          Google Fonts: family=Fraunces:opsz,wght@9..144,900
          No italic. Weight 900 only for display. Weight 700 for sub-headlines.

Body/UI:  Cabinet Grotesk 300/400/500  — all UI text, body copy, labels, buttons
          Google Fonts: family=Cabinet+Grotesk:wght@300;400;500

Never use Inter, Roboto, or system fonts. Never use italic anywhere in the product.

### Scale

Hero display:    Fraunces 900  · clamp(52px, 6.5vw, 86px)  · letter-spacing -2.5px  · line-height 1.0
Section title:   Fraunces 900  · clamp(36px, 4vw, 54px)    · letter-spacing -1.5px  · line-height 1.05
Card word:       Fraunces 900  · 52px                       · letter-spacing -2px    · line-height 1.0
Sub-headline:    Fraunces 700  · 17–22px                    · letter-spacing -0.3px
Proof / stat:    Fraunces 700  · 30px                       · letter-spacing -0.5px
Price amount:    Fraunces 900  · 38px                       · letter-spacing -1px

Body:            Cabinet Grotesk 300  · 17px  · line-height 1.65  · color Cortex
Body strong:     Cabinet Grotesk 500  · 17px  · color Deep Mind
Small:           Cabinet Grotesk 300  · 13px  · line-height 1.6   · color Cortex
Label:           Cabinet Grotesk 500  · 11px  · letter-spacing 0.08em  · UPPERCASE  · color Cortex/Synapse
Nav / UI:        Cabinet Grotesk 400  · 14px

### Rules

- No italic anywhere — ever. Weight and size create hierarchy, not slant.
- Display type (Fraunces 900) is reserved for headlines, flashcard words, and numbers only.
- Headlines stack across multiple lines for typographic drama — short lines, big type.
- Two Cabinet Grotesk weights in UI: 300 (body) and 500 (labels/buttons). 400 for nav/links.
- Letter-spacing on Fraunces must always be negative — the optical size needs tightening.
- Never center-align body text. Center only display headlines in CTA sections.


## Typographic illustration

The primary visual language of the brand. Oversized Fraunces headlines are punctuated
by small inline SVG shapes that sit between or beside words — replacing or accenting letters,
never decorating around them. Hand-drawn SVG squiggles and arrows float at edges.

### Inline shapes — usage by meaning

Crosshair circle (Synapse #534AB7 + Fog fill):
  Used with: numbers, precision, targeting ("The 3%", "95%")
  Construction: circle + 4 axis lines + 2 dashed diagonals · ~50px · stroke 1–1.5px

Star / burst (Amber #EF9F27, solid fill):
  Used with: frequency, importance, top-of-list ("of Spanish ★")
  Construction: 5-point path · ~44px · solid fill

Diamond / lens (Dendrite #D4537E, solid fill with opacity):
  Used with: coverage percentage, energy ("covers ◆ 95%")
  Construction: rotated ellipse + diamond path overlay · ~48px

Smiley arc (Signal #2D7A5F):
  Used with: positivity, success, mastery ("everything ☺")
  Construction: circle outline + curved path (smile) + two dots · ~40–42px · stroke 2px

Checkmark box (Mauve #B07FA8):
  Used with: correct steps, confirmed things ("In the right order ✓")
  Construction: rounded rect + checkmark path · ~34–36px · stroke 1–2px

X box (Dendrite #D4537E):
  Used with: negation, "what we don't do" ("No ✕ fake progress")
  Construction: rounded rect + X path · ~36px · stroke 1–2px

Outline diamond (Amber):
  Used with: CTAs, collection, aspirational ("words that ◇ matter")
  Construction: 5-point path outline only · ~42px · stroke 1.5px

### Squiggle accents

Free-floating SVG paths scattered at section edges and corners.
Always thin (stroke 1–1.5px). Never fill. 3–4 per hero/CTA section, 0 in content sections.

Colors used for squiggles: Synapse, Mauve, Nerve (terracotta), Signal — never Dendrite or Amber.

Types:
  Wave:    smooth S-curve, ~80–90px wide  — used horizontally near headline top
  Circle:  dashed circle outline           — used at top-right or bottom-left corners
  Curl:    tight loop ending in arrow tip  — used near CTA buttons pointing inward
  Blob:    irregular polygon outline       — used near proof stats

Squiggle placement rules:
  - Hero section: 3–4 squiggles, distributed top-right / bottom-left quadrants
  - CTA section: 3 squiggles, flanking the headline
  - Content sections (science, how, coverage): no squiggles — keep calm and readable
  - Never overlap with text or card components


## Spacing

Base unit: 4px

Scale:
  4px   — icon-to-label gap, internal badge padding
  8px   — tight component gaps, inline element spacing
  10px  — gap between side-by-side stat cards
  12px  — default gap between related elements
  14px  — finding card gap
  16px  — card internal padding (standard)
  18px  — card internal padding (stat cards)
  24px  — between components, large card padding
  32px  — between card groups
  48px  — section title to body gap
  56px  — nav padding (horizontal)
  96px  — section vertical padding (top/bottom)
  120px — hero/CTA section top padding
  140px — hero top padding (accounts for fixed nav)


## Border radius

  5px   — streak day boxes
  7px   — answer buttons (Again / Hard / Good / Easy)
  8px   — primary buttons, inputs, nav CTA
  10px  — hero primary CTA button
  12px  — callout blocks
  14px  — finding cards, pricing cards, stat cards
  16px  — anti-grid container, steps grid
  18px  — flashcard container
  99px  — trust pills, "Most sensible" badge, pill CTAs
  50%   — avatar, circular progress rings


## Borders & elevation

No drop shadows on any component except the flashcard hero mock.
Flashcard hero: box-shadow 0 24px 64px rgba(28,26,58,0.16), 0 4px 16px rgba(28,26,58,0.08)

All component borders: 0.5px solid — creates structure without heaviness.

Border tokens:
  Default:   0.5px solid rgba(28,26,58,0.08)   — card edges on white-matter bg
  Warm:      0.5px solid rgba(28,26,58,0.10)    — card edges on cream bg
  Emphasis:  0.5px solid rgba(28,26,58,0.15)    — trust pills, hovered states
  Active:    2px solid #534AB7                  — featured pricing card (only exception)
  Section:   0.5px solid rgba(28,26,58,0.08)    — trust bar top/bottom borders

Never use 1px borders anywhere. The 0.5px weight is load-bearing to the light aesthetic.


## Components

### Flashcard (hero mock)

Front (Deep Mind bg #1C1A3A):
  - Meta row: word-tag (Cortex, 11px, uppercase, 0.07em tracking) + word number (Cortex 45% opacity)
  - Word: Fraunces 900, 52px, White Matter, letter-spacing -2px
  - Phonetics: Cabinet Grotesk 300, 14px, Cortex

Back (White Matter bg #FAF7F2):
  - Translation: Fraunces 500, 19px, Mauve, letter-spacing -0.3px
  - Example sentence: Cabinet Grotesk 300, 13px, Cortex, left-border 2px Cream Dark
  - Answer row: 4 buttons in grid, 7px radius

Answer button states:
  Again:  bg #FAECE7  · text #712B13
  Hard:   bg Fog      · text Synapse
  Good:   bg Fog      · text Synapse
  Easy:   bg #E1F5EE  · text #085041

### Coverage meter

- Value: Fraunces 700, 30px, Deep Mind, letter-spacing -0.5px
- Label: Cabinet Grotesk 300, 12px, Cortex ("of spoken Spanish")
- Progress bar: 5px height · Synapse fill · Cream Dark track · 99px radius
- Milestone markers at 80% / 95% / 98% — always visible in the app
- Active milestone (95%): left border 2.5px Synapse + subtle Synapse background tint

### Streak tracker

- Count: Fraunces 700, 30px, Dendrite (#D4537E)
- Copy: "Don't break it." — never "You're doing great!" or "Keep going!"
- 7-day grid: 24×24px boxes, 5px radius
  Done = Signal light bg + Signal text + ✓
  Today = Synapse bg + White Matter text
  Future = Cream Dark bg + Cortex text
- Progress bar below: Dendrite fill (urgency framing)

### Buttons

Primary:   Deep Mind bg (#1C1A3A) · White Matter text · 10px radius · 13px 26px padding
           Hover: Synapse bg · translateY(-1px)
           Font: Cabinet Grotesk 500, 15px

Ghost:     No bg, no border · Cortex text · inline-flex with → arrow
           Hover: Deep Mind text
           Font: Cabinet Grotesk 400, 15px

Nav CTA:   Deep Mind bg · White Matter text · 8px radius · 9px 20px padding
           Hover: Synapse bg
           Font: Cabinet Grotesk 500, 14px

### Finding cards (science section)

bg: White Matter · border: 0.5px rgba(28,26,58,0.08) · radius 14px · padding 26px 24px 22px
Hover: border-color rgba(83,74,183,0.28) + translateY(-3px)

Stat number: Fraunces 900, 44px, letter-spacing -1.5px — color varies by meaning:
  80% / coverage = Synapse
  4.2× / streaks = Mauve
  9% / gamification = Nerve (terracotta)
  100% / generation = Signal
  8h / sleep = Dendrite
  50% / zipf = purple-mid (#7F77DD)

Label: Cabinet Grotesk 500, 15px, Deep Mind
Body: Cabinet Grotesk 300, 13px, Cortex, line-height 1.6
Source: Cabinet Grotesk 400, 11px, Cortex 50% opacity

### Steps (how it works — dark section)

Container: Deep Mind bg · steps grid with 2px gap · 16px radius · 0.5px rgba(255,255,255,0.07) border
Individual step bg: rgba(28,26,58,0.5) · hover: rgba(83,74,183,0.15)
Step number: Cabinet Grotesk 500, 11px, 0.1em tracking, Cortex
Shape: 30×30px SVG illustration — color matches step theme
Title: Fraunces 700, 17px, White Matter, letter-spacing -0.3px
Body: Cabinet Grotesk 300, 13px, Cortex, line-height 1.6

Step shapes (SVG, 30×30px):
  01 Frequency-first: 5-point star · Mauve fill, 80% opacity
  02 Retrieve:        concentric circles · Synapse stroke + fill
  03 Spaced rep:      nested wave curves · Nerve stroke
  04 Sleep:           leaf/flame path + dashed center line · Signal stroke

### Pricing cards

Standard: White Matter bg · 0.5px warm border · 14px radius · 26px 22px padding
Featured: Deep Mind bg · 2px Synapse border · 14px radius · "Most sensible" badge (Synapse pill, 99px)

Tier label: Cabinet Grotesk 500, 11px, 0.08em tracking, UPPERCASE, Cortex (Mauve on featured)
Amount: Fraunces 900, 38px, Deep Mind (White Matter on featured), letter-spacing -1px
Period: Cabinet Grotesk 400, 13px, Cortex
Description: Cabinet Grotesk 300, 13px, Cortex, line-height 1.6

### Anti-feature grid (philosophy section)

Two-column grid, 2px gap, 16px radius, 0.5px rgba(28,26,58,0.1) border

Left (what we don't do): White Matter bg
Right (what we do):      Deep Mind bg

List items: Cabinet Grotesk 300, 15px, line-height 1.5
Mark icon: 18×18px box, 4px radius
  ✕ marks: Cream Dark bg · Cortex 45% opacity text
  ✓ marks: rgba(83,74,183,0.2) bg · Mauve text


## Navigation

Fixed, backdrop-blur(16px), rgba(242,237,228,0.9) background — always warm cream tint.
Logo: Fraunces 700, 22px, letter-spacing -0.5px · dot accent in Synapse
Links: Cabinet Grotesk 400, 14px, Cortex · hover Deep Mind
CTA: Deep Mind bg button, 8px radius · hover Synapse

Padding: 18px 56px (desktop) · 16px 24px (mobile, links hidden except CTA)


## Layout & sections

Section vertical padding: 96px top/bottom (desktop) · 72px (mobile)
Section horizontal padding: 56px (desktop) · 24px (mobile)

Hero: two-column grid (1fr 440px), 60px gap, 140px top padding
Trust bar: full-width, Cream Dark bg, flex-row pills
Science: single column, Cream bg
How it works: single column, Deep Mind bg (the dark break)
Coverage: two-column grid (1fr 1fr), 96px gap, White Matter bg
Philosophy/Pricing: single column, Cream Dark bg
CTA: centered, Cream bg
Footer: flex-row space-between, Cream Dark bg, 26px 56px padding

Section background rotation:
  Hero → Cream
  Trust bar → Cream Dark
  Science → Cream
  How → Deep Mind (dark)
  Coverage → White Matter
  Philosophy → Cream Dark
  CTA → Cream
  Footer → Cream Dark

This alternation creates rhythm without relying on color for meaning.


## Icons

Library: Tabler Icons (outline only — never filled variants)

Core set:
  ti-brain     — app icon, review session header
  ti-flame     — streak tracker
  ti-check     — known / easy recall
  ti-x         — unknown / hard / again
  ti-clock     — review due, time-based nudges
  ti-chart-bar — coverage meter, progress screen
  ti-moon      — bedtime mode reminder
  ti-refresh   — retry / review again
  ti-volume    — audio pronunciation (v2)
  ti-star      — hard word bookmark
  ti-book      — word list, frequency list
  ti-settings  — settings screen

Sizing:
  16px — inline with text (label-level)
  20px — standalone in cards and list items
  24px — hero/decorative (streak flame only)

Icons are supplementary. Inline SVG shapes (see Typographic illustration) are the primary
visual language. Icons handle functional UI; shapes handle brand expression.


## Motion

Principle: motion should feel like thought, not entertainment.

Landing page:
  Staggered fadeUp on hero elements — opacity 0→1, translateY 24px→0
  Delays: title 0.05s · subtitle 0.15s · actions 0.25s · proof 0.35s · visual 0.15s
  Duration: 0.7–0.8s · easing: ease

Hero visual: continuous float animation — translateY 0→-10px→0, 7s, ease-in-out, infinite

App (flashcard):
  One animation only: front → back reveal
  Duration: 200ms · easing: ease-in-out
  Type: opacity fade or Y-axis flip — no bounce, no spring

Finding cards: translateY(-3px) on hover, border-color transition — 0.2s each

All other state changes: instant or 100ms opacity only.
No loading spinners — skeleton states in Fog color.
No celebration animations (confetti, fireworks).
Milestones acknowledged in text, never with movement.


## Token naming convention

Internal tokens follow the neural/brain metaphor established by the brain illustration:

  --synapse      #534AB7   primary purple brand
  --deep-mind    #1C1A3A   dark navy
  --cortex       #7B7FA8   muted blue-gray
  --fog          #EAE8F5   light purple surface
  --cream        #F2EDE4   warm page background
  --cream-dark   #E8E0D4   alternate warm surface
  --white-matter #FAF7F2   warm near-white
  --mauve        #B07FA8   dusty rose accent
  --dendrite     #D4537E   pink-red urgency
  --nerve        #C07050   terracotta warm
  --signal       #2D7A5F   teal-green success
  --signal-light #E1F5EE   signal surface
  --amber        #EF9F27   gold star accent
  --purple-mid   #7F77DD   mid-range purple
  --purple-dark  #3C3489   dark purple text


## References

Admire:  Anki (retention-first philosophy) · Linear (calm, dense, respectful UI)
         Readwise (serious tools for serious readers) · Studio Dumbar / design-forward type use
Mood:    warm · cerebral · confident · a little playful · not trying too hard
Fonts:   Fraunces for character · Cabinet Grotesk for clarity
Images:  reference poster design with oversized type, inline shapes replacing letters,
         hand-drawn squiggle accents, warm off-white backgrounds

Avoid:
  Duolingo  — gamified, childish, green, reward-obsessed
  Babbel    — corporate, cold, course-based
  Generic SaaS blue — #007AFF or similar iOS defaults
  Pure white or cold white backgrounds
  Italic type anywhere
  Gradient backgrounds or mesh effects
  Drop shadows on UI cards (flashcard hero mock is the only exception)
  Confetti, stars, or celebration animations


## What this app does not do

- No badges, trophies, XP, or leaderboards — ever
- No leaderboards or social competition
- No social features in v1
- No celebratory animations when sessions complete
- No push notification copy that praises — only loss aversion ("Don't break it.")
- No pure white, pure black, or cold purple-white backgrounds
- No italic type anywhere in the product
- No more than two typefaces (Fraunces + Cabinet Grotesk)
- No gradients, shadows, or decorative effects beyond the defined squiggle system
