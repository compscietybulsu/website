---
name: website-frontend
description: Guides Next.js App Router UI work for this website — page/component structure, Tailwind v4 conventions, and the existing green matrix/glassmorphism brand language. Use when editing files under app/ or components/ (Hero, Navbar, Footer, About*, Blog*, AnnouncementCarousel, PartnersSection, ui/*) — trigger terms: Next.js, App Router, Tailwind, component, Hero, Navbar, brand, UI, page.js.
---

# Website Frontend

Next.js 16 App Router, React 19, Tailwind CSS v4 (via `@tailwindcss/postcss`,
no `tailwind.config.js` theme in use — theming is CSS-first in `app/globals.css`).
Package manager is **pnpm**, not npm.

## Where things live

- `app/page.js` — home page, composes: `Navbar`, `Hero`, `AnnouncementCarousel`,
  `PartnersSection`, `AboutSection`, `Footer`.
- `app/about/page.js`, `app/blog/page.js`, `app/blog/[id]/page.js` — other public
  routes.
- `app/admin/**` — admin login (`app/admin/page.js`), dashboard, blog editor.
  Client components guarded by `components/admin/AdminGuard.jsx` (checks
  `lib/auth.js` token, redirects to `/admin` if absent — this is UX gating
  only, real authorization happens server-side via JWT).
- `components/*.jsx` — top-level sections (Navbar, Hero, Footer, AboutSection,
  AnnouncementCarousel, PartnersSection).
- `components/about/*`, `components/blog/*`, `components/admin/*` — page-scoped
  subcomponents.
- `components/ui/*` — shared primitives: `GradientPillButton`, `GridFloor`,
  `MatrixRain`, `Logo`.
- Path alias `@/*` → repo root (see `jsconfig.json`), e.g. `@/components/Navbar`,
  `@/lib/api`.

## Brand language — preserve unless SPEC says otherwise

The site's identity is a dark "green matrix" tech aesthetic. Concrete tokens
already in use, copy these rather than inventing new ones:

- **Background gradient** (page wrapper): `bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320]`
- **Base CSS vars** (`app/globals.css`): `--background: #020806`, `--foreground: #ffffff`,
  font is Poppins via `--font-poppins` / class `font-heading`.
- **Accent gradient** (CTAs): `bg-gradient-to-r from-blue-500 to-green-400` (buttons),
  `from-green-500 to-blue-500` (pill border wrapper, see `GradientPillButton.jsx`).
- **Card surfaces**: `bg-[#0d2818]` (dark green card), `bg-[#132e1c]` (featured
  card), `bg-green-950` (pill fill), `bg-[#1f6b3c]` (partners banner).
- **Text**: headings `font-heading font-extrabold text-white`; body copy on
  dark backgrounds `text-green-200/70` or `text-green-300/80`.
- **Shape language**: heavy use of `rounded-full` (nav pill, buttons, avatars)
  and `rounded-2xl`/`rounded-3xl` (cards). Nav bar is a floating pill:
  `rounded-full bg-black/40 backdrop-blur-md border border-green-800/40`.
- **Motion/atmosphere**: `MatrixRain` (canvas rain effect, green `#22c55e`
  glyphs) and `GridFloor` layered behind `Hero`. Don't remove these without an
  explicit design decision — they're the signature visual.

When adding new sections, match an existing sibling's class patterns (e.g. copy
`AboutSection.jsx`'s card treatment for a new "Events" section) instead of
introducing a new color palette or radius scale.

## Known placeholders (don't "fix" without a ticket, but you can wire them up)

Grep for `TODO` before assuming these are bugs:

- `components/AnnouncementCarousel.jsx` — fetches `/api/blogs` and renders the
  newest 3 posts as announcements (no hardcoded `CARDS` on main anymore). PR
  #34 replaces this with a dedicated `/api/announcements` endpoint.
- `components/PartnersSection.jsx` — gray circles, "replace... with real
  partner logos from the backend".
- `components/about/OfficersSection.jsx` and sibling About sections — gray
  photo placeholders, hardcoded titles.
- `components/AboutSection.jsx` — gray `aspect-[4/3]` placeholder for a real
  photo.
- **Navbar/Footer `Contact`** now anchors to `#site-footer` (the in-page footer
  Contact section) — a deliberate choice, not a broken `/contact` link. See
  `website-review`.

See `website-content` for the static-vs-API decision when replacing these.

## Conventions

- Components are `.jsx`, pages are `.js` (App Router `page.js`/`layout.js`).
- Client components start with `"use client";` only when they use hooks/browser
  APIs (state, effects, `localStorage`, canvas) — most content sections are
  server components by default; don't add `"use client"` unnecessarily.
- Icons: `lucide-react` for line icons, `react-icons/fa` for brand/social icons.
- Images: `next/image` with static imports from `assets/` (see `logo.png`
  usage in `Navbar`/`Footer`); use `<img>` with the eslint-disable comment
  only for dynamic/remote URLs (see `BlogCard.jsx` pattern for Cloudinary URLs).

## Validate

```bash
pnpm lint
pnpm build
```
