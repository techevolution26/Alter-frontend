import { getCurrentUser } from "@/lib/api";

export default async function AdminHomePage() {
    const user = await getCurrentUser();

    return (
        <div>
            <p className="text-ink/60">
                Welcome{user ? `, ${user.full_name.split(" ")[0]}` : ""}. Pick a section above.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-ink/60">
                <li>
                    <strong className="text-ink/80">Prayer queue</strong> — anything pending review or
                    crisis-escalated. Nothing here is visible on the public wall yet.
                </li>
                <li>
                    <strong className="text-ink/80">Testimonies</strong> — every testimony sits here until a
                    staff member explicitly publishes it.
                </li>
                <li>
                    <strong className="text-ink/80">Reports</strong> — content flagged by members for
                    follow-up.
                </li>
            </ul>
        </div>
    );
}