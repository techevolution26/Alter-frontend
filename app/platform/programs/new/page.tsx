import { apiFetch } from "@/lib/api";
import CreateProgramForm from "@/components/platform/CreateProgramForm";
import type { Organization } from "@/lib/types";

export default async function NewProgramPage() {
    const organizations = await apiFetch<Organization[]>("/organizations?limit=100", {
        authenticated: false,
    });

    return (
        <div>
            <h2 className="font-display text-xl text-ink">New program</h2>
            <p className="mt-1 text-sm text-ink/60">
                This appears on the public programs list immediately — donors can give toward it right
                away.
            </p>
            <div className="mt-6 max-w-lg">
                <CreateProgramForm organizations={organizations} />
            </div>
        </div>
    );
}