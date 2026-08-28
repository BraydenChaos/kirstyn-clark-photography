import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = "Kirstyn Jade Photography";
const description =
  "Coming soon — wedding, elopement and portrait photography by Kirstyn Jade, based in Calgary, Alberta.";

// Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is attached.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kirstynjadephotography.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteName} — Coming Soon`,
  description,
  openGraph: {
    title: siteName,
    description,
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
