import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "monkeyread, a minimalistic, customizable speed reader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// serika dark palette.
const BG = "#323437";
const MAIN = "#e2b714";
const SUB = "#646669";
const TEXT = "#d1d0c5";

const BACKDROP =
  "reading fast is not a matter of talent but of habit when words arrive one at a time in the same spot your eyes no longer need to jump from one line to the next they stay still and your brain does the rest ".repeat(
    6,
  );

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets/RobotoMono-Regular.ttf")),
    readFile(join(process.cwd(), "assets/RobotoMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BG,
        fontFamily: "Roboto Mono",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          flexWrap: "wrap",
          overflow: "hidden",
          padding: 24,
          fontSize: 28,
          lineHeight: 1.6,
          color: SUB,
          opacity: 0.1,
        }}
      >
        {BACKDROP}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <svg
            width="128"
            height="128"
            viewBox="0 0 24 24"
            fill="none"
            stroke={MAIN}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v16" />
            <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />
          </svg>
          <span style={{ fontSize: 120, fontWeight: 700, color: TEXT, letterSpacing: -4 }}>
            monkeyread
          </span>
        </div>
        <span style={{ fontSize: 36, color: SUB }}>a minimalistic, customizable speed reader</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Roboto Mono", data: regular, weight: 400 },
        { name: "Roboto Mono", data: bold, weight: 700 },
      ],
    },
  );
}
