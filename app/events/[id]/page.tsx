import { notFound } from "next/navigation";
import { apiFetch, getCurrentUser, ApiError } from "@/lib/api";
import RSVPButtons from "@/components/RSVPButtons";
import { formatEventTime } from "@/lib/format";
import type { AlterEvent } from "@/lib/types";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  let event: AlterEvent;
  try {
    event = await apiFetch<AlterEvent>(`/events/${params.id}`, { authenticated: false });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <span className="font-mono text-xs uppercase tracking-wide text-clay">
        {formatEventTime(event.start_time)}
      </span>
      <h1 className="mt-1 font-display text-3xl italic text-ink">{event.title}</h1>
      {event.location && <p className="mt-2 text-ink/60">📍 {event.location}</p>}

      {event.description && (
        <p className="mt-6 whitespace-pre-line font-body leading-relaxed text-ink/80">
          {event.description}
        </p>
      )}

      <div className="mt-8 border-t border-vigil/10 pt-6">
        <p className="field-label">Will you be there?</p>
        <RSVPButtons eventId={event.id} signedIn={Boolean(user)} />
      </div>
    </div>
  );
}
