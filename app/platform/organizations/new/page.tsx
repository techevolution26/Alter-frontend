import CreateOrganizationForm from "@/components/platform/CreateOrganizationForm";

export default function NewOrganizationPage() {
    return (
        <div>
            <h2 className="font-display text-xl text-ink">New organization</h2>
            <p className="mt-1 text-sm text-ink/60">
                Once created, assign an admin to it from "Assign a role."
            </p>
            <div className="mt-6 max-w-lg">
                <CreateOrganizationForm />
            </div>
        </div>
    );
}