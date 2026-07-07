import { apiFetch } from "@/lib/api";
import EventCard from "@/components/EventCard";
import type { AlterEvent } from "@/lib/types";

export default async function EventsPage() {
  const events = await apiFetch<AlterEvent[]>("/events?limit=50", { authenticated: false });

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl italic text-ink">Upcoming events</h1>
      <p className="mt-2 text-ink/60">Gatherings from churches and partners in the community.</p>

      {events.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-vigil/20 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink/70">Nothing on the calendar just yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
