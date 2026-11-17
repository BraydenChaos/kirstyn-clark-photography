// Shared between the client form and the server action, so no server-only imports here.

export const sessionTypes = [
  "Engagement",
  "Lifestyle",
  "Wedding",
  "Family",
  "Maternity/Newborn",
  "Branding",
] as const;

export type SessionType = (typeof sessionTypes)[number];

export type Inquiry = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sessionType: SessionType;
  /** YYYY-MM-DD from <input type="date">, or "" if left blank. */
  preferredDate: string;
};

export type Field = keyof Inquiry;

export type InquiryState =
  | { status: "idle" }
  | { status: "success"; firstName: string }
  | {
      status: "error";
      message: string;
      fieldErrors: Partial<Record<Field, string>>;
      values: Partial<Record<Field, string>>;
    };
