import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          background: "#14232b",
          color: "#f2ead8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
          TÜRKSOY STUDENTS
        </div>
        <div style={{ fontSize: 32, color: "#9aa9a3", maxWidth: 900, textAlign: "center" }}>
          Фестивали, стажировки и события тюркского мира — в одном месте
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: i === 1 ? "#d3a25f" : "#3fc3b8",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
