"use client";

import { useState, useTransition } from "react";
import { updateProgramStatusAction } from "@/lib/actions";
import type { ProgramStatus } from "@/lib/types";

const STATUSES: ProgramStatus[] = ["active", "paused", "completed", "cancelled"];

export default function ProgramStatusControl({
    programId,
    currentStatus,
}: {
    programId: string;
    currentStatus: ProgramStatus;
}) {
    const [status, setStatus] = useState(currentStatus);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleChange(newStatus: ProgramStatus) {
        startTransition(async () => {
            const result = await updateProgramStatusAction(programId, newStatus);
            if (result.error) setMessage(result.error);
            else {
                setStatus(newStatus);
                setMessage(null);
            }
        });
    }

    return (
        <div className="flex items-center gap-3">
            <label htmlFor="program-status" className="font-mono text-xs uppercase tracking-wide text-ink/50">
                Status
            </label>
            <select
                id="program-status"
                value={status}
                disabled={isPending}
                onChange={(e) => handleChange(e.target.value as ProgramStatus)}
                className="field-input !w-auto !py-1.5 text-sm"
            >
                {STATUSES.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            {message && <span className="text-sm text-clay">{message}</span>}
        </div>
    );
}