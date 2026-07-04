import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "PorteForge — Configuratore porte da produzione",
  description:
    "App mobile per il rilievo del vano murario e il calcolo automatico di controtelaio, luce di passaggio e anta. Configura modello, mano, verso, bussola, fisso, specchiatura e ovale. Esporta scheda tecnica pronta per la produzione.",
  keywords: [
    "porte interne",
    "configuratore porte",
    "vano murario",
    "controtelaio",
    "produzione porte",
    "scheda tecnica",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-canvas text-ink`}>
        {children}
      </body>
    </html>
  );
}
