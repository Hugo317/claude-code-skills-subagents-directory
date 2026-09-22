import type { CatalogItem } from "./catalog";
import type { SortKey } from "./types";

export interface FilterState {
  query: string;
  category: string;
  sort: SortKey;
}

/** Case-insensitive substring match across name, description and tags. */
export function matchesQuery(item: CatalogItem, needle: string): boolean {
  if (!needle) return true;
  const haystack = [item.name, item.description, ...(item.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

/**
 * Applies search + category (ANDed), then sorts. Pure and dependency-free so it
 * can be exercised directly in Node — see `scripts/check-filter.ts`.
 */
export function filterAndSort(
  items: CatalogItem[],
  state: FilterState,
): CatalogItem[] {
  const needle = state.query.trim().toLowerCase();

  return items
    .filter(
      (item) =>
        (state.category === "all" || item.category === state.category) &&
        matchesQuery(item, needle),
    )
    .sort((a, b) => {
      if (state.sort === "category" && a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
}
