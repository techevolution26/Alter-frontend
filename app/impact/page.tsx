import { apiFetch } from "@/lib/api";
import { formatKes } from "@/lib/format";
import ImpactProgramCard from "@/components/ImpactProgramCard";
import type { Organization, ProgramWithStats } from "@/lib/types";

export default async function ImpactPage() {
  const [programs, organizations] = await Promise.all([
    apiFetch<ProgramWithStats[]>("/programs?limit=100", { authenticated: false }),
    apiFetch<Organization[]>("/organizations?limit=100", { authenticated: false }),
  ]);

  const totalRaised = programs.reduce((sum, p) => sum + parseFloat(p.total_raised), 0);
  const totalAllocated = programs.reduce((sum, p) => sum + parseFloat(p.total_allocated), 0);
  const activeCount = programs.filter((p) => p.status === "active").length;

  return (
    <div>
      <section className="bg-vigil">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Impact & transparency</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl italic leading-tight text-linen sm:text-5xl">
            Every shilling, accounted for.
          </h1>
          <p className="mt-4 max-w-lg font-body text-linen/70">
            What's raised and what it's put toward — real figures, computed fresh every time you
            load this page, not a static report we update once a year.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
            <div>
              <p className="font-display text-2xl text-ember sm:text-3xl">{formatKes(totalRaised)}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-linen/50">Raised</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ember sm:text-3xl">{formatKes(totalAllocated)}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-linen/50">Put to use</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ember sm:text-3xl">{activeCount}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-linen/50">Active programs</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ember sm:text-3xl">{organizations.length}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-linen/50">Partner communities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="font-display text-2xl text-ink">Where the money goes</h2>
        <p className="mt-1 text-ink/60">Tap a program for its full allocation history.</p>

        {programs.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-vigil/20 px-6 py-16 text-center">
            <p className="font-display text-xl text-ink/70">No programs yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <ImpactProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}