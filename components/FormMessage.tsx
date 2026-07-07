import type { ActionState } from "@/lib/actions";

export default function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg border border-clay/30 bg-clay/10 px-3.5 py-2.5 text-sm text-clay">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="rounded-lg border border-ember/40 bg-ember/10 px-3.5 py-2.5 text-sm text-ink/80">
        {state.success}
      </p>
    );
  }
  return null;
}
