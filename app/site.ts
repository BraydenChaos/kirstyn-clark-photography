// Resolved at build time. Set NEXT_PUBLIC_SITE_URL in Vercel once the real domain
// is attached; until then preview/staging builds fall back to their own
// *.vercel.app deployment URL so og:image and canonicals are actually fetchable.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteName = "Kirstyn Jade Photography";

export const description =
  "Coming soon — wedding, elopement and portrait photography by Kirstyn Jade, based in Calgary, Alberta.";
