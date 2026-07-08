"use client";

import { useState, useTransition } from "react";
import { resolveReportAction } from "@/lib/actions";
import { formatRelativeTime } from "@/lib/format";
import type { ModerationReport } from "@/lib/types";

export default function ReportItem({ report }: { report: ModerationReport }) {
    const [status, setStatus] = useState(report.status);
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleResolve(newStatus: "resolved" | "escalated") {
        startTransition(async () => {
            const result = await resolveReportAction(report.id, newStatus, notes);
            if (result.error) setMessage(result.error);
            else setStatus(newStatus);
        });
    }

    const isResolved = status === "resolved";

    return (
        <article className="rounded-card border border-vigil/10 bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wide text-clay">
                    {report.content_type.replace("_", " ")}
                </span>
                <span className="font-mono text-xs text-ink/40">{formatRelativeTime(report.created_at)}</span>
            </div>

            <p className="mt-2 font-body text-[15px] text-ink/90">{report.reason}</p>
            <p className="mt-1 font-mono text-xs text-ink/40">content id: {report.content_id}</p>

            {isResolved ? (
                <p className="mt-4 font-mono text-xs text-clay">Resolved.</p>
            ) : (
                <div className="mt-4 space-y-3">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Resolution notes (optional)"
                        className="field-input resize-none text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleResolve("resolved")}
                            className="btn-primary !px-4 !py-1.5 text-sm"
                        >
                            Mark resolved
                        </button>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleResolve("escalated")}
                            className="btn-secondary !border-clay/40 !px-4 !py-1.5 text-sm !text-clay"
                        >
                            Escalate further
                        </button>
                    </div>
                </div>
            )}

            {message && <p className="mt-2 text-sm text-clay">{message}</p>}
        </article>
    );
}