import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";
import { display } from "@/lib/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollBar from "@/components/ScrollBar";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Lumo Studio — Design & Web Development That Sells",
  description: "Websites people trust. Designed to sell.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
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
