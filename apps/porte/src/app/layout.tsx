import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PortaCalc — Configuratore porte per la produzione",
  description:
    "Inserisci il foro muro e ottieni le misure di controtelaio, telaio e anta pronte per la produzione, con verso di apertura e schema esportabile.",
  keywords: ["porte", "configuratore", "foro muro", "controtelaio", "produzione", "serramenti"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
