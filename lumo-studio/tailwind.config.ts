import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "744px",
      tab: "768px",
      lg: "992px",
    },
    extend: {
      colors: {
        ink: "#150734",
        lilac: "#d3c5f6",
        lime: "#c2ec40",
        brandgreen: "#097140",
        pink: "#f04c8a",
        red: "#ea3323",
        blue: "#3d71ff",
        violet: "#4e00ff",
        green: "#11b04c",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sans)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Verdana", "sans-serif"],
      },
      transitionTimingFunction: {
        roll: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        bubble: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
      },
    },
  },
  plugins: [],
};
export default config;
