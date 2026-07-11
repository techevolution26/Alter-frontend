import CreateGlobalEventForm from "@/components/platform/CreateGlobalEventForm";

export default function NewGlobalEventPage() {
    return (
        <div>
            <h2 className="font-display text-xl text-ink">New global event</h2>
            <p className="mt-1 text-sm text-ink/60">
                For platform-wide gatherings. Org-specific events are created by that org's field staff
                or admin, under Staff.
            </p>
            <div className="mt-6 max-w-lg">
                <CreateGlobalEventForm />
            </div>
        </div>
    );
}