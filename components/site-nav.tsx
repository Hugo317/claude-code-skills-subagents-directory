import Link from "next/link";

const TABS = [
  { href: "/", label: "Skills", key: "skills" },
  { href: "/subagents", label: "Subagents", key: "subagents" },
] as const;

export type NavKey = (typeof TABS)[number]["key"];

/**
 * Tab nav between the catalogs. The active tab comes from a prop rather than
 * usePathname so this stays a server component.
 */
export function SiteNav({ current }: { current: NavKey }) {
  return (
    <nav aria-label="Catalogs" className="flex gap-1">
      {TABS.map((tab) => {
        const active = tab.key === current;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
