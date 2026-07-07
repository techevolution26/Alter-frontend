// Suppress TS error when type declarations for the side-effect import are missing
// @ts-ignore
import "server-only";

// Provide a minimal ambient declaration for environments lacking the module's types
// The real package is imported for side-effects above; skip a declaration here
// to avoid "invalid module name" augmentation issues in some TS configs.
import { getSessionToken } from "@/lib/session";
import type { ApiErrorBody, User } from "@/lib/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(body: ApiErrorBody, fallback: string): string {
  if (!body?.detail) return fallback;
  if (typeof body.detail === "string") return body.detail;
  // FastAPI validation errors: a list of {msg, loc}.
  const first = body.detail[0];
  return first?.msg ?? fallback;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach the session cookie's bearer token. Defaults to true. */
  authenticated?: boolean;
  /** Skip throwing on 401 — return null-ish caller side instead. */
  allowUnauthenticated?: boolean;
}

/**
 * Server-side only fetch wrapper. Never import this from a Client Component —
 * it reads the httpOnly session cookie directly, which is exactly the point:
 * the JWT never needs to reach browser JS at all.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, authenticated = true, allowUnauthenticated = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (authenticated) {
    const token = getSessionToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    } else if (!allowUnauthenticated) {
      throw new ApiError("Not signed in", 401);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(parsed, "Something went wrong"), response.status);
  }

  return parsed as T;
}

/** OAuth2PasswordRequestForm on the backend expects form-urlencoded, not JSON. */
export async function loginRequest(identifier: string, password: string): Promise<string> {
  const form = new URLSearchParams();
  form.set("username", identifier);
  form.set("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(parsed, "Incorrect email/phone or password"), response.status);
  }

  return parsed.access_token as string;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getSessionToken();
  if (!token) return null;
  try {
    return await apiFetch<User>("/users/me");
  } catch {
    return null;
  }
}
