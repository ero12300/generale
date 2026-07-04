import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Porte — Configuratore per Produzione",
  description:
    "Configuratore mobile per porte interne. Dal foro muro alla scheda tecnica: calcolo automatico di anta, telaio, controtelaio, sopraluce, verso di apertura.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${manrope.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
