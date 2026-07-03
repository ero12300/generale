import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BarberPro — Gestionale premium per barbieri",
    template: "%s · BarberPro",
  },
  icons: {
    icon: "/favicon.svg",
  },
  description:
    "Il gestionale premium per il tuo barbershop: prenotazioni online, database clienti, incassi, campagne referral. Pensato per barbieri che vogliono crescere.",
  keywords: [
    "gestionale barbiere",
    "prenotazioni online barbershop",
    "software barber shop",
    "CRM barbiere",
    "porta un amico barbiere",
  ],
  openGraph: {
    title: "BarberPro — Il gestionale premium per barbieri",
    description:
      "Prenotazioni, clienti, incassi e campagne referral. Tutto in un'unica app pensata per barbieri di lusso.",
    type: "website",
    locale: "it_IT",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
