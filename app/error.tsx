"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">Something went wrong</p>
      <h1 className="mt-3 font-display text-3xl italic text-ink">We couldn't load that.</h1>
      <p className="mt-3 text-ink/60">
        This is usually temporary — the backend may be starting up or briefly unreachable.
      </p>
      <button onClick={() => reset()} className="btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
