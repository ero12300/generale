import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortaPro — Configuratore porte su misura",
  description:
    "Dal foro muro alla porta pronta per la produzione: misure calcolate, verso DX/SX, maniglia, opzioni modello ed export scheda.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
