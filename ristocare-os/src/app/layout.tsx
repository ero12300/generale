import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RistoCare OS — Il passaporto digitale delle attrezzature del tuo locale",
    template: "%s · RistoCare OS",
  },
  description:
    "RistoCare OS: gestisci garanzie, manuali, matricole, ticket, manutenzioni, ricambi e interventi tecnici del tuo ristorante da un unico portale. Brand dedicato di Emotive S.r.l.",
  applicationName: "RistoCare OS",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "RistoCare OS",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
