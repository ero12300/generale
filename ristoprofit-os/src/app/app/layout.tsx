import { AppShell } from "@/components/app-shell";
import { DEMO_ORG } from "@/lib/demo-data";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/food-cost", label: "Food Cost" },
  { href: "/app/ingredienti", label: "Ingredienti" },
  { href: "/app/ricette", label: "Ricette" },
  { href: "/app/menu", label: "Menu Engineering" },
  { href: "/app/fatture", label: "Fatture" },
  { href: "/app/magazzino", label: "Magazzino" },
  { href: "/app/produzione", label: "Produzione" },
  { href: "/app/personale", label: "Personale" },
  { href: "/app/report", label: "Report" },
];

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell
      areaLabel="Area cliente"
      subtitle={`${DEMO_ORG.name} · ${DEMO_ORG.location} · Piano Pro (demo)`}
      nav={NAV}
    >
      {children}
    </AppShell>
  );
}
