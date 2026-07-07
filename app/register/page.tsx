import { apiFetch } from "@/lib/api";
import RegisterForm from "@/components/RegisterForm";
import type { Organization } from "@/lib/types";

export default async function RegisterPage() {
  const organizations = await apiFetch<Organization[]>("/organizations?limit=100", {
    authenticated: false,
  }).catch(() => [] as Organization[]);

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl italic text-ink">Join Alter</h1>
      <p className="mt-2 text-ink/60">A community that shows up for each other.</p>
      <div className="mt-8">
        <RegisterForm organizations={organizations} />
      </div>
    </div>
  );
}
