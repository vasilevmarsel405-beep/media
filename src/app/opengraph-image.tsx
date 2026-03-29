import { ImageResponse } from "next/og";

export const alt = "КриптоМарс Медиа";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #450a0a 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 58, fontWeight: 700, color: "#f8fafc", letterSpacing: -2 }}>КриптоМарс</span>
          <span style={{ fontSize: 58, fontWeight: 700, color: "#ff3100", letterSpacing: -2 }}>Медиа</span>
        </div>
        <p
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(248,250,252,0.88)",
            maxWidth: 920,
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          Рынки, регулирование, технологии — без лишнего шума
        </p>
      </div>
    ),
    { ...size }
  );
}
