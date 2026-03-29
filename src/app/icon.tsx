import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon для вкладки и JSON-LD logo (Google/Yandex). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ff3100",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: -0.5,
        }}
      >
        КМ
      </div>
    ),
    { ...size }
  );
}
