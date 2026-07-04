import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PortePro — Gestione Porte da Foro Muro",
  description:
    "Calcola porte interne da foro muro: lavoro morto, modello, apertura destra/sinistra, schema produzione SVG.",
  keywords: ["porte", "serramenti", "foro muro", "lavoro morto", "bussola", "battente"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PortePro",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} min-h-screen bg-charcoal text-cream`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
