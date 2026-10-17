import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Тот же тёмный фон, кремовые буквы и бирюзово-золотые точки, что в opengraph-image.
export default function Icon() {
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
          gap: 4,
          background: "#14232b",
          borderRadius: 14,
          color: "#f2ead8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>TS</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === 1 ? "#d3a25f" : "#3fc3b8" }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
