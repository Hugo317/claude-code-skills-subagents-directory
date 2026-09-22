import type { CatalogConfig } from "@/lib/catalog";
import type { SortKey } from "@/lib/types";

interface FilterBarProps {
  config: CatalogConfig;
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  /** Categories present in the data, so we never render a chip matching nothing. */
  available: Set<string>;
  resultCount: number;
  totalCount: number;
  /** Plural noun for the count, e.g. "skills" or "subagents". */
  noun: string;
}

export function FilterBar({
  config,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  available,
  resultCount,
  totalCount,
  noun,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search {noun}</span>
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={`Search ${noun}…`}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          Sort
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={category === "all"} onClick={() => onCategoryChange("all")}>
          All
        </Chip>
        {config.categories
          .filter((value) => available.has(value))
          .map((value) => (
            <Chip
              key={value}
              active={category === value}
              onClick={() => onCategoryChange(value)}
            >
              {config.labels[value] ?? value}
            </Chip>
          ))}
      </div>

      <p
        aria-live="polite"
        className="text-sm text-zinc-500 tabular-nums dark:text-zinc-400"
      >
        {resultCount === totalCount
          ? `${totalCount} ${noun}`
          : `${resultCount} of ${totalCount} ${noun}`}
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
