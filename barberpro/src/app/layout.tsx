import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BarberPro — Il gestionale premium per barbieri",
  description:
    "Prenotazioni online, database clienti, gestione incassi e campagne marketing. Tutto in un'unica app elegante per il tuo salone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${sans.variable} ${display.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
