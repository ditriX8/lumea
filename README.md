# LUMÉA — Glow, powered by nature

Portfolio case study: a one-page site for a fictional crystal-infused skincare brand, built around a
"melting liquid glass" look. LUMÉA is not a real company; all names, copy and prices are invented.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Lucide Icons · @fontsource (Unbounded, Manrope).
No backend — forms validate on the client and persist to `localStorage`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
npm run lint
```

## Checks

With `npm run preview` running:

```bash
node scripts/e2e.mjs     # 38 scenario checks: menu, filter, modal, bag, routine builder, forms, overflow, console errors
node scripts/shots.mjs   # screenshots (1440×900 desktop, iPhone 13) into screenshots/
```

Both use `playwright-core` with the locally installed Chrome (`channel: 'chrome'`), so no browser download is needed.

## How it is built

- **Glass** (`src/lib/ui.tsx`, `src/index.css`): each panel is a tinted, blurred layer (`backdrop-filter`) with a light
  top edge. The melting bottom edge is a second blurred layer cut by an SVG mask; the drip path is generated from a
  seed in `dripPath()` (`src/lib/util.ts`), so every card melts differently. A matching SVG stroke draws the rim.
- **Reveal without losing blur**: the wrapper only moves (`transform`), while the leaf layers fade (`opacity`).
  `backdrop-filter` stops working inside an ancestor with `opacity < 1`, so the fade is never put on a parent.
- **Decor**: real photos (cut out, WebP) float with CSS keyframes and react to pointer and scroll through one shared
  `requestAnimationFrame` loop — transform only. Bubbles are pure CSS gradients.
- **Performance**: the first chunk contains only React, the header and the hero. Everything else (and Framer Motion)
  is a lazy chunk, and sections below the fold mount when they come within ~900px of the viewport. Anchor links mount
  all sections first so the scroll target is exact.
- **Accessibility**: semantic landmarks, labelled fields with inline errors, focus-trapped dialogs that close on Esc
  and backdrop click, visible focus rings, `prefers-reduced-motion` respected.

## Deploy (Vercel)

Vite is detected automatically — no configuration needed.

```bash
npx vercel --prod
```

Or push the folder to a Git repository and import it at https://vercel.com/new (framework preset: Vite).

## Photo credits

All photographs are from [Unsplash](https://unsplash.com) (Unsplash License), downloaded into `public/img`,
background-removed and converted to WebP. Source photo IDs are listed in `scripts/cutout.mjs` and `scripts/assets.mjs`.
Re-running `scripts/cutout.mjs` additionally needs `@imgly/background-removal` and `onnxruntime-web@1.21.0`
(not kept in `devDependencies`).
