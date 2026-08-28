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

### Deploy
Import the repo at vercel.com — framework is auto-detected, no env vars required.
