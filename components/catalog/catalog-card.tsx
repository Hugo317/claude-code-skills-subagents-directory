import type { CatalogConfig, CatalogItem } from "@/lib/catalog";

/** Neutral fallback for a category with no colour configured. */
const FALLBACK_PILL = "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

export function CatalogCard({
  item,
  config,
}: {
  item: CatalogItem;
  config: CatalogConfig;
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
            config.pillStyles[item.category] ?? FALLBACK_PILL
          }`}
        >
          {config.labels[item.category] ?? item.category}
        </span>
        {item.model && (
          <span className="shrink-0 font-mono text-xs text-zinc-500 dark:text-zinc-500">
            {item.model}
          </span>
        )}
      </div>

      <h2 className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {item.name}
      </h2>

      <p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {item.description}
      </p>

      {item.tools && item.tools.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {item.tools.map((tool) => (
            <li
              key={tool}
              className="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-500"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-500">
          {item.repo ?? new URL(item.url).hostname}
        </span>
        <ExternalLinkIcon />
      </div>
    </a>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
