import { apiFetch, ApiError } from "@/lib/api";
import ReportItem from "@/components/admin/ReportItem";
import type { ModerationReport } from "@/lib/types";

export default async function AdminReportsPage() {
    let reports: ModerationReport[];
    try {
        reports = await apiFetch<ModerationReport[]>("/moderation-reports");
    } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
            return <p className="text-ink/60">You don't have permission to view reports.</p>;
        }
        throw err;
    }

    return (
        <div>
            <h2 className="font-display text-xl text-ink">Open reports</h2>
            <p className="mt-1 text-sm text-ink/60">Content flagged by members for follow-up.</p>

            {reports.length === 0 ? (
                <p className="mt-8 text-ink/50">No open reports right now.</p>
            ) : (
                <div className="mt-6 space-y-4">
                    {reports.map((r) => (
                        <ReportItem key={r.id} report={r} />
                    ))}
                </div>
            )}
        </div>
    );
}