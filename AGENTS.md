# AGENTS.md

Guidance for AI agents working in this repo.

## Stack

Next.js 16 (App Router, static export via `output: "export"`), React 19, TypeScript, Tailwind CSS v4.

> **This is not the Next.js in your training data.** Version 16 has breaking changes to APIs,
> conventions and file structure. Read the relevant guide in `node_modules/next/dist/docs/`
> before writing or changing components, and heed deprecation notices.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
npm run check   # tests the search/filter logic against both catalogs
npm run lint
```

## Data

Two catalogs live in `data/skills.json` and `data/subagents.json`. They are validated at build
time (`lib/catalog.ts`): an unknown category, duplicate `id`, or malformed `url` fails `npm run build`.
Adding an entry means editing one JSON file — see `README.md`.
