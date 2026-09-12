---
name: website-content
description: Explains how static content modules (lib/aboutContent.js and similar) are organized, where placeholders/TODOs live, and when to move content to the backend API versus keeping it static. Use when editing copy, officers/partners/announcements data, or deciding whether new content needs a database model — trigger terms: aboutContent, placeholder, TODO, officers, partners, announcements, static content, CMS.
---

# Website Content Strategy

Most non-blog content on this site is **hardcoded in components or small `lib/`
modules**, not fetched from the API. Only blog posts are backend-driven today.

## Where static content lives

- `lib/aboutContent.js` — `ABOUT_PARAGRAPH`, `MISSION_VISION` array. Plain
  exported constants, imported directly into components
  (`components/AboutSection.jsx`).
- Inline arrays inside components, e.g.:
  - `components/PartnersSection.jsx` → `PARTNER_COUNT` (just a count, no data yet)
  - `components/about/OfficersSection.jsx` → `OFFICERS` (title, featured flag)
  - similar patterns likely in `AdvisersSection.jsx`, `ExecutivesSection.jsx`,
    `CommitteesSection.jsx` — check each file for its local data array before
    adding a new one elsewhere.
  - `components/AnnouncementCarousel.jsx` is **not** static on main — it
    fetches `/api/blogs` and renders the newest 3 posts (see "Backend-driven"
    below; PR #34 points it at a dedicated `/api/announcements`).

## Backend-driven content (the exception)

Only `Blog` (`server/models/Blog.js`, `server/routes/blogs.js`) is a real DB
model with CRUD + an admin UI (`app/admin/**`). Frontend consumes it via
`lib/api.js` (`api.get("/api/blogs")` etc., see `app/blog/page.js`).

## Deciding: keep static vs. move to API

Move content to the backend (new Mongoose model + routes + admin UI, following
the `Blog` pattern) when it needs **any** of:

- Frequent updates by non-developers (officers change every term, event
  announcements are time-sensitive)
- Images/media that aren't already committed as static assets
- More than a handful of items that would bloat a component file
- An admin-editable workflow already implied by the surrounding UI (e.g.
  `AnnouncementCarousel`'s and `PartnersSection`'s TODO comments explicitly say
  "once the API is live" / "from the backend")

Keep it static (a `lib/*.js` constant or inline array) when:

- It's truly fixed copy (mission/vision statements, legal text, nav labels)
- It changes only via a code review / PR, which is acceptable for that content
- There's no admin UI planned for it

## Working with existing placeholders

Search for `TODO` comments before writing new content modules — several
sections already declare their intended fetch source:

```bash
grep -rn "TODO" components/ app/
```

If a task asks you to "fill in real officers/partners", and no backend model
exists yet, prefer **one of these two paths** explicitly (don't half-do both):

1. **Static fill-in**: replace placeholder arrays with real names/roles/photo
   paths under `public/` or `assets/`. Fastest, fine for content that changes
   ~once a term.
2. **Backend-ize**: add a Mongoose model + routes mirroring `Blog`
   (see `website-backend`), then fetch client-side like `app/blog/page.js`
   does. Only do this if asked or if the content will need frequent
   non-developer edits.

Never invent real people's names, photos, or partner logos — use clearly
labeled placeholders (`"TBD"`, gray placeholder box) until real data is
supplied, matching the existing placeholder convention (gray `bg-gray-200`
boxes, `bg-black border-4 border-green-400` avatar rings).

## Validate

After content changes, run:

```bash
pnpm lint
pnpm build
```
