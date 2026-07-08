import { apiFetch, getCurrentUser } from "@/lib/api";
import CreateEventForm from "@/components/admin/CreateEventForm";
import type { Organization } from "@/lib/types";

export default async function NewEventPage() {
    const user = await getCurrentUser();
    const canCreate = user?.role === "field_staff" || user?.role === "admin";

    if (!canCreate) {
        return (
            <p className="text-ink/60">
                Only field staff and admins can create events (matches the backend's own permission
                check).
            </p>
        );
    }

    const organizations = await apiFetch<Organization[]>("/organizations?limit=100", {
        authenticated: false,
    });

    return (
        <div>
            <h2 className="font-display text-xl text-ink">New event</h2>
            <p className="mt-1 text-sm text-ink/60">This publishes straight to the public events list.</p>
            <div className="mt-6 max-w-lg">
                <CreateEventForm organizations={organizations} />
            </div>
        </div>
    );
}