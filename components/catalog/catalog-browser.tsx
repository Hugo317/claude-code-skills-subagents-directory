"use client";

import { useMemo, useState } from "react";
import { CatalogCard } from "./catalog-card";
import { FilterBar } from "./filter-bar";
import { filterAndSort } from "@/lib/filter";
import type { CatalogConfig, CatalogItem } from "@/lib/catalog";
import type { SortKey } from "@/lib/types";

export function CatalogBrowser({
  items,
  config,
  noun,
}: {
  items: CatalogItem[];
  config: CatalogConfig;
  /** Plural noun used in the search placeholder and result count. */
  noun: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");

  const available = useMemo(
    () => new Set(items.map((item) => item.category)),
    [items],
  );

  const visible = useMemo(
    () => filterAndSort(items, { query, category, sort }),
    [items, query, category, sort],
  );

  const isFiltered = query.trim() !== "" || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        config={config}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        available={available}
        resultCount={visible.length}
        totalCount={items.length}
        noun={noun}
      />

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="flex">
              <CatalogCard item={item} config={config} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No {noun} match{query.trim() ? ` “${query.trim()}”` : " these filters"}.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
