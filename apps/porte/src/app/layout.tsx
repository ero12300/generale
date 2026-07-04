import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PortaLab — Configuratore porte per la produzione",
  description:
    "Inserisci il foro muro e ottieni la porta calcolata pronta per la produzione: luce di passaggio, anta, verso di apertura, maniglia, sopraluce, anta fissa, oblò e schema tecnico esportabile.",
  keywords: ["porte", "configuratore", "produzione", "falegnameria", "foro muro", "anta", "battente"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} min-h-screen`}>{children}</body>
    </html>
  );
}
