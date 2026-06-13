import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RistoProfit OS — Il cruscotto economico del ristoratore",
    template: "%s | RistoProfit OS",
  },
  description:
    "Controlla food cost, margini e gestione del tuo ristorante da un'unica dashboard. Emotive S.r.l.",
  manifest: "/manifest.webmanifest",
  applicationName: "RistoProfit OS",
};

export const viewport: Viewport = {
  themeColor: "#16181d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
