export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="h-8 w-64 animate-pulse rounded bg-vigil/10" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-vigil/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-card bg-vigil/5" />
        ))}
      </div>
    </div>
  );
}
