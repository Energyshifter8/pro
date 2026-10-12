import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B0B3F",
        ink2: "#2A1660",
        lav: "#D9CCFF",
        lav2: "#C4B2FF",
        lime: "#C8F53C",
        tomato: "#F2452E",
        sun: "#FFD23F",
        cream: "#F7F3FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        spin: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "spin-slow": "spin 14s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
