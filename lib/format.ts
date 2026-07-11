export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let value = seconds;
  for (const [size, unit] of units) {
    if (value < size) {
      const rounded = Math.floor(value);
      if (rounded <= 1 && unit === "second") return "just now";
      return `${rounded} ${unit}${rounded === 1 ? "" : "s"} ago`;
    }
    value = value / size;
  }
  return date.toLocaleDateString();
}

export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatKes(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(
    value
  );
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Guards a dynamic [id] route param before it ever reaches the API.
 * Catching HTTPException(404) alone isn't enough — a malformed UUID in the
 * path gets rejected by FastAPI's own validation as a 422, not a 404, so
 * relying only on status-code matching lets things like a stray "/new"
 * (from a stale route match) crash instead of rendering a clean 404.
 */
export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}