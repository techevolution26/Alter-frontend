"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { recordAllocationAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function RecordAllocationForm({ programId }: { programId: string }) {
    const boundAction = recordAllocationAction.bind(null, programId);
    const [state, formAction] = useFormState(boundAction, {});
    const [allowOverdraw, setAllowOverdraw] = useState(false);

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

            <label className="flex cursor-pointer items-start gap-2 text-sm text-ink/70">
                <input
                    type="checkbox"
                    name="allow_overdraw"
                    checked={allowOverdraw}
                    onChange={(e) => setAllowOverdraw(e.target.checked)}
                    className="mt-0.5"
                />
                <span>
                    This exceeds the program's available balance, and that's deliberate (e.g. fronting funds
                    ahead of a pledge landing).
                </span>
            </label>

            {allowOverdraw && (
                <div>
                    <label htmlFor="justification" className="field-label">
                        Why? <span className="font-normal text-ink/40">(required — shown on the audit trail)</span>
                    </label>
                    <textarea
                        id="justification"
                        name="justification"
                        required={allowOverdraw}
                        rows={2}
                        className="field-input resize-none"
                        placeholder="e.g. Matched grant confirmed, funds land next week"
                    />
                </div>
            )}

            <FormMessage state={state} />

            <SubmitButton pendingLabel="Recording...">Record allocation</SubmitButton>
        </form>
    );
}