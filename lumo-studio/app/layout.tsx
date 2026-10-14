import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { display } from "@/lib/fonts";
import { site } from "@/lib/olympiad";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollBar from "@/components/ScrollBar";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = { title: site.title, description: site.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={display.variable}>
      <body>
        <SmoothScroll />
        {children}
        <ScrollBar />
        <Cursor />
        <Analytics />
      </body>
    </html>
  );
}
