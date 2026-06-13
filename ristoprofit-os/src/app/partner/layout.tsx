import { AppShell } from "@/components/app-shell";
import { DEMO_PARTNER } from "@/lib/demo-data";

const NAV = [
  { href: "/partner", label: "Le mie segnalazioni" },
  { href: "/partner#nuovo-lead", label: "Nuovo lead" },
  { href: "/referral", label: "Regole programma" },
];

export default function PartnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell
      areaLabel="Portale referral"
      subtitle={`${DEMO_PARTNER.name} · codice ${DEMO_PARTNER.code} (demo)`}
      nav={NAV}
    >
      {children}
    </AppShell>
  );
}
