import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RistoCare OS — Il passaporto digitale delle attrezzature del tuo locale",
  description:
    "Gestisci garanzie, manuali, matricole, ticket, manutenzioni, ricambi e interventi tecnici da un unico portale. Brand dedicato di Emotive S.r.l.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#16181d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
