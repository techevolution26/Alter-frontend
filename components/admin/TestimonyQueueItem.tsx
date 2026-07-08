"use client";

import { useState, useTransition } from "react";
import { reviewTestimonyAction } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/format";
import type { Testimony } from "@/lib/types";

export default function TestimonyQueueItem({ testimony }: { testimony: Testimony }) {
    const [status, setStatus] = useState(testimony.status);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleReview(newStatus: "published" | "rejected") {
        startTransition(async () => {
            const result = await reviewTestimonyAction(testimony.id, newStatus);
            if (result.error) setMessage(result.error);
            else setStatus(newStatus);
        });
    }

    const isResolved = status === "published" || status === "rejected";

    return (
        <article className="rounded-card border border-vigil/10 bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-ink">{testimony.title}</h3>
                <span className="font-mono text-xs text-ink/40">{formatRelativeTime(testimony.created_at)}</span>
            </div>
            <p className="mt-2 whitespace-pre-line font-body text-[15px] leading-relaxed text-ink/80">
                {testimony.content}
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
                        Approve &amp; publish
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleReview("rejected")}
                        className="btn-secondary !border-clay/40 !px-4 !py-1.5 text-sm !text-clay"
                    >
                        Reject
                    </button>
                </div>
            )}

            {message && <p className="mt-2 text-sm text-clay">{message}</p>}
        </article>
    );
}