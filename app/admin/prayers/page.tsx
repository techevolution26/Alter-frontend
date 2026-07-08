import { apiFetch, ApiError } from "@/lib/api";
import PrayerQueueItem from "@/components/admin/PrayerQueueItem";
import type { PrayerRequestModeration } from "@/lib/types";

export default async function AdminPrayersPage() {
    let prayers: PrayerRequestModeration[];
    try {
        prayers = await apiFetch<PrayerRequestModeration[]>("/prayers/moderation/queue");
    } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
            return <p className="text-ink/60">You don't have permission to view the prayer queue.</p>;
        }
        throw err;
    }

    return (
        <div>
            <h2 className="font-display text-xl text-ink">Prayer queue</h2>
            <p className="mt-1 text-sm text-ink/60">
                Ordered crisis-first, then oldest first. Nothing here has reached the public wall yet.
            </p>

            {prayers.length === 0 ? (
                <p className="mt-8 text-ink/50">Nothing waiting for review right now.</p>
            ) : (
                <div className="mt-6 space-y-4">
                    {prayers.map((p) => (
                        <PrayerQueueItem key={p.id} prayer={p} />
                    ))}
                </div>
            )}
        </div>
    );
}