import localFont from "next/font/local";

// Anton, re-fitted so it occupies the same box as the reference display face:
// size-adjust matches cap height (0.711em), the overrides reproduce its ascent/descent
// (0.722em / 0.2em), and `.display` adds -0.022em tracking to match its advance widths.
// The overrides are divided by size-adjust because Chrome scales them by it.
export const display = localFont({
  src: [
    { path: "../app/fonts/anton-latin-400-normal.woff2", weight: "400" },
    { path: "../app/fonts/anton-latin-ext-400-normal.woff2", weight: "400" },
  ],
  variable: "--font-display",
  display: "block",
  adjustFontFallback: false,
  declarations: [
    { prop: "size-adjust", value: "81.72%" },
    { prop: "ascent-override", value: "88.35%" },
    { prop: "descent-override", value: "24.47%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});
