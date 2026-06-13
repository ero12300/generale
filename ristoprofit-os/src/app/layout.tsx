import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RistoProfit OS — Il cruscotto economico del ristoratore",
  description:
    "RistoProfit OS di Emotive S.r.l.: food cost, margini, menu engineering, fornitori e report giornalieri per ristoranti, bar, pizzerie e gelaterie.",
  manifest: "/manifest.webmanifest",
  applicationName: "RistoProfit OS",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "RistoProfit OS" },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
