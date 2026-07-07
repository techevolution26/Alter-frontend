export default function Footer() {
  return (
    <footer className="border-t border-vigil/10 bg-linen">
      <div className="mx-auto max-w-5xl px-5 py-8 font-body text-sm text-ink/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base text-ink/80">Alter</p>
          <p>Rooted in scripture, working out loud in the community.</p>
        </div>
        <p className="mt-4 text-xs text-ink/40">
          If you're in crisis, please reach out to a local emergency service or crisis line right
          away — this app is a community, not an emergency response tool.
        </p>
      </div>
    </footer>
  );
}
