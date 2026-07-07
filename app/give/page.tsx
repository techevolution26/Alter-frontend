import GivingForm from "@/components/GivingForm";

export default function GivePage() {
  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Give</h1>
      <p className="mt-2 text-ink/60">
        Every shilling goes toward a named program or the community's most pressing needs — never
        an anonymous general account.
      </p>
      <div className="mt-8">
        <GivingForm />
      </div>
    </div>
  );
}
