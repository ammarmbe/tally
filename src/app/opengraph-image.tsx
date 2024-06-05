import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Tally";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const interSemiBold = fetch(
    new URL("../../public/GrenzeGotisch-Medium.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 428,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          transform: "translateY(-45px)",
          color: "#005531",
        }}
      >
        T
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: await interSemiBold,
          style: "italic",
          weight: 800,
        },
      ],
    },
  );
}
