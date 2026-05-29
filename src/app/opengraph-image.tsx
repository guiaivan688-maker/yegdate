import { ImageResponse } from "next/og";

export const alt = "Where To Go YEG — L'agenda intelligent d'Edmonton";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Load Playfair Display Bold from a reliable CDN to match the brand serif.
  // Falls back to the default Satori font silently if the fetch fails — the image
  // still generates, just with sans-serif typography.
  let playfair: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.20/files/playfair-display-latin-700-normal.woff"
    );
    if (res.ok) playfair = await res.arrayBuffer();
  } catch {
    playfair = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #0f2341 0%, #1a365d 55%, #243f6a 100%)",
          color: "#fff8f0",
          padding: 80,
          fontFamily: playfair ? "Playfair Display" : "serif",
        }}
      >
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: "#c4a456",
            borderRadius: 2,
            marginBottom: 48,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 116,
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#fff8f0" }}>Where To Go</span>
          <span style={{ color: "#c4a456", margin: "0 20px" }}>·</span>
          <span style={{ color: "#fff8f0" }}>YEG</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 40,
            color: "rgba(255, 248, 240, 0.78)",
          }}
        >
          {"L'agenda intelligent d'Edmonton"}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 64,
            fontSize: 22,
            color: "#c4a456",
            letterSpacing: 8,
          }}
        >
          WHERETOGOYEG.CA
        </div>
      </div>
    ),
    {
      ...size,
      fonts: playfair
        ? [
            {
              name: "Playfair Display",
              data: playfair,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
