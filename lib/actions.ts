"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, loginRequest, ApiError } from "@/lib/api";
import { setSessionToken, clearSessionToken } from "@/lib/session";
import type { MpesaStkPushResponse, PrayerVisibility, RSVPStatus } from "@/lib/types";

export interface ActionState {
  error?: string;
  success?: string;
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : GENERIC_ERROR;
}

// --- Auth ---------------------------------------------------------------

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Enter your email or phone number and your password." };
  }

  try {
    const token = await loginRequest(identifier, password);
    setSessionToken(token);
  } catch (err) {
    return { error: errorMessage(err) };
  }

  redirect("/");
}

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone_number = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const organization_id = String(formData.get("organization_id") ?? "").trim();

  if (!full_name || (!email && !phone_number) || !password) {
    return { error: "Name, either an email or phone number, and a password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    await apiFetch("/auth/register", {
      method: "POST",
      authenticated: false,
      body: {
        full_name,
        email: email || null,
        phone_number: phone_number || null,
        password,
        organization_id: organization_id || null,
      },
    });
    const token = await loginRequest(email || phone_number, password);
    setSessionToken(token);
  } catch (err) {
    return { error: errorMessage(err) };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  clearSessionToken();
  redirect("/login");
}

// --- Prayers --------------------------------------------------------------

export async function createPrayerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "organization") as PrayerVisibility;

  if (content.length < 3) {
    return { error: "Say a little more about what you'd like prayer for." };
  }

  try {
    await apiFetch("/prayers", {
      method: "POST",
      body: { content, category: category || null, visibility },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/");
  redirect("/");
}

export async function prayForRequestAction(formData: FormData): Promise<void> {
  const prayerId = String(formData.get("prayer_id") ?? "");
  if (!prayerId) return;

  try {
    await apiFetch(`/prayers/${prayerId}/pray`, { method: "POST" });
  } catch {
    // Praying for someone is low-stakes; fail silently rather than
    // interrupting the wall with an error banner. The count simply won't
    // tick up, and the person can try again.
  }
  revalidatePath("/");
}

// --- Testimonies ------------------------------------------------------------

export async function submitTestimonyAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title) return { error: "Give your testimony a short title." };
  if (content.length < 10) return { error: "Tell us a bit more about what happened." };

  try {
    await apiFetch("/testimonies", { method: "POST", body: { title, content } });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/testimonies");
  redirect("/testimonies");
}

// --- Events -----------------------------------------------------------------

export async function rsvpAction(eventId: string, status: RSVPStatus): Promise<ActionState> {
  try {
    await apiFetch(`/events/${eventId}/rsvp`, { method: "POST", body: { status } });
  } catch (err) {
    return { error: errorMessage(err) };
  }
  revalidatePath(`/events/${eventId}`);
  return { success: "You're on the list." };
}

// --- Giving -------------------------------------------------------------

export async function initiateDonationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const phone_number = String(formData.get("phone_number") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "general_fund");
  const purpose_reference = String(formData.get("purpose_reference") ?? "").trim();

  if (!phone_number || !amount) {
    return { error: "Enter the M-Pesa phone number and an amount." };
  }

  try {
    const result = await apiFetch<MpesaStkPushResponse>("/payments/mpesa/stkpush", {
      method: "POST",
      authenticated: true,
      allowUnauthenticated: true,
      body: {
        phone_number,
        amount,
        purpose,
        purpose_reference: purpose_reference || null,
      },
    });
    return { success: result.customer_message };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}
