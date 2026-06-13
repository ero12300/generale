import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RistoCare OS — Il passaporto digitale delle attrezzature",
    template: "%s | RistoCare OS",
  },
  description:
    "Gestisci garanzie, manuali, matricole, ticket, manutenzioni, ricambi e interventi tecnici del tuo locale food da un unico portale.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "RistoCare OS" },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
