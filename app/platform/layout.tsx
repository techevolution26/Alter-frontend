import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "super_admin") {
        redirect("/");
    }

    return (
        <div className="mx-auto max-w-4xl px-5 py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="font-display text-2xl italic text-ink">Platform</h1>
                <span className="font-mono text-xs uppercase tracking-wide text-clay">
                    Signed in as super-admin
                </span>
            </div>
            <p className="mt-1 text-sm text-ink/50">
                Organizations, fund allocation, and platform-wide events — separate from prayer/testimony
                moderation, which lives under Staff.
            </p>

            <nav className="mt-6 flex flex-wrap gap-2 border-b border-vigil/10 pb-4">
                <Link href="/platform/organizations" className="btn-secondary !px-4 !py-2 text-sm">
                    Organizations
                </Link>
                <Link href="/platform/admins/new" className="btn-secondary !px-4 !py-2 text-sm">
                    Assign a role
                </Link>
                <Link href="/platform/programs" className="btn-secondary !px-4 !py-2 text-sm">
                    Programs
                </Link>
                <Link href="/platform/events/new" className="btn-secondary !px-4 !py-2 text-sm">
                    New global event
                </Link>
            </nav>

            <div className="mt-8">{children}</div>
        </div>
    );
}