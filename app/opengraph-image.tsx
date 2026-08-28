import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Kirstyn Jade Photography — wedding and portrait photography in Calgary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/photo-1.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f3ef",
          color: "#1d1a17",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#6f6659",
            }}
          >
            Coming Soon
          </div>
          <div style={{ fontSize: 86, lineHeight: 1.05, marginTop: 28 }}>Kirstyn Jade</div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: "#6f6659",
              marginTop: 16,
            }}
          >
            Photography
          </div>
          <div
            style={{
              marginTop: 40,
              width: 120,
              height: 1,
              background: "rgba(29, 26, 23, 0.25)",
            }}
          />
          <div style={{ fontSize: 28, color: "#6f6659", marginTop: 36 }}>
            Weddings &amp; elopements — Calgary, Alberta
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={470}
          height={630}
          style={{ width: 470, height: 630, objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
