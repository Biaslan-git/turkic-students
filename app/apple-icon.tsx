import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Тот же тёмный фон, кремовые буквы и бирюзово-золотые точки, что в opengraph-image.
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
          gap: 10,
          background: "#14232b",
          borderRadius: 0,
          color: "#f2ead8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 106, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>TS</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: 999, background: i === 1 ? "#d3a25f" : "#3fc3b8" }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
