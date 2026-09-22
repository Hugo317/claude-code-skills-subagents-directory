import { CatalogBrowser } from "./catalog-browser";
import { SiteNav, type NavKey } from "@/components/site-nav";
import type { CatalogConfig, CatalogItem } from "@/lib/catalog";

interface CatalogPageProps {
  title: string;
  tagline: string;
  /** Plural noun for search placeholder and counts, e.g. "subagents". */
  noun: string;
  items: CatalogItem[];
  config: CatalogConfig;
  /** Upstream project the catalog draws from, linked in the header. */
  sourceUrl: string;
  footnote: string;
  current: NavKey;
}

/** Shared shell for every catalog page: header, nav, grid, footer. */
export function CatalogPage({
  title,
  tagline,
  noun,
  items,
  config,
  sourceUrl,
  footnote,
  current,
}: CatalogPageProps) {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {tagline}
              </p>
            </div>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
            >
              GitHub ↗
            </a>
          </div>
          <SiteNav current={current} />
        </header>

        <main>
          <CatalogBrowser items={items} config={config} noun={noun} />
        </main>

        <footer className="border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          {footnote}
        </footer>
      </div>
    </div>
  );
}
