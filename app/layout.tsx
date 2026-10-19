import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Motion from "@/components/kit/Motion";

const display = localFont({ src: "../public/fonts/fraunces-latin-wght-normal.woff2", variable: "--f-display", weight: "100 900", display: "swap" });
const sans = localFont({ src: "../public/fonts/geist-latin-wght-normal.woff2", variable: "--f-sans", weight: "100 900", display: "swap" });

export const metadata: Metadata = { title: "Alcove — A capsule home anywhere quiet", description: "Alcove builds off-grid capsule homes that arrive by truck and sleep two under the stars. A concept by Anorix.", openGraph: { title: "Alcove — A capsule home anywhere quiet", description: "Alcove builds off-grid capsule homes that arrive by truck and sleep two under the stars. A concept by Anorix.", type: "website" } };
export const viewport: Viewport = { themeColor: "#2f3a2c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /></head>
      <body><Motion />{children}</body>
    </html>
  );
}
