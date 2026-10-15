import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { display } from "@/lib/fonts";
import { site } from "@/lib/olympiad";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollBar from "@/components/ScrollBar";
import Cursor from "@/components/Cursor";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  // config icons replace the auto-detected app/icon.png link, so list it explicitly
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={display.variable}>
      <body>
        <SmoothScroll />
        {children}
        <ScrollBar />
        <Cursor />
        {/* Vercel Analytics' script only exists on Vercel; elsewhere (Firebase Hosting) it would 404 */}
        {process.env.VERCEL ? <Analytics /> : null}
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
