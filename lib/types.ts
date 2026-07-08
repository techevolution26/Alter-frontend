// Mirrors app/schemas/*.py on the backend. Kept hand-written and minimal
// rather than codegen'd for now — see README for upgrading to a generated
// client once the API stabilizes.

export type UserRole = "member" | "field_staff" | "moderator" | "admin";

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
export type PrayerRiskFlag = "none" | "review" | "crisis";

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

export interface PrayerRequestModeration extends PrayerRequest {
  risk_flag: PrayerRiskFlag;
}

export type TestimonyStatus = "pending_review" | "verified" | "published" | "rejected";

export type Testimony = {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  prayer_id?: string | null;
  prayer?: {
    id: string;
    content: string;
    category?: string | null;
  } | null;
};

export interface AlterEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  is_recurring: boolean;
  organization_id: string;
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