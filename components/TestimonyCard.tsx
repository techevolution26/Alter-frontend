import { formatRelativeTime } from "@/lib/format";
import type { Testimony } from "@/lib/types";

export default function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <article className="rounded-card border border-vigil/10 bg-white/70 p-6">
      <span className="font-mono text-[11px] uppercase tracking-wide text-clay">Testimony</span>
      <h3 className="mt-1 font-display text-xl text-ink">{testimony.title}</h3>
      <p className="mt-3 whitespace-pre-line font-body text-[15px] leading-relaxed text-ink/80">
        {testimony.content}
      </p>
      <p className="mt-4 font-mono text-xs text-ink/40">{formatRelativeTime(testimony.created_at)}</p>
    </article>
  );
}
