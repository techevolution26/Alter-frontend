import Link from "next/link";
import { formatEventTime } from "@/lib/format";
import type { AlterEvent } from "@/lib/types";

export default function EventCard({ event }: { event: AlterEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-card border border-vigil/10 bg-white/70 p-5 transition hover:border-ember/50 hover:shadow-sm"
    >
      <span className="font-mono text-xs uppercase tracking-wide text-clay">
        {formatEventTime(event.start_time)}
      </span>
      <h3 className="mt-1 font-display text-lg text-ink">{event.title}</h3>
      {event.location && <p className="mt-1 text-sm text-ink/60">{event.location}</p>}
    </Link>
  );
}
