import Link from "next/link";
import { apiFetch } from "@/lib/api";
import PrayerCard from "@/components/PrayerCard";
import type { PrayerRequest } from "@/lib/types";

export default async function HomePage() {
  const prayers = await apiFetch<PrayerRequest[]>("/prayers?limit=50", { authenticated: false });
  const totalPrayedFor = prayers.reduce((sum, p) => sum + p.prayer_count, 0);

  return (
    <div>
      <section className="bg-vigil">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">A place to be carried</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl italic leading-tight text-linen sm:text-5xl">
            Say what's on your heart. Let others carry it with you.
          </h1>
          <p className="mt-4 max-w-lg font-body text-linen/70">
            Every request on this wall is real, and every prayer counted below is someone who
            showed up for a stranger.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/prayers/new" className="btn-primary">
              Share a prayer request
            </Link>
            <Link href="/testimonies" className="btn-secondary !border-linen/25 !text-linen hover:!bg-white/5">
              Read testimonies
            </Link>
          </div>

          {prayers.length > 0 && (
            <div className="mt-10 flex gap-8 border-t border-white/10 pt-6 font-mono text-sm text-linen/60">
              <span>
                <span className="text-lg text-ember">{prayers.length}</span> requests on the wall
              </span>
              <span>
                <span className="text-lg text-ember">{totalPrayedFor}</span> prayers lifted so far
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        {prayers.length === 0 ? (
          <div className="rounded-card border border-dashed border-vigil/20 px-6 py-16 text-center">
            <p className="font-display text-xl text-ink/70">The wall is quiet right now.</p>
            <p className="mt-2 text-ink/50">Be the first to share what's on your heart.</p>
            <Link href="/prayers/new" className="btn-primary mt-6 inline-flex">
              Share a prayer request
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
