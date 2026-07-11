import type { OrganizationOverview } from "@/lib/types";

export default function OrganizationOverviewCard({ org }: { org: OrganizationOverview }) {
    return (
        <article className="rounded-card border border-vigil/10 bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-ink">{org.name}</h3>
                {org.is_verified_partner && (
                    <span className="rounded-full bg-ember/15 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-clay">
                        Verified
                    </span>
                )}
            </div>
            <p className="mt-1 text-sm text-ink/50">
                {org.region} · {org.type.replace("_", " ")}
            </p>
            <div className="mt-4 flex gap-6 font-mono text-sm text-ink/70">
                <span>
                    <span className="text-base text-clay">{org.member_count}</span> members
                </span>
                <span>
                    <span className="text-base text-clay">{org.admin_count}</span> admins
                </span>
            </div>
        </article>
    );
}