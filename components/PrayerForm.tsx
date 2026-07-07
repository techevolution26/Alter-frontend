"use client";

import { useFormState } from "react-dom";
import { createPrayerAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

const VISIBILITY_OPTIONS = [
  {
    value: "organization",
    label: "My community",
    hint: "Visible to people in your organization only. Published right away.",
  },
  {
    value: "public",
    label: "Everyone",
    hint: "Visible on the public wall, after a quick review.",
  },
  {
    value: "anonymous",
    label: "Anonymously, to everyone",
    hint: "Visible publicly, but your name is never attached.",
  },
] as const;

export default function PrayerForm() {
  const [state, formAction] = useFormState(createPrayerAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="content" className="field-label">
          What's on your heart?
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={3}
          maxLength={4000}
          rows={5}
          className="field-input resize-none"
          placeholder="Share as much or as little as you're comfortable with..."
        />
      </div>

      <div>
        <label htmlFor="category" className="field-label">
          Category <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <input
          id="category"
          name="category"
          type="text"
          maxLength={60}
          className="field-input"
          placeholder="e.g. health, family, provision, guidance"
        />
      </div>

      <fieldset>
        <legend className="field-label">Who can see this?</legend>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((option, index) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-vigil/15 p-3 has-[:checked]:border-ember has-[:checked]:bg-ember/5"
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                defaultChecked={index === 0}
                className="mt-1"
              />
              <span>
                <span className="block font-body text-sm font-medium text-ink">{option.label}</span>
                <span className="block text-xs text-ink/50">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-ink/40">
        Anything that suggests you're in crisis is routed straight to a member of our care team,
        not published, so someone can reach out.
      </p>

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Sharing...">Share prayer request</SubmitButton>
    </form>
  );
}
