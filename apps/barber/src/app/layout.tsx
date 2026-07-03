import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberOS — Il gestionale premium per barbershop",
  description:
    "Prenotazioni online, incassi, clienti e campagne sconto in un'unica piattaforma elegante per il tuo barbershop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${manrope.variable} ${playfair.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
