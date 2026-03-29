import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon (iOS закладки, часть сигналов доверия). */
export default function AppleIcon() {
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
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 800, color: "#f8fafc" }}>К</span>
          <span style={{ fontSize: 52, fontWeight: 800, color: "#ff3100" }}>М</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
