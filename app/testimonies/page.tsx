import Link from "next/link";
import { apiFetch } from "@/lib/api";
import TestimonyCard from "@/components/TestimonyCard";
import type { Testimony } from "@/lib/types";

export default async function TestimoniesPage() {
  const testimonies = await apiFetch<Testimony[]>("/testimonies?limit=50", { authenticated: false });

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl italic text-ink">Testimonies</h1>
          <p className="mt-2 text-ink/60">Verified stories of how this community has seen God move.</p>
        </div>
        <Link href="/testimonies/new" className="btn-primary">
          Share your testimony
        </Link>
      </div>

      {testimonies.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-vigil/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink/70">No testimonies published yet.</p>
          <p className="mt-2 text-ink/50">Yours could be the first.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {testimonies.map((t) => (
            <TestimonyCard key={t.id} testimony={t} />
          ))}
        </div>
      )}
    </div>
  );
}
