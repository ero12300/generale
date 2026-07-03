import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { StoreProvider } from "@/lib/store/provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "BarberSuite — Gestionale premium per barberie",
  description:
    "Prenotazioni online, cassa, database clienti e campagne sconto per la tua barberia. Piani Base e Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
