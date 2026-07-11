"use client";

import { useFormState } from "react-dom";
import { createProgramAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";
import type { Organization } from "@/lib/types";

export default function CreateProgramForm({ organizations }: { organizations: Organization[] }) {
    const [state, formAction] = useFormState(createProgramAction, {});

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <label htmlFor="name" className="field-label">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={200}
                    className="field-input"
                    placeholder="e.g. School Fees Fund"
                />
            </div>

            <div>
                <label htmlFor="description" className="field-label">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    minLength={1}
                    rows={4}
                    className="field-input resize-none"
                />
            </div>

            <div>
                <label htmlFor="organization_id" className="field-label">
                    Organization <span className="font-normal text-ink/40">(leave blank for platform-wide)</span>
                </label>
                <select id="organization_id" name="organization_id" className="field-input">
                    <option value="">Platform-wide</option>
                    {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                            {org.name} — {org.region}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="target_amount" className="field-label">
                    Target amount (KES) <span className="font-normal text-ink/40">(optional)</span>
                </label>
                <input
                    id="target_amount"
                    name="target_amount"
                    type="number"
                    min={1}
                    step="1"
                    className="field-input"
                />
            </div>

            <FormMessage state={state} />

            <SubmitButton pendingLabel="Creating...">Create program</SubmitButton>
        </form>
    );
}