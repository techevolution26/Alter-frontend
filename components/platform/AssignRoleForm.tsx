"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { assignRoleByIdentifierAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";
import type { Organization } from "@/lib/types";

const ROLES = [
    { value: "field_staff", label: "Field staff", needsOrg: true },
    { value: "moderator", label: "Moderator", needsOrg: false },
    { value: "admin", label: "Admin", needsOrg: true },
    { value: "super_admin", label: "Super-admin", needsOrg: false },
] as const;

export default function AssignRoleForm({ organizations }: { organizations: Organization[] }) {
    const [state, formAction] = useFormState(assignRoleByIdentifierAction, {});
    const [role, setRole] = useState<string>("field_staff");

    const needsOrg = ROLES.find((r) => r.value === role)?.needsOrg ?? false;

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <label htmlFor="identifier" className="field-label">
                    Their email or phone number
                </label>
                <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    className="field-input"
                    placeholder="e.g. wanjiru@alter.example"
                />
                <p className="mt-1 text-xs text-ink/40">They must already have an Alter account.</p>
            </div>

            <div>
                <label htmlFor="role" className="field-label">
                    New role
                </label>
                <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="field-input"
                >
                    {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>
            </div>

            {needsOrg && (
                <div>
                    <label htmlFor="organization_id" className="field-label">
                        Organization
                    </label>
                    <select id="organization_id" name="organization_id" required className="field-input">
                        <option value="">Select one...</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name} — {org.region}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {role === "super_admin" && (
                <p className="rounded-lg border border-clay/30 bg-clay/10 px-3.5 py-2.5 text-sm text-clay">
                    Super-admin is a platform-wide role with no organization scope — use this deliberately.
                </p>
            )}

            <FormMessage state={state} />

            <SubmitButton pendingLabel="Assigning...">Assign role</SubmitButton>
        </form>
    );
}