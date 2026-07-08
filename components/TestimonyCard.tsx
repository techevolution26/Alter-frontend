import { formatRelativeTime } from "@/lib/format";
import type { Testimony } from "@/lib/types";

export default function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <article className="rounded-card border border-vigil/10 bg-white/70 p-6">
      <span className="font-mono text-[11px] uppercase tracking-wide text-clay">
        Testimony
      </span>

      <h3 className="mt-1 font-display text-xl text-ink">{testimony.title}</h3>

      {testimony.prayer && (
        <div className="mt-4 rounded-xl border border-vigil/10 bg-vigil/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">
            Attached prayer
          </p>
          <p className="mt-2 text-sm text-ink/70">
            {testimony.prayer.content}
          </p>
          {testimony.prayer.category && (
            <p className="mt-2 text-xs text-ink/40">
              Category: {testimony.prayer.category}
            </p>
          )}
        </div>
      )}

      <p className="mt-3 whitespace-pre-line font-body text-[15px] leading-relaxed text-ink/80">
        {testimony.content}
      </p>

      <p className="mt-4 font-mono text-xs text-ink/40">
        {formatRelativeTime(testimony.created_at)}
      </p>
    </article>
  );
}