import { redirect } from "next/navigation";
import Link from "next/link";
import { apiFetch, getCurrentUser } from "@/lib/api";
import TestimonyForm from "@/components/TestimonyForm";
import type { PrayerRequestAttachable } from "@/lib/types";

export default async function NewTestimonyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/testimonies/new");

  const eligiblePrayers = await apiFetch<PrayerRequestAttachable[]>("/prayers/eligible-for-testimony");

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Share your testimony</h1>
      <p className="mt-2 text-ink/60">Tell us what changed, and how you saw it happen.</p>

      {eligiblePrayers.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-vigil/20 px-6 py-10 text-center">
          <p className="text-ink/70">
            Testimonies connects back to a prayer request you shared publicly or anonymously that's
            since been published.
          </p>
          <p className="mt-2 text-sm text-ink/50">
            Once one of your own public prayers is live on the wall, you'll be able to attach a
            testimony to it here.
          </p>
          <Link href="/prayers/new" className="btn-primary mt-6 inline-flex">
            Share a prayer request
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <TestimonyForm eligiblePrayers={eligiblePrayers} />
        </div>
      )}
    </div>
  );
}