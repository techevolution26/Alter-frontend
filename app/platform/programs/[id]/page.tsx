import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { formatKes, isValidUuid } from "@/lib/format";
import ProgramStatusControl from "@/components/platform/ProgramStatusControl";
import RecordAllocationForm from "@/components/platform/RecordAllocationForm";
import AllocationItem from "@/components/platform/AllocationItem";
import type { Allocation, ProgramWithStats } from "@/lib/types";

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
    if (!isValidUuid(params.id)) notFound();

    let program: ProgramWithStats;
    try {
        program = await apiFetch<ProgramWithStats>(`/programs/${params.id}`, { authenticated: false });
    } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 422)) notFound();
        throw err;
    }

    const allocations = await apiFetch<Allocation[]>(`/programs/${params.id}/allocations?limit=100`, {
        authenticated: false,
    });
    const reversedIds = new Set(
        allocations
            .filter((a) => a.reverses_allocation_id)
            .map((a) => a.reverses_allocation_id as string)
    );

    const balance = parseFloat(program.balance);

    return (
        <div>
            <p className="font-mono text-xs uppercase tracking-wide text-clay">
                {program.organization_id ? "Org-scoped program" : "Platform-wide program"}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{program.name}</h2>
            <p className="mt-2 max-w-xl text-ink/70">{program.description}</p>

            <div className="mt-4">
                <ProgramStatusControl programId={program.id} currentStatus={program.status} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-card border border-vigil/10 bg-white/70 p-5 font-mono">
                <div>
                    <p className="text-xs text-ink/40">Raised</p>
                    <p className="mt-1 text-lg text-ink/80">{formatKes(program.total_raised)}</p>
                </div>
                <div>
                    <p className="text-xs text-ink/40">Allocated</p>
                    <p className="mt-1 text-lg text-ink/80">{formatKes(program.total_allocated)}</p>
                </div>
                <div>
                    <p className="text-xs text-ink/40">Balance</p>
                    <p className={`mt-1 text-lg ${balance < 0 ? "text-clay" : "text-ink/80"}`}>
                        {formatKes(program.balance)}
                    </p>
                </div>
            </div>
            {program.target_amount && (
                <p className="mt-2 font-mono text-xs text-ink/40">
                    Target: {formatKes(program.target_amount)}
                </p>
            )}

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                    <h3 className="font-display text-lg text-ink">Record an allocation</h3>
                    <div className="mt-4">
                        <RecordAllocationForm programId={program.id} />
                    </div>
                </div>

                <div>
                    <h3 className="font-display text-lg text-ink">Allocation history</h3>
                    <div className="mt-4 rounded-card border border-vigil/10 bg-white/70 px-5">
                        {allocations.length === 0 ? (
                            <p className="py-6 text-sm text-ink/50">Nothing allocated yet.</p>
                        ) : (
                            allocations.map((a) => (
                                <AllocationItem
                                    key={a.id}
                                    allocation={a}
                                    isReversed={reversedIds.has(a.id)}
                                    programId={program.id}
                                    showActions
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}