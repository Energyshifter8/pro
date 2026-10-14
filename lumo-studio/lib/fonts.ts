import localFont from "next/font/local";

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
