# design-sync notes — UnderstandSpanishFast

## Repo shape

- This is a **Next.js application**, not a design-system library. There is no
  `dist/`, no Storybook, and `package.json` is `private: true`. The sync uses an
  explicit barrel entry at `.design-sync/entry.jsx` (passed via `--entry`) rather
  than a package `dist` entry. **Add a component to that barrel to sync it.**
- Scope is deliberately limited to presentational, standalone-renderable
  components. Deliberately excluded:
  - `FlashCard` — depends on PaywallModal, Supabase auth, audio maps, analytics.
  - `ArticleCard` — uses `next/link`, needs Next router context.
  - Everything else under `components/` that is a Server Component or does data
    fetching (Navbar, ReadingClient, dashboard clients, etc.).
  If one of these is ever wanted, it must first be decoupled from Next/Supabase.

## Build commands

Run npm with `PATH="/opt/homebrew/bin:$PATH"` — system Node is v14 and breaks.

```sh
# 1. compile the scoped Tailwind stylesheet (MUST run before package-build)
npx tailwindcss -c .design-sync/tailwind.ds.config.cjs \
  -i .design-sync/tw-input.css -o .design-sync/ds-styles.css --minify

# 2. build + validate
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./.design-sync/entry.jsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

## Gotchas discovered (2026-07-22)

- **CSS is the whole ballgame here.** The shadcn components are styled 100% via
  Tailwind utility classes. `app/globals.css` is Tailwind *source*, not compiled
  output — pointing `cssEntry` at it yields `[CSS_RUNTIME]` and every card renders
  unstyled. A dedicated Tailwind build (`tailwind.ds.config.cjs`) is required.
- **Do not reuse the repo's `tailwind.config.js` for the DS build.** It maps
  `primary` to a Material hex (`#904d00`), while the shadcn components expect the
  `--primary` CSS variables from `globals.css`. The DS config maps the semantic
  colours to `var(--*)` instead.
- **`aria-invalid` is not in Tailwind v3's default `aria-*` variant list.** Without
  `theme.extend.aria = { invalid: 'invalid="true"' }` the Input error state compiles
  to nothing and renders identically to a default input.
- **A safelist is mandatory, not an optimisation.** The stylesheet is JIT-compiled
  from only the 7 scoped component files, so any utility the design agent writes
  that no component happens to use would not exist in the shipped CSS and would
  silently do nothing. The `safelist` patterns in `tailwind.ds.config.cjs` are what
  make the vocabulary documented in `conventions.md` actually resolve. **If you
  extend the documented vocabulary, extend the safelist in the same commit.**
- **`@types/react` is not a repo dependency.** It is symlinked from the staged
  converter deps so `.d.ts` prop extraction works:
  `ln -sfn "$(pwd)/.ds-sync/node_modules/@types/react" node_modules/@types/react`
  Note `node_modules/@types` already exists as a real directory (d3 types) — link
  `react` *inside* it, do not replace the directory.
- **No playwright browser download needed.** The repo already has puppeteer's
  chromium cached. Install `playwright` with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`
  and point the render check at the cached binary:
  `export DS_CHROMIUM_PATH="$HOME/.cache/puppeteer/chrome-headless-shell/mac_arm-148.0.7778.97/chrome-headless-shell-mac-arm64/chrome-headless-shell"`
- **Tailwind v3 vs shadcn "base-nova" v4 syntax.** `components.json` uses the
  `base-nova` style, which emits some v4-only class syntax (`in-data-[…]`,
  `*:[img:first-child]`, bare `ring-3`). `ring-3`/`rounded-4xl` are patched via
  `theme.extend`; the remaining v4-only selectors do not compile under v3 and are
  cosmetic only — no card was affected.
- `package-capture.mjs --components <X>` **prunes the other components' review
  sheets**. Re-run it unscoped before grading a full set.
- `Chart` (`components/ui/chart.jsx`) is bundled transitively as a ProgressRing
  dependency but is not exported as its own component — it needs a `config` prop
  and has no meaningful standalone preview.

## Known render warns

None. Final run: `render check: 6/6 previews render cleanly`, validate exits 0 with
zero warnings.

## Re-sync risks

- **The Tailwind stylesheet is a separate build step and is easy to forget.** If a
  component gains new utility classes and step 1 above is not re-run, the classes
  will be missing from the shipped CSS and those cards will render partially
  unstyled — validate will NOT catch this (the render check only fails on an empty
  root). Always re-run the Tailwind build before `package-build.mjs`.
- The `DS_CHROMIUM_PATH` above pins a chromium build number
  (`mac_arm-148.0.7778.97`). If puppeteer updates, that path changes — re-check
  `ls ~/.cache/puppeteer/chrome-headless-shell/`.
- The barrel at `.design-sync/entry.jsx` is hand-maintained. Components added to
  `components/` will NOT appear in the sync until added there and to
  `componentSrcMap` + the Tailwind `content` list.
- `conventions.md` enumerates a class vocabulary that is only true while the
  safelist matches it. Re-validate the two against each other on any re-sync.
- Preview content (Spanish example sentences, word ranks like "rank #142") is
  illustrative, authored for the previews — it is not pulled from `data/words.js`
  and will not track changes there.
