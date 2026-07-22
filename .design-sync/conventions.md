# Understand Spanish Fast — UI conventions

This is the component set behind Understand Spanish Fast, a Spanish-comprehension
product. Components are shadcn/ui primitives (built on `@base-ui/react`) plus two
product-specific components. Styling is **Tailwind utility classes driven by CSS
custom properties** — there is no theme provider and no wrapper component.

## Setup

No provider is required. Components render correctly as long as `styles.css` is
loaded — it carries the CSS custom properties (`:root`) that every utility class
resolves against. Without it, components render unstyled with browser defaults.

```jsx
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '<ds>'

<Card>
  <CardHeader>
    <CardTitle>entender</CardTitle>
  </CardHeader>
  <CardContent>No entiendo lo que dices.</CardContent>
</Card>
```

## Styling idiom

Style with Tailwind utility classes that map to semantic CSS variables. Prefer the
semantic names below over raw colours — they are what the components themselves use.

| Family | Real class names in this system |
|---|---|
| Surface | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-secondary` |
| Text | `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `text-primary-foreground`, `text-secondary-foreground`, `text-destructive` |
| Action | `bg-primary`, `bg-secondary`, `text-destructive` |
| Border / focus | `border-input`, `border-border`, `ring-ring`, `border-destructive` |
| Radius | `rounded-lg`, `rounded-md`, `rounded-sm`, `rounded-xl`, `rounded-4xl`, `rounded-full` |

For your own layout glue, the standard Tailwind utilities are compiled and available:
spacing (`p-*`, `m-*`, `gap-*` on the 0–16 scale), `flex` / `grid` with
`flex-row|col|wrap`, `items-*` / `justify-*`, `w-full`, `h-full`, `max-w-*`,
`text-xs`…`text-4xl`, `font-medium|semibold|bold`, `shadow-*`, `opacity-*`,
`truncate`, `underline`, `uppercase`. Stay inside this set — utilities outside it
are not in the shipped stylesheet and will silently do nothing.

Brand tokens are available directly as CSS variables for product chrome — use
`var(--…)`, not a utility: `--synapse` (primary purple), `--deep-mind` (near-black
text), `--cortex`, `--fog`, `--cream`, `--cream-dark`, `--white-matter`, `--mauve`,
`--dendrite`, `--nerve`, `--signal` (green, "known"), `--signal-light`, `--amber`
("learning"), `--purple-mid`, `--purple-dark`.

The learning-status colour convention is load-bearing in this product: **green =
known, amber = learning, neutral = unseen**. Keep it consistent anywhere you show
vocabulary state.

## Components

- `Button` — `variant`: `default` | `secondary` | `outline` | `ghost` | `destructive` | `link`; `size`: `xs` | `sm` | `default` | `lg`.
- `Badge` — same `variant` set as Button. Used for word status and frequency bands.
- `Card` — compound: `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`. `size="sm"` tightens spacing. `CardAction` right-aligns into the header row.
- `Input` — standard input; set `aria-invalid="true"` for the error state (destructive border + ring).
- `WordToken` — product-specific. Props: `es`, `en`, `status` (`known` | `learning` | `unseen`). Renders an inline clickable Spanish word that reveals its English gloss. Compose inside running text, not standalone.
- `ProgressRing` — product-specific. Props: `learned`, `learning` (numbers, out of a 1,500-word total). Renders the comprehension ring with legend, stat row, and next-milestone copy.

## Where the truth lives

Read `styles.css` and its `@import` closure (including `_ds_bundle.css`) before
styling — that is the authoritative list of available utilities and tokens. Each
component's `<Name>.d.ts` is its API contract and `<Name>.prompt.md` its usage notes.

## Idiomatic example

```jsx
<Card style={{ maxWidth: 360 }}>
  <CardHeader>
    <CardTitle>entender</CardTitle>
    <CardDescription>to understand — verb, rank #142</CardDescription>
    <CardAction><Badge variant="secondary">Learning</Badge></CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">No entiendo lo que dices.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Got it</Button>
    <Button size="sm" variant="outline">Review later</Button>
  </CardFooter>
</Card>
```
