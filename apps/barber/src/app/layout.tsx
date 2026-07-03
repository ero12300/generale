import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { DemoBadge } from "@/components/demo-badge";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rasoio — il gestionale premium del barbiere",
    template: "%s · Rasoio",
  },
  description:
    "Prenotazioni online, incassi, database clienti e campagne referral in un unico gestionale premium per barbershop.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Rasoio — il gestionale premium del barbiere",
    description:
      "Prenotazioni, incassi, CRM e referral per barbershop moderni. Prova la demo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-dvh antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
            <DemoBadge />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
