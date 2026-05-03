---
name: Mindful System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#434655'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#4e5c8d'
  primary: '#4d5c8d'
  on-primary: '#ffffff'
  primary-container: '#6675a8'
  on-primary-container: '#000318'
  inverse-primary: '#b6c5fc'
  secondary: '#006a64'
  on-secondary: '#ffffff'
  secondary-container: '#97f3ea'
  on-secondary-container: '#00716a'
  tertiary: '#5e5e5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#777773'
  on-tertiary-container: '#040504'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b6c5fc'
  on-primary-fixed: '#051846'
  on-primary-fixed-variant: '#364574'
  secondary-fixed: '#97f3ea'
  secondary-fixed-dim: '#7bd6cd'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504b'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 20px
  gutter-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 48px
---

## Brand & Style

The design system is rooted in the philosophy of "Guided Clarity." It aims to reduce cognitive load by balancing friendly, approachable aesthetics with a high-functioning, systematic structure. The target audience seeks focus and calm; therefore, the UI must feel like a supportive companion rather than a complex tool.

The style is a blend of **Minimalism** and **Tactile** design. It utilizes heavy whitespace to allow content to breathe, while employing "squishy" high-radius components that feel safe and touch-friendly. The "system-like edge" is achieved through rigorous grid alignment and a disciplined use of its deep midnight navy primary, ensuring that the friendliness never compromises professional reliability.

## Colors

The color palette centers on a sophisticated Deep Midnight Navy (#0a1c4a) used for primary actions and brand presence. To maintain a mindful atmosphere, this is balanced against a secondary Soft Teal (#5EBAB2) used for supportive elements, progress indicators, and success states.

Surfaces are never pure white. This design system utilizes a Warm Off-White (#FBF9F4) for backgrounds to reduce eye strain and provide a "paper-like" tactility. Grays are kept soft and slightly blue-tinted to ensure they feel cohesive with the primary brand color, avoiding a sterile or "dead" aesthetic.

## Typography

The design system exclusively uses **Plus Jakarta Sans**. This typeface provides the necessary rounded terminals for a friendly appearance while maintaining the geometric precision required for a modern "edge."

- **Headlines:** Use Bold weights with slight negative letter spacing to create a modern, impactful presence.
- **Body Text:** Use Regular weights with generous line heights to ensure maximum legibility during long-form reading or guided exercises.
- **Labels:** Use Medium or Semi-Bold weights in smaller sizes for clear information hierarchy without overwhelming the page.

## Layout & Spacing

This design system follows a **mobile-first fluid grid**. The layout model utilizes a 4-column system for mobile devices with a 20px outer margin and 16px gutters.

The spacing rhythm is built on a 4px baseline unit. Vertical rhythm should be generous, favoring "Section Gaps" of 48px to clearly delineate different content areas. On mobile, components should typically span the full width of the 4 columns or split into 2-column "card" tiles to maintain touch-target accessibility.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. Instead of harsh drop shadows, this design system uses soft, diffused shadows with a slight tint of the deep midnight navy (#0a1c4a) at very low opacity (5-8%). This creates the illusion that elements are floating gently above the warm off-white surface.

Lower-level depth is achieved through subtle shifts in background color (e.g., placing a secondary card on a tertiary background) rather than heavy borders. Backdrop blurs should be reserved for global navigation bars or modal overlays to maintain a sense of environmental continuity.

## Shapes

The shape language is defined by extreme roundedness to evoke comfort. Most interactive components follow a **Pill-shaped** or high-radius convention. 

- **Primary Buttons:** Fully rounded (pill) to encourage interaction.
- **Cards & Containers:** Use a 24px - 32px radius (rounded-xl) to feel soft and non-threatening.
- **Inputs:** Use a 16px radius to balance the "system-like" structure with the overall friendly aesthetic.

## Components

### Buttons
Primary buttons are solid #0a1c4a with white text and a pill-shaped radius. They should have a subtle "lift" shadow. Secondary buttons use a tonal teal background or a simple outline to indicate lower hierarchy.

### Cards
Cards are the primary container for content. They use a white or light teal background with a 24px radius. Content inside cards should have a minimum of 20px padding to maintain the "mindful" whitespace.

### Input Fields
Inputs use a soft gray background with a 16px radius and no border in their default state. Upon focus, they gain a 2px solid deep midnight navy border and a soft glow.

### Chips
Used for filtering or tags, chips are small pill-shaped elements. Active states use the primary navy, while inactive states use a subtle gray or soft teal.

### Playful Iconography
Icons should have rounded caps and corners. Use a 2px stroke weight. Icons can be paired with soft-colored circular backgrounds to create "action tiles" that feel like buttons.

### Progress Indicators
Progress bars should be thick (8px+) with fully rounded ends, using the teal color to indicate growth and completion.