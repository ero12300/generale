import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barber Desk — Gestionale premium per barbieri",
  description:
    "Web app SaaS per prenotazioni, clienti, incassi, campagne referral e piani Basic/Pro per barber shop.",
};

export const viewport: Viewport = {
  themeColor: "#080604",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
