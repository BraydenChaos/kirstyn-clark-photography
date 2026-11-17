"use server";

import { Resend } from "resend";

import { clientEmail, ownerEmail } from "./emails";
import { sessionTypes, type Field, type Inquiry, type InquiryState, type SessionType } from "./shared";

// Submissions faster than this after the dialog opened are almost certainly bots.
const MIN_FILL_MS = 2500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};

function validate(fd: FormData): { inquiry?: Inquiry; errors: Partial<Record<Field, string>> } {
  const v = {
    firstName: str(fd, "firstName"),
    lastName: str(fd, "lastName"),
    email: str(fd, "email").toLowerCase(),
    phone: str(fd, "phone"),
    sessionType: str(fd, "sessionType"),
    preferredDate: str(fd, "preferredDate"),
  };
  const errors: Partial<Record<Field, string>> = {};

  if (!v.firstName) errors.firstName = "Please enter your first name.";
  else if (v.firstName.length > 80) errors.firstName = "That's a bit long.";
  if (!v.lastName) errors.lastName = "Please enter your last name.";
  else if (v.lastName.length > 80) errors.lastName = "That's a bit long.";
  if (!EMAIL_RE.test(v.email) || v.email.length > 254) errors.email = "Please enter a valid email.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || v.phone.length > 30)
    errors.phone = "Please enter a valid phone number.";
  if (!sessionTypes.includes(v.sessionType as SessionType)) errors.sessionType = "Please choose a session type.";
  if (v.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(v.preferredDate))
    errors.preferredDate = "Please choose a valid date.";

  if (Object.keys(errors).length) return { errors };
  return { inquiry: { ...v, sessionType: v.sessionType as SessionType }, errors };
}

export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Spam checks: a honeypot field humans never see, and a minimum time to fill.
  // Bots get a fake success so they don't learn to adapt.
  const startedAt = Number(str(fd, "startedAt"));
  if (str(fd, "company") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success", firstName: str(fd, "firstName") || "there" };
  }

  const { inquiry, errors } = validate(fd);
  if (!inquiry) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: errors,
      values: Object.fromEntries(
        (["firstName", "lastName", "email", "phone", "sessionType", "preferredDate"] as const).map((k) => [k, str(fd, k)]),
      ),
    };
  }

  // dotenv strips wrapping quotes but the Vercel dashboard keeps them literally, so a
  // value pasted from .env.local arrives as "\"Name <a@b>\"". Normalise both.
  const env = (k: string) => process.env[k]?.trim().replace(/^(["'])(.*)\1$/, "$2") || undefined;
  const RESEND_API_KEY = env("RESEND_API_KEY");
  const INQUIRY_TO = env("INQUIRY_TO");
  const INQUIRY_FROM = env("INQUIRY_FROM");
  const fail = (): InquiryState => ({
    status: "error",
    message: `Sorry, something went wrong sending your inquiry. Please email ${INQUIRY_TO ?? "us"} directly.`,
    fieldErrors: {},
    values: inquiry,
  });
  if (!RESEND_API_KEY || !INQUIRY_TO || !INQUIRY_FROM) {
    console.error("[inquiry] Missing RESEND_API_KEY, INQUIRY_TO or INQUIRY_FROM");
    return fail();
  }

  const resend = new Resend(RESEND_API_KEY);
  // One token per dialog session, so a double-submit or retry doesn't send twice.
  const token = str(fd, "token").slice(0, 64) || crypto.randomUUID();

  // 1. Lead alert to Kirstyn. This one has to succeed, or we tell the visitor.
  const owner = ownerEmail(inquiry);
  const ownerRes = await resend.emails.send(
    {
      from: INQUIRY_FROM,
      to: INQUIRY_TO,
      replyTo: inquiry.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
      tags: [{ name: "type", value: "inquiry-owner" }],
    },
    { idempotencyKey: `inquiry-owner/${token}` },
  );
  if (ownerRes.error) {
    console.error("[inquiry] owner email failed", ownerRes.error);
    return fail();
  }

  // 2. Confirmation to the client. Best-effort: Kirstyn already has the lead, so a
  //    failure here (typo'd address, bounce) shouldn't show the visitor an error.
  const client = clientEmail(inquiry);
  const clientRes = await resend.emails.send(
    {
      from: INQUIRY_FROM,
      to: inquiry.email,
      replyTo: INQUIRY_TO,
      subject: client.subject,
      html: client.html,
      text: client.text,
      tags: [{ name: "type", value: "inquiry-confirmation" }],
    },
    { idempotencyKey: `inquiry-client/${token}` },
  );
  if (clientRes.error) console.error("[inquiry] confirmation email failed", clientRes.error);

  return { status: "success", firstName: inquiry.firstName };
}
