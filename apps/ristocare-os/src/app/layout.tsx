import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RistoCare OS | Il passaporto digitale del locale food",
  description:
    "SaaS operativo per attrezzature, garanzie, ticket, ricambi e manutenzioni dei locali Ho.Re.Ca.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
