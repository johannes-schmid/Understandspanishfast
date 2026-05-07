---
name: Vibrant Minimalism
colors:
  surface: '#f4faff'
  surface-dim: '#ccdce7'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e7f6ff'
  surface-container: '#e0f0fb'
  surface-container-high: '#daebf5'
  surface-container-highest: '#d5e5ef'
  on-surface: '#0e1d25'
  on-surface-variant: '#564334'
  inverse-surface: '#23323a'
  inverse-on-surface: '#e3f3fd'
  outline: '#897362'
  outline-variant: '#ddc1ae'
  surface-tint: '#904d00'
  primary: '#904d00'
  on-primary: '#ffffff'
  primary-container: '#ff8c00'
  on-primary-container: '#623200'
  inverse-primary: '#ffb77d'
  secondary: '#2d6482'
  on-secondary: '#ffffff'
  secondary-container: '#a7dbfe'
  on-secondary-container: '#29617f'
  tertiary: '#44664b'
  on-tertiary: '#ffffff'
  tertiary-container: '#8eb393'
  on-tertiary-container: '#24462d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#99cdf0'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#0a4c69'
  tertiary-fixed: '#c5ecca'
  tertiary-fixed-dim: '#aad0af'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#2c4e35'
  background: '#f4faff'
  on-background: '#0e1d25'
  surface-variant: '#d5e5ef'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  button:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered to evoke a sense of calm, clarity, and gentle encouragement. It balances a professional, high-utility structure with a playful, empathetic personality. The emotional response should be one of "digital breathing room"—reducing cognitive load through generous whitespace and soft visual transitions.

The style is defined as **Vibrant Minimalism**. It strips away unnecessary decorative elements but retains warmth through a curated palette and organic shapes. By combining the cleanliness of modern minimalism with the charm of rounded geometry, the design system creates an approachable environment that feels human rather than institutional. It is specifically tailored for wellness, education, and lifestyle platforms where user focus and emotional well-being are paramount.

## Colors

The palette is grounded in a warm, "Golden Hour" primary orange that acts as a beacon for action and energy. This is balanced by a suite of soft pastels used for environmental surfaces to prevent visual fatigue.

- **Primary (Friendly Orange):** Used for primary calls-to-action, progress indicators, and key brand moments.
- **Secondary (Pale Blue):** A serene blue used for secondary information, selection states, or tranquil background sections.
- **Tertiary (Soft Sage):** A natural green used for success states and grounding elements.
- **Background (Cream):** The default surface color, replacing pure white to reduce eye strain and add warmth.
- **Text (Dark Slate):** A high-contrast, deep slate used for all typography to ensure WCAG AA readability without the harshness of pure black.

## Typography

This design system utilizes **Lexend** across all levels. Chosen for its specific design intent to reduce visual stress and improve reading proficiency, Lexend’s expanded character spacing and rounded terminals perfectly align with the friendly brand voice.

Headlines should use tighter tracking and heavier weights to feel impactful yet soft. Body copy prioritizes legibility with a generous line height (1.6) to ensure the "breathable" feel extends to text-heavy content. Uppercase styling should be reserved exclusively for small labels or overlines to maintain a conversational, non-aggressive tone.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop (centered 12-column) and a fluid model for mobile. A strict 8px base unit drives the spacing rhythm. 

To achieve the "breathable" experience, the design system mandates significantly larger section padding (Level LG and XL) than traditional corporate systems. Content should never feel cramped; if in doubt, increase the vertical whitespace. Elements are grouped using logical proximity, with generous gutters (24px) to ensure a clear distinction between interactive zones.

## Elevation & Depth

Depth in this design system is achieved through **Ambient Shadows** and **Tonal Layering**. 

Shadows are never harsh or black; they are extra-diffused and tinted with a hint of the Dark Slate text color at very low opacities (5-10%). This creates a "soft lift" rather than a sharp drop.

1.  **Level 0 (Base):** Cream background.
2.  **Level 1 (Cards):** Pure white surfaces with a subtle ambient shadow to differentiate from the cream base.
3.  **Level 2 (Active/Floating):** Higher blur radius shadows for elements like modals or floating action buttons.

Avoid using heavy inner shadows or gradients; keep surfaces flat and matte to maintain the minimalist aesthetic.

## Shapes

The shape language is defined by **Pill-shaped (Level 3)** geometry. This is the primary differentiator of the design system, removing all sharp corners to create a safe and friendly environment.

- **Buttons:** Always fully rounded (pill-shaped).
- **Cards:** Large 2rem (32px) corner radii.
- **Input Fields:** 1rem (16px) corner radii to balance utility and style.
- **Icons:** Contained within circular or soft-square frames with heavy rounding.

The use of "squircle" mathematics is encouraged for container shapes to ensure smooth transitions between curves and straights.

## Components

### Buttons
Primary buttons use the Friendly Orange with white text. They feature a subtle "squish" animation (scale 0.98) on click. Secondary buttons use a thick 2px outline or a soft pastel background.

### Cards
Cards are the primary container. They should use a pure white background against the cream page surface, featuring 32px padding and 32px border radii. Shadows should be nearly imperceptible, providing just enough depth to separate the card from the background.

### Chips & Tags
Pill-shaped elements with soft pastel fills (Pale Blue or Sage) and dark slate text. These are used for categorization and filters.

### Input Fields
Inputs should feel tactile. Use a 1rem border radius and a subtle 2px border that shifts from a light grey to Friendly Orange upon focus. Avoid "ghost" inputs; fields should always have a visible, soft-colored surface.

### Illustrations & Icons
Icons should use "broken" lines or rounded endpoints. Illustrations should be minimalist—using simple geometric shapes to build charming characters or metaphors, primarily utilizing the secondary and tertiary pastel palette.

### Progress Bars
Thick, rounded tracks with the Friendly Orange fill. The track background should be a very desaturated version of the orange or a light cream.