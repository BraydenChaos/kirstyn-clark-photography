# kirstyn-jade-photography

## Kirstyn Jade Photography — coming soon page

Next.js (App Router) + React, no database. Deploys to Vercel as-is.

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

### Content
- Photos, logo, favicon and web clip live in `public/images/`.
- `app/icon.png` (favicon, 32x32) and `app/apple-icon.png` (web clip, 256x256) are copies of those files — Next's file conventions emit the `<link>` tags automatically. If either changes, recopy it.
- Copy, email and Instagram link are consts at the top of [app/page.tsx](app/page.tsx). Both are placeholders and need real values.
- The logo is white-on-transparent, so the palette in [app/globals.css](app/globals.css) is dark. Going light would need an inverted logo.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the live domain (used for Open Graph URLs).

### Inquiry form
The **Inquire** button opens a dialog ([app/InquiryForm.tsx](app/InquiryForm.tsx)) that posts to a Server Action ([app/inquire/actions.ts](app/inquire/actions.ts)). It sends two emails through Resend from `mail.kirstynjadephotography.com`:
1. **Lead alert → Kirstyn** (`INQUIRY_TO`), with Reply-To set to the client. If this fails, the visitor sees an error.
2. **Confirmation → client**, with Reply-To set to Kirstyn. This one is best-effort and only logged on failure.

Email copy lives in [app/inquire/emails.ts](app/inquire/emails.ts). Spam is handled by a honeypot field plus a minimum fill time.

Required env vars (local: `.env.local`; prod: Vercel): `RESEND_API_KEY`, `INQUIRY_TO`, `INQUIRY_FROM`.

### Deploy
Import the repo at vercel.com — framework is auto-detected. Add the three inquiry env vars above.
