import Link from "next/link";
import { apiFetch } from "@/lib/api";
import OrganizationOverviewCard from "@/components/platform/OrganizationOverviewCard";
import type { OrganizationOverview } from "@/lib/types";

export default async function PlatformOrganizationsPage() {
    const orgs = await apiFetch<OrganizationOverview[]>("/platform/organizations?limit=100");

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl text-ink">Organizations</h2>
                <Link href="/platform/organizations/new" className="btn-primary !px-4 !py-1.5 text-sm">
                    New organization
                </Link>
            </div>

            {orgs.length === 0 ? (
                <p className="mt-8 text-ink/50">No organizations yet.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {orgs.map((org) => (
                        <OrganizationOverviewCard key={org.id} org={org} />
                    ))}
                </div>
            )}
        </div>
    );
}