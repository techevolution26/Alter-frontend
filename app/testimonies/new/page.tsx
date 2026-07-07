import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import TestimonyForm from "@/components/TestimonyForm";

export default async function NewTestimonyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/testimonies/new");

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Share your testimony</h1>
      <p className="mt-2 text-ink/60">Tell us what changed, and how you saw it happen.</p>
      <div className="mt-8">
        <TestimonyForm />
      </div>
    </div>
  );
}
