import { AppShell } from "@/components/app-shell";

const NAV = [
  { href: "/admin", label: "Dashboard KPI" },
  { href: "/admin#clienti", label: "Clienti" },
  { href: "/venditori", label: "Venditori" },
  { href: "/partner", label: "Referral" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell
      areaLabel="Admin Emotive"
      subtitle="Pannello interno Emotive S.r.l. — clienti, abbonamenti, venditori, referral (demo)"
      nav={NAV}
    >
      {children}
    </AppShell>
  );
}
