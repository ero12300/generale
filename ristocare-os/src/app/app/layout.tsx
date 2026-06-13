import { AppSidebar } from "@/components/app/app-sidebar";

const CUSTOMER_NAV = [
  { href: "/app", label: "Dashboard", icon: "▦" },
  { href: "/app/attrezzature", label: "Attrezzature", icon: "❄" },
  { href: "/app/ticket", label: "Ticket", icon: "✎" },
  { href: "/app/documenti", label: "Documenti", icon: "▤", soon: true },
  { href: "/app/garanzie", label: "Garanzie", icon: "✔", soon: true },
  { href: "/app/manutenzioni", label: "Manutenzioni", icon: "⟳", soon: true },
  { href: "/app/ricambi", label: "Ricambi", icon: "⚙", soon: true },
  { href: "/app/report", label: "Report", icon: "▣", soon: true },
];

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppSidebar
        homeHref="/app"
        title="Trattoria del Porto"
        subtitle="Piano Pro · Messina"
        items={CUSTOMER_NAV}
      />
      <div className="flex-1">
        <div className="border-b border-border bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
          Modalità demo · dati in-memory di esempio (nessuna connessione Supabase)
        </div>
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </div>
    </div>
  );
}
