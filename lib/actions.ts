"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, loginRequest, ApiError } from "@/lib/api";
import { setSessionToken, clearSessionToken } from "@/lib/session";
import type {
  MpesaStkPushResponse,
  PrayerStatus,
  PrayerVisibility,
  ProgramStatus,
  ReportStatus,
  RSVPStatus,
  TestimonyStatus,
  User,
} from "@/lib/types";

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

export async function submitTestimonyAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const prayerId = String(formData.get("prayer_id") ?? "").trim();

  if (!title) return { error: "Give your testimony a short title." };
  if (content.length < 10) return { error: "Tell us a bit more about what happened." };
  if (!prayerId) return { error: "Choose the prayer this testimony relates to." };

  try {
    await apiFetch("/testimonies", {
      method: "POST",
      body: { title, content, prayer_id: prayerId },
    });
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
  const program_id = String(formData.get("program_id") ?? "").trim();

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
        // program_id is the real structured link (see app/models/program.py) —
        // purpose is derived from whether one was picked, not a separate
        // field the donor fills in, so the two can never disagree.
        purpose: program_id ? "program" : "general_fund",
        program_id: program_id || null,
      },
    });
    return { success: result.customer_message };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

// --- Admin / staff (moderator, field_staff, admin roles) -------------------

/**
 * The backend takes `new_status` as a query param here (not a JSON body) —
 * see app/api/v1/endpoints/prayers.py::review_prayer. Moderator/Admin only.
 */
export async function reviewPrayerAction(prayerId: string, newStatus: PrayerStatus): Promise<ActionState> {
  try {
    await apiFetch(`/prayers/${prayerId}/review?new_status=${encodeURIComponent(newStatus)}`, {
      method: "PATCH",
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }
  revalidatePath("/admin/prayers");
  revalidatePath("/"); // publishing here can put it straight onto the public wall
  return { success: "Updated." };
}

/** Moderator, Admin, or Field Staff. */
export async function reviewTestimonyAction(
  testimonyId: string,
  statusValue: TestimonyStatus,
  notes?: string
): Promise<ActionState> {
  try {
    await apiFetch(`/testimonies/${testimonyId}/review`, {
      method: "PATCH",
      body: { status: statusValue, notes: notes || null },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }
  revalidatePath("/admin/testimonies");
  revalidatePath("/testimonies");
  return { success: "Updated." };
}

/** Moderator or Admin only. Route is /moderation-reports, not /moderation. */
export async function resolveReportAction(
  reportId: string,
  statusValue: ReportStatus,
  notes?: string
): Promise<ActionState> {
  try {
    await apiFetch(`/moderation-reports/${reportId}/resolve`, {
      method: "PATCH",
      body: { status: statusValue, resolution_notes: notes || null },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }
  revalidatePath("/admin/reports");
  return { success: "Resolved." };
}

/** Field Staff or Admin only — Moderator cannot create events (matches the backend). */
export async function createEventAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const organization_id = String(formData.get("organization_id") ?? "").trim();
  const start_time = String(formData.get("start_time") ?? "");
  const end_time = String(formData.get("end_time") ?? "");

  if (!title || !organization_id || !start_time) {
    return { error: "Title, organization, and a start time are required." };
  }

  try {
    await apiFetch("/events", {
      method: "POST",
      body: {
        title,
        description: description || null,
        location: location || null,
        organization_id,
        // datetime-local inputs have no timezone — treat as the server's
        // local time by sending as-is; for a real pilot this should be
        // adjusted to the org's actual timezone rather than assumed.
        start_time: new Date(start_time).toISOString(),
        end_time: end_time ? new Date(end_time).toISOString() : null,
      },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/events");
  redirect("/events");
}

// --- Platform / super-admin (strictly separate from moderator/admin) -------
// Organizations & role assignment, programs & fund allocation, global events.

export async function createOrganizationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "church");
  const region = String(formData.get("region") ?? "").trim();
  const contact_email = String(formData.get("contact_email") ?? "").trim();
  const contact_phone = String(formData.get("contact_phone") ?? "").trim();

  if (!name || !region) {
    return { error: "Name and region are required." };
  }

  try {
    await apiFetch("/organizations", {
      method: "POST",
      body: {
        name,
        type,
        region,
        contact_email: contact_email || null,
        contact_phone: contact_phone || null,
      },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/platform/organizations");
  redirect("/platform/organizations");
}

/**
 * Looks the person up by email/phone, then assigns the role in one step —
 * a raw user_id field would be unusable, nobody has UUIDs memorized.
 */
export async function assignRoleByIdentifierAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const organization_id = String(formData.get("organization_id") ?? "").trim();

  if (!identifier || !role) {
    return { error: "Enter the person's email or phone number and choose a role." };
  }

  try {
    const user = await apiFetch<User>(
      `/platform/users/lookup?identifier=${encodeURIComponent(identifier)}`
    );
    const updated = await apiFetch<User>("/platform/role-assignments", {
      method: "POST",
      body: { user_id: user.id, role, organization_id: organization_id || null },
    });
    return { success: `${updated.full_name} is now ${updated.role.replace("_", " ")}.` };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}

export async function createProgramAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const organization_id = String(formData.get("organization_id") ?? "").trim();
  const target_amount = String(formData.get("target_amount") ?? "").trim();

  if (!name || !description) {
    return { error: "Name and description are required." };
  }

  try {
    await apiFetch("/programs", {
      method: "POST",
      body: {
        name,
        description,
        organization_id: organization_id || null,
        target_amount: target_amount || null,
      },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/platform/programs");
  redirect("/platform/programs");
}

export async function updateProgramStatusAction(
  programId: string,
  status: ProgramStatus
): Promise<ActionState> {
  try {
    await apiFetch(`/programs/${programId}`, { method: "PATCH", body: { status } });
  } catch (err) {
    return { error: errorMessage(err) };
  }
  revalidatePath(`/platform/programs/${programId}`);
  revalidatePath("/platform/programs");
  return { success: "Status updated." };
}

/**
 * Bind the programId first: `recordAllocationAction.bind(null, programId)`
 * gives useFormState the (prevState, formData) signature it expects.
 */
export async function recordAllocationAction(
  programId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const amount = String(formData.get("amount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const allow_overdraw = formData.get("allow_overdraw") === "on";
  const justification = String(formData.get("justification") ?? "").trim();

  if (!amount || !description) {
    return { error: "Amount and a description are required." };
  }
  if (allow_overdraw && !justification) {
    return {
      error:
        "A justification is required to record an allocation that exceeds the available balance.",
    };
  }

  try {
    await apiFetch(`/programs/${programId}/allocations`, {
      method: "POST",
      body: {
        amount,
        description,
        allow_overdraw,
        justification: justification || null,
      },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath(`/platform/programs/${programId}`);
  return { success: "Allocation recorded." };
}

/** Platform-wide event — organization_id is always omitted. Field
 * staff/admin org events still go through createEventAction above; this
 * is the super-admin-only counterpart. */
export async function createGlobalEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const start_time = String(formData.get("start_time") ?? "");
  const end_time = String(formData.get("end_time") ?? "");

  if (!title || !start_time) {
    return { error: "Title and a start time are required." };
  }

  try {
    await apiFetch("/events", {
      method: "POST",
      body: {
        title,
        description: description || null,
        location: location || null,
        organization_id: null,
        start_time: new Date(start_time).toISOString(),
        end_time: end_time ? new Date(end_time).toISOString() : null,
      },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath("/events");
  redirect("/events");
}


/** Corrects a prior disbursement via a linked reversal entry — never edits
 * or deletes the original row. See app/services/ledger.py. */
export async function reverseAllocationAction(
  programId: string,
  allocationId: string,
  reason: string
): Promise<ActionState> {
  if (!reason.trim()) {
    return { error: "A reason is required to reverse an allocation." };
  }

  try {
    await apiFetch(`/programs/${programId}/allocations/${allocationId}/reverse`, {
      method: "POST",
      body: { reason },
    });
  } catch (err) {
    return { error: errorMessage(err) };
  }

  revalidatePath(`/platform/programs/${programId}`);
  return { success: "Allocation reversed." };
}