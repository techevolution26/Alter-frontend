"use client";

import { useState, useTransition } from "react";
import { reverseAllocationAction } from "@/lib/actions";
import { formatKes, formatRelativeTime } from "@/lib/format";
import type { Allocation } from "@/lib/types";

export default function AllocationItem({
    allocation,
    isReversed = false,
    programId,
    showActions = false,
}: {
    allocation: Allocation;
    /** True if some other allocation in the list reverses this one. */
    isReversed?: boolean;
    /** Required (along with showActions) to enable the reverse control. */
    programId?: string;
    /** Admin context only — the public transparency page never shows this. */
    showActions?: boolean;
}) {
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [showReverseForm, setShowReverseForm] = useState(false);
    const [locallyReversed, setLocallyReversed] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isReversal = allocation.kind === "reversal";
    const alreadyReversed = isReversed || locallyReversed;

    function handleReverse() {
        if (!programId) return;
        startTransition(async () => {
            const result = await reverseAllocationAction(programId, allocation.id, reason);
            if (result.error) {
                setMessage(result.error);
            } else {
                setLocallyReversed(true);
                setShowReverseForm(false);
            }
        });
    }

    return (
        <div className="border-b border-vigil/10 py-3 last:border-0">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {isReversal && (
                            <span className="rounded-full border border-vigil/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50">
                                Reversal
                            </span>
                        )}
                        {allocation.exceeded_balance_at_time && (
                            <span className="rounded-full border border-clay/40 bg-clay/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-clay">
                                Exceeded balance
                            </span>
                        )}
                        {alreadyReversed && !isReversal && (
                            <span className="rounded-full border border-vigil/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50">
                                Reversed
                            </span>
                        )}
                    </div>

                    <p className={`mt-1 text-sm ${isReversal ? "italic text-ink/50" : "text-ink/80"}`}>
                        {allocation.description}
                    </p>
                    {allocation.justification && (
                        <p className="mt-1 text-xs text-ink/40">Justification: {allocation.justification}</p>
                    )}
                    <p className="mt-1 font-mono text-xs text-ink/40">
                        {formatRelativeTime(allocation.created_at)}
                    </p>
                </div>

                <p className={`shrink-0 font-mono text-sm ${isReversal ? "text-ink/50" : "text-clay"}`}>
                    {isReversal ? "+" : "−"}
                    {formatKes(allocation.amount)}
                </p>
            </div>

            {showActions && programId && !isReversal && !alreadyReversed && (
                <div className="mt-2">
                    {showReverseForm ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason for reversal"
                                className="field-input !w-auto flex-1 !py-1 text-xs"
                            />
                            <button
                                type="button"
                                disabled={isPending || !reason.trim()}
                                onClick={handleReverse}
                                className="btn-secondary !border-clay/40 !px-3 !py-1 text-xs !text-clay"
                            >
                                Confirm reverse
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReverseForm(false)}
                                className="text-xs text-ink/40 hover:text-ink/60"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowReverseForm(true)}
                            className="font-mono text-xs text-ink/40 underline hover:text-clay"
                        >
                            Reverse this
                        </button>
                    )}
                    {message && <p className="mt-1 text-xs text-clay">{message}</p>}
                </div>
            )}
        </div>
    );
}