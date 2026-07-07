"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/lib/actions";
import SubmitButton from "@/components/SubmitButton";
import FormMessage from "@/components/FormMessage";

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="identifier" className="field-label">
          Email or phone number
        </label>
        <input id="identifier" name="identifier" type="text" required autoComplete="username" className="field-input" />
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
          autoComplete="current-password"
          className="field-input"
        />
      </div>

      <FormMessage state={state} />

      <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>

      <p className="text-sm text-ink/60">
        New here?{" "}
        <Link href="/register" className="font-medium text-clay underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </form>
  );
}
