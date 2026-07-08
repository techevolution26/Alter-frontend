import { apiFetch, ApiError } from "@/lib/api";
import TestimonyQueueItem from "@/components/admin/TestimonyQueueItem";
import type { Testimony } from "@/lib/types";

export default async function AdminTestimoniesPage() {
    let testimonies: Testimony[];
    try {
        testimonies = await apiFetch<Testimony[]>("/testimonies/pending");
    } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
            return <p className="text-ink/60">You don't have permission to review testimonies.</p>;
        }
        throw err;
    }

    return (
        <div>
            <h2 className="font-display text-xl text-ink">Testimonies awaiting review</h2>
            <p className="mt-1 text-sm text-ink/60">
                Nothing here has been published yet — every testimony needs an explicit approval.
            </p>

            {testimonies.length === 0 ? (
                <p className="mt-8 text-ink/50">Nothing waiting for review right now.</p>
            ) : (
                <div className="mt-6 space-y-4">
                    {testimonies.map((t) => (
                        <TestimonyQueueItem key={t.id} testimony={t} />
                    ))}
                </div>
            )}
        </div>
    );
}