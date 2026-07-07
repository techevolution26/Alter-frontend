import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import PrayerForm from "@/components/PrayerForm";

export default async function NewPrayerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/prayers/new");

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Share a prayer request</h1>
      <p className="mt-2 text-ink/60">Take your time. There's no wrong way to say it.</p>
      <div className="mt-8">
        <PrayerForm />
      </div>
    </div>
  );
}
