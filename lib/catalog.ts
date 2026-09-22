/**
 * Shared plumbing for every catalog on the site (skills, subagents).
 * A catalog is a validated list of items plus the config describing how its
 * categories are labelled and coloured.
 */

export interface CatalogItem {
  /** Unique slug within its catalog. */
  id: string;
  name: string;
  /** One-line summary, plain text. */
  description: string;
  /** Must be one of its catalog's `categories`. */
  category: string;
  /** Canonical link: a file, a directory, or a repo. */
  url: string;
  /** "owner/repo", derived from `url` for github.com links. */
  repo?: string;
  tags?: string[];
  /** Subagents only — the model the agent declares (opus, sonnet, inherit…). */
  model?: string;
  /** Subagents only — declared tools. Absent means it inherits all of them. */
  tools?: string[];
}

export interface CatalogConfig {
  /** Ordered category slugs. Drives the filter chips, so the UI can't drift. */
  categories: readonly string[];
  labels: Record<string, string>;
  /**
   * Full Tailwind class strings per category. Never build these by
   * interpolation — Tailwind only emits classes it can see as literals.
   */
  pillStyles: Record<string, string>;
}

const ID_PATTERN = /^[a-z0-9-]+$/;

/**
 * Returns "owner/repo" for a github.com URL, or null for anything else.
 * Not every item is hosted on GitHub, so callers must handle null.
 */
export function deriveRepo(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
    return null;
  }
  const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
  return owner && repo ? `${owner}/${repo}` : null;
}

/**
 * Validates raw catalog JSON and stamps each entry with its derived repo.
 * Call at module load so bad data fails `next build` instead of shipping.
 *
 * @param source path of the JSON file, used in error messages.
 */
export function validateCatalog(
  items: readonly CatalogItem[],
  config: CatalogConfig,
  source: string,
): CatalogItem[] {
  const seen = new Set<string>();

  return items.map((raw, index) => {
    const at = `${source}[${index}]`;

    if (!ID_PATTERN.test(raw.id)) {
      throw new Error(`${at}: id "${raw.id}" must be lowercase letters, digits and hyphens`);
    }
    if (seen.has(raw.id)) {
      throw new Error(`${at}: duplicate id "${raw.id}"`);
    }
    seen.add(raw.id);

    if (!config.categories.includes(raw.category)) {
      throw new Error(
        `${at}: unknown category "${raw.category}" (expected one of ${config.categories.join(", ")})`,
      );
    }
    if (!raw.url.startsWith("https://")) {
      throw new Error(`${at}: url "${raw.url}" must start with https://`);
    }
    if (!raw.name.trim() || !raw.description.trim()) {
      throw new Error(`${at}: name and description must be non-empty`);
    }

    return { ...raw, repo: deriveRepo(raw.url) ?? undefined };
  });
}
