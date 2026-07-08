"use client";

import { useState, useTransition } from "react";
import { reviewPrayerAction } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/format";
import type { PrayerRequestModeration } from "@/lib/types";

const RISK_STYLE: Record<string, string> = {
  crisis: "border-clay bg-clay/10 text-clay",
  review: "border-ember bg-ember/10 text-clay",
  none: "border-vigil/15 text-ink/50",
};

export default function PrayerQueueItem({ prayer }: { prayer: PrayerRequestModeration }) {
  const [status, setStatus] = useState(prayer.status);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReview(newStatus: "published" | "removed" | "archived") {
    startTransition(async () => {
      const result = await reviewPrayerAction(prayer.id, newStatus);
      if (result.error) setMessage(result.error);
      else setStatus(newStatus);
    });
  }

  const isResolved = status !== "pending_review" && status !== "escalated";

  return (
    <article className="rounded-card border border-vigil/10 bg-white/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${RISK_STYLE[prayer.risk_flag] ?? RISK_STYLE.none
            }`}
        >
          {prayer.risk_flag === "crisis"
            ? "Crisis flagged"
            : prayer.risk_flag === "review"
              ? "Flagged for review"
              : "No risk flags"}
        </span>
        <span className="font-mono text-xs text-ink/40">{formatRelativeTime(prayer.created_at)}</span>
      </div>

      <p className="mt-3 font-body text-[15px] leading-relaxed text-ink/90">{prayer.content}</p>

      <p className="mt-2 font-mono text-xs text-ink/40">
        visibility: {prayer.visibility} · category: {prayer.category ?? "none"}
      </p>

      {isResolved ? (
        <p className="mt-4 font-mono text-xs text-clay">Marked {status}.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleReview("published")}
            className="btn-primary !px-4 !py-1.5 text-sm"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleReview("archived")}
            className="btn-secondary !px-4 !py-1.5 text-sm"
          >
            Archive (no action needed)
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleReview("removed")}
            className="btn-secondary !border-clay/40 !px-4 !py-1.5 text-sm !text-clay"
          >
            Remove
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-sm text-clay">{message}</p>}
    </article>
  );
}