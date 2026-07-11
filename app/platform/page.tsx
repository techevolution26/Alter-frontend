export default function PlatformHomePage() {
    return (
        <div>
            <p className="text-ink/60">Pick a section above.</p>
            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-ink/60">
                <li>
                    <strong className="text-ink/80">Organizations</strong> — every partner church/NGO, with
                    member and admin counts at a glance.
                </li>
                <li>
                    <strong className="text-ink/80">Assign a role</strong> — promote someone to field staff,
                    moderator, admin, or another super-admin.
                </li>
                <li>
                    <strong className="text-ink/80">Programs</strong> — the fund allocation ledger. Raised
                    vs. allocated, computed fresh every time — this is what the public transparency page
                    will eventually read from directly.
                </li>
                <li>
                    <strong className="text-ink/80">New global event</strong> — platform-wide gatherings,
                    not tied to a single organization.
                </li>
            </ul>
        </div>
    );
}