import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PortaLab — Configuratore porte per produzione",
  description:
    "Inserisci il foro muro e genera la porta pronta per la produzione: misure anta, telaio, controtelaio, verso di apertura, maniglia, oblò, display e fisso laterale.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${mono.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
