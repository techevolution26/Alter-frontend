"use client";

import { useFormState } from "react-dom";
import { createGlobalEventAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function CreateGlobalEventForm() {
  const [state, formAction] = useFormState(createGlobalEventAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="field-label">
          Title
        </label>
        <input id="title" name="title" type="text" required maxLength={200} className="field-input" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start_time" className="field-label">
            Starts
          </label>
          <input id="start_time" name="start_time" type="datetime-local" required className="field-input" />
        </div>
        <div>
          <label htmlFor="end_time" className="field-label">
            Ends <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input id="end_time" name="end_time" type="datetime-local" className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="field-label">
          Location <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <input id="location" name="location" type="text" maxLength={255} className="field-input" />
      </div>

      <div>
        <label htmlFor="description" className="field-label">
          Description <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea id="description" name="description" rows={4} className="field-input resize-none" />
      </div>

      <p className="text-xs text-ink/40">
        This publishes as a platform-wide event, visible to every organization — not scoped to
        any single one.
      </p>

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Creating...">Create global event</SubmitButton>
    </form>
  );
}