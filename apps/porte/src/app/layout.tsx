import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Configuratore Porte — Ordine produzione",
  description:
    "Configura porte da foro muro: battente, scorrevole, libro/compasso. Export ordine multi-porta per la produzione.",
  keywords: ["porte", "configuratore", "produzione", "cantiere", "serramenti"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <main className="px-4 py-6 safe-top safe-bottom md:px-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}
