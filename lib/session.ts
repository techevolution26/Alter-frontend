import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "alter_session";

/**
 * Pulls the `exp` claim out of a JWT without verifying the signature — we're
 * not making an auth decision here, just deciding how long to keep the
 * cookie around. The backend re-verifies the signature on every request.
 */
function decodeJwtExpiry(token: string): number | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;
    const json = JSON.parse(Buffer.from(payloadSegment, "base64url").toString("utf-8"));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  const exp = decodeJwtExpiry(token);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const maxAge = exp && exp > nowSeconds ? exp - nowSeconds : 60 * 60;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function getSessionToken(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

export function clearSessionToken(): void {
  cookies().delete(COOKIE_NAME);
}
