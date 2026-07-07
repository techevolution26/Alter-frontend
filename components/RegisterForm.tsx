"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";
import type { Organization } from "@/lib/types";

export default function RegisterForm({ organizations }: { organizations: Organization[] }) {
  const [state, formAction] = useFormState(registerAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="full_name" className="field-label">
          Full name
        </label>
        <input id="full_name" name="full_name" type="text" required className="field-input" />
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email <span className="font-normal text-ink/40">(or use phone below)</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className="field-input" />
      </div>

      <div>
        <label htmlFor="phone_number" className="field-label">
          Phone number <span className="font-normal text-ink/40">(or use email above)</span>
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          autoComplete="tel"
          placeholder="0712345678"
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field-input"
        />
        <p className="mt-1 text-xs text-ink/40">At least 8 characters.</p>
      </div>

      {organizations.length > 0 && (
        <div>
          <label htmlFor="organization_id" className="field-label">
            Your church or community <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <select id="organization_id" name="organization_id" className="field-input">
            <option value="">I'm not part of one yet</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} — {org.region}
              </option>
            ))}
          </select>
        </div>
      )}

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Creating account...">Create account</SubmitButton>

      <p className="text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-clay underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
