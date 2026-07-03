import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "BarberPro — Gestionale Premium per Barbieri",
  description:
    "Prenotazioni online, gestione clienti, incassi e campagne marketing per la tua barberia. Il gestionale che scala con te.",
  keywords: ["barbiere", "barberia", "prenotazioni", "gestionale", "SaaS"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-charcoal text-cream`}>
        {children}
      </body>
    </html>
  );
}
