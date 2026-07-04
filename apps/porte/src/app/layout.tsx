import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PortaPronta — Configuratore porte per la produzione",
  description:
    "Dal foro muro alla porta pronta da produrre: misure calcolate, senso di apertura, maniglia e scheda tecnica esportabile. Ottimizzato per mobile.",
  keywords: [
    "porte",
    "configuratore porte",
    "falegnameria",
    "serramenti",
    "foro muro",
    "produzione",
  ],
  applicationName: "PortaPronta",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#c2410c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} min-h-screen`}>{children}</body>
    </html>
  );
}
