import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "BarberPro — Il gestionale premium per barbieri",
  description: "Gestisci prenotazioni, clienti, cassa e campagne marketing per il tuo barbershop",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body className={`${geist.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #222222",
              color: "#f5f0e8",
            },
          }}
        />
      </body>
    </html>
  );
}
