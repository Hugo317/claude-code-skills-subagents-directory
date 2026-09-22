export default function Loading() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
