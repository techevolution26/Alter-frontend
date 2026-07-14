import { apiFetch } from "@/lib/api";
import GivingForm from "@/components/GivingForm";
import type { ProgramWithStats } from "@/lib/types";

export default async function GivePage() {
  const allPrograms = await apiFetch<ProgramWithStats[]>("/programs?limit=100", {
    authenticated: false,
  });
  const activePrograms = allPrograms.filter((p) => p.status === "active");

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Give</h1>
      <p className="mt-2 text-ink/60">
        Every shilling goes toward a program you can see and track — never an anonymous general
        account.
      </p>
      <div className="mt-8">
        <GivingForm programs={activePrograms} />
      </div>
    </div>
  );
}