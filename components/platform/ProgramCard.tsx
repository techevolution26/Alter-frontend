import Link from "next/link";
import { formatKes } from "@/lib/format";
import type { ProgramWithStats } from "@/lib/types";

const STATUS_STYLE: Record<string, string> = {
    active: "border-ember bg-ember/10 text-clay",
    paused: "border-vigil/15 text-ink/50",
    completed: "border-vigil/15 bg-vigil/5 text-vigil",
    cancelled: "border-clay/30 bg-clay/10 text-clay",
};

export default function ProgramCard({ program }: { program: ProgramWithStats }) {
    const balance = parseFloat(program.balance);

    return (
        <Link
            href={`/platform/programs/${program.id}`}
            className="block rounded-card border border-vigil/10 bg-white/70 p-5 transition hover:border-ember/50 hover:shadow-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg text-ink">{program.name}</h3>
                <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${STATUS_STYLE[program.status] ?? STATUS_STYLE.active
                        }`}
                >
                    {program.status}
                </span>
            </div>
            <p className="mt-1 text-sm text-ink/50">{program.organization_id ? "Org-scoped" : "Platform-wide"}</p>

            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-sm">
                <div>
                    <p className="text-ink/40">Raised</p>
                    <p className="text-ink/80">{formatKes(program.total_raised)}</p>
                </div>
                <div>
                    <p className="text-ink/40">Allocated</p>
                    <p className="text-ink/80">{formatKes(program.total_allocated)}</p>
                </div>
                <div>
                    <p className="text-ink/40">Balance</p>
                    <p className={balance < 0 ? "text-clay" : "text-ink/80"}>{formatKes(program.balance)}</p>
                </div>
            </div>
        </Link>
    );
}