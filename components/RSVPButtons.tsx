"use client";

import { useState, useTransition } from "react";
import { rsvpAction } from "@/lib/actions";
import type { RSVPStatus } from "@/lib/types";

const OPTIONS: { value: RSVPStatus; label: string }[] = [
  { value: "going", label: "I'm going" },
  { value: "interested", label: "Interested" },
  { value: "cancelled", label: "Can't make it" },
];

export default function RSVPButtons({ eventId, signedIn }: { eventId: string; signedIn: boolean }) {
  const [selected, setSelected] = useState<RSVPStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <p className="text-sm text-ink/60">
        <a href={`/login?next=/events/${eventId}`} className="font-medium text-clay underline underline-offset-2">
          Sign in
        </a>{" "}
        to RSVP.
      </p>
    );
  }

  function handleClick(status: RSVPStatus) {
    setSelected(status);
    startTransition(async () => {
      const result = await rsvpAction(eventId, status);
      setMessage(result.error ?? result.success ?? null);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isPending}
            onClick={() => handleClick(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selected === option.value
                ? "border-ember bg-ember/15 text-clay"
                : "border-vigil/15 text-vigil hover:border-ember/60"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {message && <p className="mt-3 text-sm text-ink/60">{message}</p>}
    </div>
  );
}
