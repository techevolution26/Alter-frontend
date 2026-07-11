import { apiFetch } from "@/lib/api";
import AssignRoleForm from "@/components/platform/AssignRoleForm";
import type { Organization } from "@/lib/types";

export default async function AssignRolePage() {
    const organizations = await apiFetch<Organization[]>("/organizations?limit=100", {
        authenticated: false,
    });

    return (
        <div>
            <h2 className="font-display text-xl text-ink">Assign a role</h2>
            <p className="mt-1 text-sm text-ink/60">
                Promotes an existing account — they must already be registered.
            </p>
            <div className="mt-6 max-w-lg">
                <AssignRoleForm organizations={organizations} />
            </div>
        </div>
    );
}