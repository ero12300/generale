import { AppSidebar } from "@/components/app/app-sidebar";

const OPERATOR_NAV = [
  { href: "/admin", label: "Centrale operativa", icon: "◉" },
  { href: "/admin/ticket", label: "Ticket", icon: "✎" },
  { href: "/admin/tecnici", label: "Tecnici", icon: "⚒" },
  { href: "/admin/referral", label: "Referral", icon: "✦" },
];

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppSidebar
        homeHref="/admin"
        title="RistoCare · Operatore"
        subtitle="Centrale operativa Messina"
        items={OPERATOR_NAV}
      />
      <div className="flex-1">
        <div className="border-b border-border bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
          Modalità demo · vista interna RistoCare (margini visibili solo agli operatori)
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </div>
    </div>
  );
}
