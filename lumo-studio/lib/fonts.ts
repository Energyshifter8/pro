import localFont from "next/font/local";

// Fira Sans Extra Condensed Black (from @fontsource/fira-sans-extra-condensed), fitted to the
// box the display glyph slots were measured in: its cap height already matches (0.703em), so
// only ascent/descent are overridden to 0.722em / 0.2em — the line box the inline glyphs and
// line reveals assume (baseline = line-height / 2 + 0.261em). Latin + Cyrillic (incl. Ө Ү from
// cyrillic-ext); the face has no ₮, which falls back to the body face, Manrope (see `.display`).
export const display = localFont({
  src: [
    { path: "../node_modules/@fontsource/fira-sans-extra-condensed/files/fira-sans-extra-condensed-latin-900-normal.woff2", weight: "900" },
    { path: "../node_modules/@fontsource/fira-sans-extra-condensed/files/fira-sans-extra-condensed-cyrillic-900-normal.woff2", weight: "900" },
    { path: "../node_modules/@fontsource/fira-sans-extra-condensed/files/fira-sans-extra-condensed-cyrillic-ext-900-normal.woff2", weight: "900" },
  ],
  variable: "--font-display",
  display: "block",
  adjustFontFallback: false,
  declarations: [
    { prop: "ascent-override", value: "72.2%" },
    { prop: "descent-override", value: "20%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});
