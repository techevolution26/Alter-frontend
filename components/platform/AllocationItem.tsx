import { formatKes, formatRelativeTime } from "@/lib/format";
import type { Allocation } from "@/lib/types";

export default function AllocationItem({ allocation }: { allocation: Allocation }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-vigil/10 py-3 last:border-0">
            <div>
                <p className="text-sm text-ink/80">{allocation.description}</p>
                <p className="mt-0.5 font-mono text-xs text-ink/40">
                    {formatRelativeTime(allocation.created_at)}
                </p>
            </div>
            <p className="shrink-0 font-mono text-sm text-clay">{formatKes(allocation.amount)}</p>
        </div>
    );
}