"use client";

import { useFormState } from "react-dom";
import { recordAllocationAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function RecordAllocationForm({ programId }: { programId: string }) {
    const boundAction = recordAllocationAction.bind(null, programId);
    const [state, formAction] = useFormState(boundAction, {});

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="amount" className="field-label">
                    Amount (KES)
                </label>
                <input id="amount" name="amount" type="number" min={1} step="1" required className="field-input" />
            </div>

            <div>
                <label htmlFor="description" className="field-label">
                    What was it used for?
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={2}
                    className="field-input resize-none"
                    placeholder="e.g. Rent assistance for 3 families"
                />
                <p className="mt-1 text-xs text-ink/40">
                    This is public. Keep it aggregate — never a beneficiary's name or identifying detail.
                </p>
            </div>

            <FormMessage state={state} />

            <SubmitButton pendingLabel="Recording...">Record allocation</SubmitButton>
        </form>
    );
}