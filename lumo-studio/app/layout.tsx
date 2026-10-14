import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";
import { display } from "@/lib/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollBar from "@/components/ScrollBar";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Sys&CoTech клуб — Программчлалын олимпиад 2025",
  description: "Sys&CoTech клуб: итгэл төрүүлж, ашиг авчирдаг вэбсайт. Программчлалын олимпиад 2025 — авьяасаа дэлгэрүүлж, мэдлэгээ батлах боломж.",
};

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
