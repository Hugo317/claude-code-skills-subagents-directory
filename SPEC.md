# Agent Skills Repo — MVP Spec

**Status:** draft v0.1 · **Date:** 2026-09-08

An open source directory of publicly available **Agent Skills** for Claude Code. One page, one grid, browse and click through to the source.

---

## 1. Background

An Agent Skill is a folder containing a `SKILL.md` file — markdown with YAML frontmatter — that gives a coding agent domain-specific expertise on demand. The format is an open standard read by Claude Code, Cursor, Codex CLI and others.

Frontmatter is minimal and is the source of truth for our catalog:

```yaml
---
name: pdf-processing          # required · ≤64 chars · lowercase, digits, hyphens only
description: Extract text ... # required · ≤1024 chars · says what it does AND when to use it
---
```

Claude Code loads skills from `~/.claude/skills/` (personal) or `.claude/skills/` (project). Skills are distributed as GitHub repos — either one repo per skill or, more commonly, a monorepo holding dozens (`anthropics/skills`, `travisvn/awesome-claude-skills`, `hesreallyhim/awesome-claude-code`). Today discovery happens through hand-maintained README tables. That is the gap this site fills.

**Note on trust:** a skill is executable instructions. The official guidance is to only install skills from sources you trust and to audit them first. The MVP surfaces the source repo prominently for exactly this reason (see §7).

## 2. Goals

- Display a browsable grid of publicly available Claude Code agent skills.
- Every card links out to the `SKILL.md` on GitHub.
- Ship as a static site with zero backend and zero runtime dependencies on the GitHub API.
- Adding a skill is a pull request against one JSON file.

## 3. Non-goals (explicitly out of MVP)

Accounts, auth, submission forms, ratings, install counts, one-click install, comments, skill detail pages, rendering SKILL.md content in-app, GitHub API sync, a database, pagination/infinite scroll, dark mode toggle, i18n.

## 4. Data model

One record per skill.

```ts
// lib/types.ts
export type Category =
  | "development"
  | "documents"
  | "design"
  | "data"
  | "devops"
  | "testing"
  | "security"
  | "research"
  | "productivity"
  | "meta"; // skills that build skills

export interface Skill {
  /** slug, unique, matches SKILL.md `name` where possible */
  id: string;
  /** display name, e.g. "PDF Processing" */
  name: string;
  /** one-line summary, from SKILL.md `description`; truncated for display */
  description: string;
  category: Category;
  /** canonical link to the skill: a SKILL.md, a skill directory, or a repo */
  url: string;
  /** "anthropics/skills" — derived from `url`, not authored; absent off GitHub */
  repo?: string;
  tags?: string[];
}
```

**Field rules**

| Field | Rule |
|---|---|
| `id` | lowercase, hyphens, unique across the file — build fails on duplicates |
| `description` | plain text, no markdown; ≤200 chars authored, clamped to 3 lines in the card |
| `category` | must be one of the `Category` union — build fails otherwise |
| `url` | must be `https://`. Not always a `.md` file — canonical links point at skill directories (`.../tree/main/skills/pdf`), at whole repos (`obra/superpowers` is a 20-skill library), and occasionally off GitHub (`ui.shadcn.com/docs/skills`). `repo` is derived as `owner/repo` for github.com hosts and omitted otherwise; the card falls back to showing the hostname. |

## 5. Data source

`data/skills.json` — a checked-in array of `Skill`, seeded by hand from the known collections (§1). Loaded at build time via a direct import in a Server Component. No fetch, no cache, no revalidation.

Validation runs in `lib/skills.ts` at module load: unknown category, duplicate `id`, or malformed `url` throws, which fails `next build`. Bad data cannot reach production.

Target for launch: **30–50 skills** across at least 6 categories.

## 6. Routes

| Route | Contents |
|---|---|
| `/` | Agent Skills Repo — header, nav, search, category filter, grid, footer |
| `/subagents` | Subagents Repo — the same, over the subagents catalog |

Both are rendered by one shared shell, `components/catalog/catalog-page.tsx`, with a tab nav between them.

### 6a. Second catalog: subagents

A subagent is a `.md` file in `.claude/agents/` (project) or `~/.claude/agents/` (personal), with YAML frontmatter and a Markdown system prompt. It runs in its own isolated context window — that isolation is what separates it from a skill. `name` and `description` are required; `tools` and `model` are optional.

The two catalogs share everything except their data and config:

- `lib/catalog.ts` defines `CatalogItem` and `CatalogConfig` and exports `validateCatalog(items, config, source)`. `source` names the JSON file so a bad entry reads `data/subagents.json[5]: unknown category "bogus"`.
- `lib/skills.ts` and `lib/subagents.ts` each own a category list, labels, and pill colours. **Category slugs must not overlap between catalogs** — enforced by a check in `scripts/check-filter.ts`.
- `CatalogItem` carries optional `model?: string` and `tools?: string[]`, rendered by the card only when present. Subagent cards get a model badge and tool chips; skills cards render exactly as before.

Why fields rather than a render prop: `CatalogBrowser` is the one `"use client"` component and receives its props from a server page. Functions cannot cross that boundary, so the extra fields must be plain serializable data.

`data/subagents.json` holds 40 entries seeded from `VoltAgent/awesome-claude-code-subagents`, with `description`, `model` and `tools` read from each agent's actual frontmatter.

## 7. UI

**Layout** — single column page, `max-w-7xl`, centered.

```
┌──────────────────────────────────────────────────┐
│  Agent Skills Repo                    [GitHub ↗] │
│  Browse open source skills for Claude Code       │
│                                                  │
│  ┌────────────────────────────────┐              │
│  │ 🔍 Search skills…              │   47 skills  │
│  └────────────────────────────────┘              │
│  [All] [development] [documents] [design] [data] │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ card     │ │ card     │ │ card     │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ card     │ │ card     │ │ card     │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────┘
```

**Grid** — CSS grid, `gap-4`. 1 column under 640px, 2 at `sm`, 3 at `lg`. Cards stretch to equal height in a row.

**Card** — the whole card is one `<a href={skill.url} target="_blank" rel="noopener noreferrer">`. Contents, top to bottom:

1. Category pill (small, muted, one color per category)
2. Skill name (semibold)
3. Description, clamped to 3 lines
4. Footer row: `owner/repo` in monospace + an external-link glyph

Hover raises the border and shows the glyph. Focus ring is visible for keyboard users.

**Search** — client-side, case-insensitive substring match against `name`, `description` and `tags`. Filters as you type, no debounce needed at this data size.

**Category filter** — a row of toggle chips, single-select, `All` default. Combines with search via AND.

**Empty state** — "No skills match *query*." plus a "Clear filters" button.

**Theme** — light and dark via Tailwind's `dark:` and `prefers-color-scheme`. No toggle.

## 8. Architecture

Next.js 16.3.4, App Router, React 19, TypeScript, Tailwind v4 — the stack already in this repo.

> Read `node_modules/next/dist/docs/` before writing components; this Next.js version differs from what's in training data (see `AGENTS.md`).

```
app/
  layout.tsx        # shell, fonts, metadata
  page.tsx          # Server Component: reads skills, renders <SkillBrowser>
components/
  skill-browser.tsx # "use client" — owns search + category state
  skill-card.tsx    # presentational
  category-filter.tsx
lib/
  skills.ts         # load + validate data/skills.json
  types.ts
data/
  skills.json
```

The split matters: `page.tsx` stays a Server Component so the full skill list is embedded in the HTML at build time and the page is useful before JS hydrates. Only the search/filter shell is client-side.

Deploys as a static export to any host.

## 9. Acceptance criteria

- [ ] `/` renders every skill in `data/skills.json` as a grid card.
- [ ] Clicking any card opens that skill's `SKILL.md` on GitHub in a new tab.
- [ ] Typing in search narrows the grid across name, description and tags.
- [ ] Selecting a category chip narrows the grid; it combines with search.
- [ ] Result count reflects the active filters.
- [ ] Empty state appears when nothing matches, and clears in one click.
- [ ] Layout is correct at 375px, 768px and 1440px, with no horizontal scroll.
- [ ] Grid is fully readable and navigable with JS disabled.
- [ ] Every card is reachable by keyboard with a visible focus ring.
- [ ] `npm run build` and `npm run lint` pass clean.
- [ ] Adding a skill requires editing exactly one file.
- [ ] Invalid data (bad category, duplicate id, non-GitHub url) fails the build.

## 10. Later

Roughly in order of value: skill detail pages rendering `SKILL.md`; a submission flow; GitHub Action that re-syncs stars and validates that every `url` still resolves; multi-select and tag filtering; sort by stars/recency; copy-to-clipboard install command; author pages.

---

## Appendix: seed sources

- [anthropics/skills](https://github.com/anthropics/skills) — official open-source skills
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — curated, already categorized
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) — broader Claude Code resources
- [GitHub topic: claude-code-skills](https://github.com/topics/claude-code-skills)
- [Agent Skills — Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — the SKILL.md field spec
