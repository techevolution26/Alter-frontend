import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">404</p>
      <h1 className="mt-3 font-display text-3xl italic text-ink">We couldn't find that page.</h1>
      <p className="mt-3 text-ink/60">It may have been moved, or the link might be off.</p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Back to the prayer wall
      </Link>
    </div>
  );
}
