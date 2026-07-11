"use client";

import { useFormState } from "react-dom";
import { createOrganizationAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

const ORG_TYPES = [
    { value: "church", label: "Church" },
    { value: "partner_ngo", label: "Partner NGO" },
    { value: "community_group", label: "Community group" },
];

export default function CreateOrganizationForm() {
    const [state, formAction] = useFormState(createOrganizationAction, {});

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <label htmlFor="name" className="field-label">
                    Name
                </label>
                <input id="name" name="name" type="text" required maxLength={200} className="field-input" />
            </div>

            <div>
                <label htmlFor="type" className="field-label">
                    Type
                </label>
                <select id="type" name="type" defaultValue="church" className="field-input">
                    {ORG_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="region" className="field-label">
                    Region
                </label>
                <input
                    id="region"
                    name="region"
                    type="text"
                    required
                    maxLength={120}
                    className="field-input"
                    placeholder="e.g. Nairobi"
                />
            </div>

            <div>
                <label htmlFor="contact_email" className="field-label">
                    Contact email <span className="font-normal text-ink/40">(optional)</span>
                </label>
                <input id="contact_email" name="contact_email" type="email" className="field-input" />
            </div>

            <div>
                <label htmlFor="contact_phone" className="field-label">
                    Contact phone <span className="font-normal text-ink/40">(optional)</span>
                </label>
                <input id="contact_phone" name="contact_phone" type="tel" className="field-input" />
            </div>

            <FormMessage state={state} />

            <SubmitButton pendingLabel="Creating...">Create organization</SubmitButton>
        </form>
    );
}