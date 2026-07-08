import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api";

const STAFF_ROLES = ["moderator", "admin", "field_staff"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user || !STAFF_ROLES.includes(user.role)) {
        redirect("/");
    }

    const canModeratePrayers = user.role === "moderator" || user.role === "admin";
    const canReviewTestimonies = STAFF_ROLES.includes(user.role); // moderator, admin, field_staff
    const canResolveReports = user.role === "moderator" || user.role === "admin";
    const canCreateEvents = user.role === "field_staff" || user.role === "admin";

    return (
        <div className="mx-auto max-w-4xl px-5 py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="font-display text-2xl italic text-ink">Staff console</h1>
                <span className="font-mono text-xs uppercase tracking-wide text-clay">
                    Signed in as {user.role.replace("_", " ")}
                </span>
            </div>

            <nav className="mt-6 flex flex-wrap gap-2 border-b border-vigil/10 pb-4">
                {canModeratePrayers && (
                    <Link href="/admin/prayers" className="btn-secondary !px-4 !py-2 text-sm">
                        Prayer queue
                    </Link>
                )}
                {canReviewTestimonies && (
                    <Link href="/admin/testimonies" className="btn-secondary !px-4 !py-2 text-sm">
                        Testimonies
                    </Link>
                )}
                {canResolveReports && (
                    <Link href="/admin/reports" className="btn-secondary !px-4 !py-2 text-sm">
                        Reports
                    </Link>
                )}
                {canCreateEvents && (
                    <Link href="/admin/events/new" className="btn-secondary !px-4 !py-2 text-sm">
                        New event
                    </Link>
                )}
            </nav>

            <div className="mt-8">{children}</div>
        </div>
    );
}