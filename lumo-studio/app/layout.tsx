import type { Metadata } from "next";
import "@fontsource/anton/400.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";


export const metadata: Metadata = {
  title: "Lumo Studio — Design & Web Development That Sells",
  description: "Websites people trust. Designed to sell.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
