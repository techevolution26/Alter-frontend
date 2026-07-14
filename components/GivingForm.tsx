"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { initiateDonationAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";
import ProgramPickList from "@/components/ProgramPickList";
import type { ProgramWithStats } from "@/lib/types";

const AMOUNTS = [100, 500, 1000, 2500];

export default function GivingForm({ programs }: { programs: ProgramWithStats[] }) {
  const [state, formAction] = useFormState(initiateDonationAction, {});
  const [amount, setAmount] = useState<string>("500");

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="field-label">Give towards</label>
        <ProgramPickList programs={programs} />
      </div>

      <div>
        <label className="field-label">Amount (KES)</label>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => setAmount(String(preset))}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${amount === String(preset)
                ? "border-ember bg-ember/15 text-clay"
                : "border-vigil/15 text-vigil hover:border-ember/60"
                }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
        </div>
        <input
          name="amount"
          type="number"
          min={1}
          max={150000}
          step="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="field-input mt-3"
          aria-label="Custom amount"
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="field-label">
          M-Pesa phone number
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          required
          placeholder="0712345678"
          className="field-input"
        />
      </div>

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Sending prompt...">Give via M-Pesa</SubmitButton>

      <p className="text-xs text-ink/40">
        You'll get an M-Pesa prompt on your phone to confirm. This form doesn't require an account
        — but signing in first lets you track your giving history.
      </p>
    </form>
  );
}