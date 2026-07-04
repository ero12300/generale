import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DoorOpen, ListChecks, Plus } from "lucide-react";

import "./globals.css";

export const metadata: Metadata = {
  title: "PortePro · Configuratore porte interne",
  description:
    "App mobile per il calcolo di porte interne dal foro muro alla scheda di produzione: modello, bussola, fisso, vetro, maniglia, verso apertura.",
  applicationName: "PortePro",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
          <header className="safe-top no-print sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                  <DoorOpen size={18} />
                </span>
                <span className="text-slate-100">PortePro</span>
              </Link>
              <nav className="flex items-center gap-1">
                <Link
                  href="/ordini"
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800/60"
                >
                  <span className="inline-flex items-center gap-1">
                    <ListChecks size={16} /> Ordini
                  </span>
                </Link>
                <Link
                  href="/nuova"
                  className="ml-1 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <Plus size={16} /> Nuova
                  </span>
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 px-4 py-5">{children}</main>
          <footer className="no-print mt-auto border-t border-slate-800/60 px-4 py-4 text-center text-[11px] text-slate-500">
            PortePro · Calcoli basati su standard italiani (DM 236/1989). Sempre verificare
            tolleranze con il produttore.
          </footer>
        </div>
      </body>
    </html>
  );
}
