import type { Inquiry } from "./shared";

// Plain table-based HTML: renders consistently in Gmail/Outlook/Apple Mail without a
// templating dependency. Every user-supplied value goes through esc().

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** "2027-06-12" -> "Saturday, June 12, 2027". UTC so the date never shifts a day. */
export function formatDate(iso: string): string {
  if (!iso) return "Not decided yet";
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
}

const font = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

function layout(inner: string, preheader: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f3ef;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ef;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(29,26,23,0.12);">
<tr><td style="padding:36px 36px 8px;text-align:center;font-family:${font};color:#1d1a17;">
<div style="font-size:26px;line-height:1.1;">Kirstyn Jade</div>
<div style="font-family:${sans};font-size:10px;letter-spacing:0.45em;text-transform:uppercase;color:#6f6659;margin-top:8px;">Photography</div>
</td></tr>
<tr><td style="padding:24px 36px 36px;font-family:${font};font-size:16px;line-height:1.6;color:#1d1a17;">
${inner}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function detailsTable(i: Inquiry): string {
  const rows: [string, string][] = [
    ["Name", `${i.firstName} ${i.lastName}`],
    ["Email", i.email],
    ["Phone", i.phone],
    ["Session", i.sessionType],
    ["Preferred date", formatDate(i.preferredDate)],
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(29,26,23,0.12);margin:20px 0;">
${rows
  .map(
    ([k, v]) => `<tr>
<td style="padding:10px 12px 10px 0;border-bottom:1px solid rgba(29,26,23,0.12);font-family:${sans};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6f6659;white-space:nowrap;vertical-align:top;">${esc(k)}</td>
<td style="padding:10px 0;border-bottom:1px solid rgba(29,26,23,0.12);font-size:16px;color:#1d1a17;">${esc(v)}</td>
</tr>`,
  )
  .join("\n")}
</table>`;
}

function detailsText(i: Inquiry): string {
  return [
    `Name: ${i.firstName} ${i.lastName}`,
    `Email: ${i.email}`,
    `Phone: ${i.phone}`,
    `Session: ${i.sessionType}`,
    `Preferred date: ${formatDate(i.preferredDate)}`,
  ].join("\n");
}

/** Lead alert to Kirstyn. Reply-To is the client, so hitting Reply answers them directly. */
export function ownerEmail(i: Inquiry) {
  const when = i.preferredDate ? ` · ${formatDate(i.preferredDate)}` : "";
  const subject = `New ${i.sessionType} inquiry: ${i.firstName} ${i.lastName}${when}`;
  const inner = `<p style="margin:0 0 4px;">New inquiry from the website.</p>
<p style="margin:0;color:#6f6659;font-size:15px;">Reply to this email to answer ${esc(i.firstName)} directly.</p>
${detailsTable(i)}`;
  return {
    subject,
    html: layout(inner, `${i.sessionType} inquiry from ${i.firstName} ${i.lastName}`),
    text: `New inquiry from the website. Reply to this email to answer ${i.firstName} directly.\n\n${detailsText(i)}\n`,
  };
}

/** Confirmation to the client. Reply-To is Kirstyn's inbox. */
export function clientEmail(i: Inquiry) {
  const subject = "Thanks for your inquiry: Kirstyn Jade Photography";
  // TODO(copy): have Kirstyn review/replace this wording and the response-time promise.
  const inner = `<p style="margin:0 0 16px;">Hi ${esc(i.firstName)},</p>
<p style="margin:0 0 16px;">Thank you so much for reaching out! I've received your inquiry and I'll be in touch within 48 hours to chat about your ${esc(i.sessionType.toLowerCase())} session.</p>
<p style="margin:0 0 4px;">Here's what you sent me:</p>
${detailsTable(i)}
<p style="margin:0 0 16px;">If anything changes in the meantime, just reply to this email.</p>
<p style="margin:0;">Talk soon,<br>Kirstyn</p>`;
  return {
    subject,
    html: layout(inner, "I've received your inquiry and will be in touch within 48 hours."),
    text: `Hi ${i.firstName},

Thank you so much for reaching out! I've received your inquiry and I'll be in touch within 48 hours to chat about your ${i.sessionType.toLowerCase()} session.

Here's what you sent me:

${detailsText(i)}

If anything changes in the meantime, just reply to this email.

Talk soon,
Kirstyn
`,
  };
}
