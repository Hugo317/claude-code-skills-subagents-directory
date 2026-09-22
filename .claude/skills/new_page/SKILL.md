---
name: new-page
description: Scaffold a new Next.js App Router page. Use when the user asks to create a new page, add a route, set up a new screen, or build out a section of the app.
argument-hint: [route-path]
---

# New Page

Create a new App Router page at the route the user names (e.g. `/dashboard` or `/blog/[slug]`).

## Steps

1. Create the route folder under `app/`, matching the route path. Use `[param]` folders for dynamic segments.
2. Add `page.tsx` as a default-exported React server component, named after the route in PascalCase.
3. Add a `loading.tsx` in the same folder with a simple loading fallback.
4. Use TypeScript. Do NOT add `'use client'` unless the page needs client-side interactivity.
5. Keep the first version minimal: a heading and a short placeholder. Don't invent data fetching the user didn't ask for.

## Conventions

- Match the styling already used in the project (Tailwind classes, CSS modules, etc.).
- Prefer server components; only reach for a client component when interactivity requires it.