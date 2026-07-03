"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopData } from "@/hooks/use-shop-data";

const titles: Record<string, string> = {
  "/dashboard": "Panoramica",
  "/dashboard/prenotazioni": "Prenotazioni",
  "/dashboard/clienti": "Clienti",
  "/dashboard/incassi": "Incassi",
  "/dashboard/servizi": "Servizi",
  "/dashboard/campagne": "Campagne e referral",
  "/dashboard/abbonamento": "Abbonamento",
};

export function TopBar() {
  const pathname = usePathname();
  const { shop } = useShopData();
  const title = titles[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[color:var(--color-ink-950)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div>
          <h1 className="font-display text-2xl text-ink-50 leading-none">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={`/b/${shop.slug}`} target="_blank">
              Pagina pubblica <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="secondary" size="icon" aria-label="Notifiche">
            <Bell className="h-4 w-4" />
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard/prenotazioni?nuovo=1">
              <Plus className="h-4 w-4" /> Nuova
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
