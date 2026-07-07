"use client";

import { useRef, useState, useTransition } from "react";
import { prayForRequestAction } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/format";
import type { PrayerRequest } from "@/lib/types";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const STATUS_LABEL: Record<string, string> = {
  pending_review: "Being reviewed",
  escalated: "With our care team",
};

export default function PrayerCard({ prayer }: { prayer: PrayerRequest }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [count, setCount] = useState(prayer.prayer_count);
  const [prayed, setPrayed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const nextRippleId = useRef(0);

  const isReviewing = prayer.status !== "published";

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (prayed || isReviewing) return;

    const rect = event.currentTarget.getBoundingClientRect();
    nextRippleId.current += 1;
    const ripple: Ripple = {
      id: nextRippleId.current,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 700);

    setCount((c) => c + 1);
    setPrayed(true);

    // Optimistic UI already updated above, so this is fire-and-forget —
    // startTransition just keeps the card from blocking other updates
    // while the request is in flight.
    const formData = new FormData();
    formData.set("prayer_id", prayer.id);
    startTransition(() => {
      void prayForRequestAction(formData);
    });
  }

  return (
    <article className={`prayer-card ${isPending ? "opacity-90" : ""}`}>
      {prayer.category && (
        <span className="mb-2 inline-block rounded-full bg-clay/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-clay">
          {prayer.category}
        </span>
      )}

      <p className="font-body text-[15px] leading-relaxed text-ink/90">{prayer.content}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-xs text-ink/40">{formatRelativeTime(prayer.created_at)}</span>

        {isReviewing ? (
          <span className="font-mono text-xs text-ink/40">{STATUS_LABEL[prayer.status] ?? "Pending"}</span>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={prayed}
            className={`relative isolate flex items-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-1.5 font-body text-sm font-medium transition ${
              prayed
                ? "border-ember/40 bg-ember/15 text-clay animate-pulse-glow"
                : "border-vigil/15 text-vigil hover:border-ember hover:bg-ember/10"
            }`}
          >
            <span aria-hidden="true">🙏</span>
            <span className="font-mono tabular-nums">{count}</span>
            <span className="sr-only">people have prayed for this</span>
            {ripples.map((r) => (
              <span
                key={r.id}
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 h-3 w-3 rounded-full bg-ember/60 animate-ripple"
                style={{ left: r.x - 6, top: r.y - 6 }}
              />
            ))}
          </button>
        )}
      </div>
    </article>
  );
}
