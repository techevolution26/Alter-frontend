import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { formatKes, isValidUuid } from "@/lib/format";
import AllocationItem from "@/components/platform/AllocationItem";
import type { Allocation, ProgramWithStats } from "@/lib/types";

export default async function PublicProgramDetailPage({ params }: { params: { id: string } }) {
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

    const balance = parseFloat(program.balance);
    const raised = parseFloat(program.total_raised);
    const target = program.target_amount ? parseFloat(program.target_amount) : null;
    const progress = target && target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : null;

    return (
        <div className="mx-auto max-w-2xl px-5 py-12">
            <p className="font-mono text-xs uppercase tracking-wide text-clay">
                {program.organization_id ? "Community program" : "Platform-wide program"}
            </p>
            <h1 className="mt-1 font-display text-3xl italic text-ink">{program.name}</h1>
            <p className="mt-3 whitespace-pre-line text-ink/70">{program.description}</p>

            {progress !== null && (
                <div className="mt-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-vigil/10">
                        <div className="h-full rounded-full bg-ember" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-1.5 font-mono text-xs text-ink/40">
                        {progress}% of the {formatKes(program.target_amount!)} target raised
                    </p>
                </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-card border border-vigil/10 bg-white/70 p-5 font-mono">
                <div>
                    <p className="text-xs text-ink/40">Raised</p>
                    <p className="mt-1 text-lg text-ink/80">{formatKes(program.total_raised)}</p>
                </div>
                <div>
                    <p className="text-xs text-ink/40">Put to use</p>
                    <p className="mt-1 text-lg text-ink/80">{formatKes(program.total_allocated)}</p>
                </div>
                <div>
                    <p className="text-xs text-ink/40">Balance</p>
                    <p className={`mt-1 text-lg ${balance < 0 ? "text-clay" : "text-ink/80"}`}>
                        {formatKes(program.balance)}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="font-display text-lg text-ink">Allocation history</h2>
                <p className="mt-1 text-sm text-ink/60">Every recorded use of these funds, most recent first.</p>
                <div className="mt-4 rounded-card border border-vigil/10 bg-white/70 px-5">
                    {allocations.length === 0 ? (
                        <p className="py-6 text-sm text-ink/50">Nothing allocated yet.</p>
                    ) : (
                        allocations.map((a) => <AllocationItem key={a.id} allocation={a} />)
                    )}
                </div>
            </div>
        </div>
    );
}