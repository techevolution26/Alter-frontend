// Mirrors app/schemas/*.py on the backend. Kept hand-written and minimal
// rather than codegen'd for now — see README for upgrading to a generated
// client once the API stabilizes.

export type UserRole = "member" | "field_staff" | "moderator" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string | null;
  phone_number: string | null;
  full_name: string;
  preferred_language: string;
  role: UserRole;
  is_active: boolean;
  organization_id: string | null;
}

export type PrayerVisibility = "public" | "organization" | "anonymous";
export type PrayerStatus = "pending_review" | "published" | "escalated" | "archived" | "removed";
export type RiskFlag = "none" | "review" | "crisis";

export interface PrayerRequest {
  id: string;
  content: string;
  category: string | null;
  visibility: PrayerVisibility;
  status: PrayerStatus;
  prayer_count: number;
  created_at: string;
  user_id: string | null;
  organization_id: string | null;
}

/** Only returned from staff-only endpoints (the moderation queue). */
export interface PrayerRequestModeration extends PrayerRequest {
  risk_flag: RiskFlag;
}

export type TestimonyStatus = "pending_review" | "verified" | "published" | "rejected";

export interface Testimony {
  id: string;
  title: string;
  content: string;
  status: TestimonyStatus;
  user_id: string;
  organization_id: string | null;
  created_at: string;
}

export interface AlterEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  is_recurring: boolean;
  organization_id: string | null;
  is_global: boolean;
}

export type RSVPStatus = "going" | "interested" | "cancelled";

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: RSVPStatus;
}

export interface Organization {
  id: string;
  name: string;
  type: "church" | "partner_ngo" | "community_group";
  region: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_verified_partner: boolean;
}

/** Super-admin-only view — GET /platform/organizations. */
export interface OrganizationOverview extends Organization {
  member_count: number;
  admin_count: number;
}

export type PaymentPurpose = "general_fund" | "program" | "event";
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

export interface Payment {
  id: string;
  amount: string;
  currency: string;
  purpose: PaymentPurpose;
  provider: "mpesa" | "card" | "bank_transfer";
  status: PaymentStatus;
  provider_receipt: string | null;
  created_at: string;
}

export interface MpesaStkPushResponse {
  payment_id: string;
  checkout_request_id: string;
  customer_message: string;
}

/** Shape FastAPI returns for both validation (422) and plain HTTPException errors. */
export interface ApiErrorBody {
  detail?: string | { msg: string; loc: (string | number)[] }[];
}

// --- Programs & fund allocation (super-admin writes, public reads) --------

export type ProgramStatus = "active" | "paused" | "completed" | "cancelled";

export interface Program {
  id: string;
  name: string;
  description: string;
  organization_id: string | null;
  target_amount: string | null;
  status: ProgramStatus;
  created_by_id: string;
  created_at: string;
}

/** The actual transparency-page shape — GET /programs and GET /programs/{id}. */
export interface ProgramWithStats extends Program {
  total_raised: string;
  total_allocated: string;
  balance: string;
}

export interface Allocation {
  id: string;
  program_id: string;
  amount: string;
  description: string;
  allocated_by_id: string;
  created_at: string;
}

export type AllocationKind = "disbursement" | "reversal";

export interface Allocation {
  id: string;
  program_id: string;
  amount: string;
  description: string;
  allocated_by_id: string;
  kind: AllocationKind;
  reverses_allocation_id: string | null;
  exceeded_balance_at_time: boolean;
  justification: string | null;
  created_at: string;
}

// --- Moderation (staff-only) --------------------------------------------

export type ContentType = "prayer_request" | "testimony" | "event" | "user";
export type ReportStatus = "open" | "in_review" | "resolved" | "escalated";

export interface ModerationReport {
  id: string;
  content_type: ContentType;
  content_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

/**
 * GET /prayers/eligible-for-testimony — the current user's own published,
 * publicly-visible prayers that a testimony can be attached to.
 */
export interface PrayerRequestAttachable {
  id: string;
  content: string;
  category: string | null;
  visibility: string;
  status: string;
  created_at: string;
}