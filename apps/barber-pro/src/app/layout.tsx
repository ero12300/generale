import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: "BarberPro — Il gestionale premium per il tuo salone",
  description:
    "Prenotazioni online, CRM clienti, incassi, campagne referral e abbonamento. Tutto in un'unica app pensata per barbieri che vogliono crescere.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3100"),
  openGraph: {
    title: "BarberPro",
    description: "Gestionale premium per barbershop",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
