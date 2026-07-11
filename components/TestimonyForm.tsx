"use client";

import { useFormState } from "react-dom";
import { submitTestimonyAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";
import type { PrayerRequestAttachable } from "@/lib/types";

export default function TestimonyForm({
  eligiblePrayers,
}: {
  eligiblePrayers: PrayerRequestAttachable[];
}) {
  const [state, formAction] = useFormState(submitTestimonyAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="prayer_id" className="field-label">
          Which prayer request is this about?
        </label>
        <select id="prayer_id" name="prayer_id" required className="field-input">
          <option value="">Select one...</option>
          {eligiblePrayers.map((prayer) => (
            <option key={prayer.id} value={prayer.id}>
              {prayer.content.length > 80 ? `${prayer.content.slice(0, 80)}...` : prayer.content}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="field-label">
          Give it a short title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          className="field-input"
          placeholder="e.g. Provision for rent, right on time"
        />
      </div>

      <div>
        <label htmlFor="content" className="field-label">
          What happened?
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={6000}
          rows={8}
          className="field-input resize-none"
        />
      </div>

      <p className="text-xs text-ink/40">
        A member of our field team reviews and verifies testimonies before they're published, so
        every story on the wall is one we can stand behind.
      </p>

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Submitting...">Submit for review</SubmitButton>
    </form>
  );
}