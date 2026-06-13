import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RistoCare OS — Il passaporto digitale delle attrezzature",
    template: "%s | RistoCare OS",
  },
  description:
    "Gestisci garanzie, manuali, matricole, ticket, manutenzioni, ricambi e interventi tecnici del tuo locale food da un unico portale.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/logo-mark.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "RistoCare OS" },
};

export const viewport: Viewport = {
  themeColor: "#f4f7f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${outfit.variable} ${fraunces.variable} antialiased bg-ambient`}>
        {children}
      </body>
    </html>
  );
}
