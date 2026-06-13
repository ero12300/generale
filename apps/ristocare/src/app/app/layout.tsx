import Link from "next/link";
import { demoStore } from "@/lib/demoStore";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/attrezzature", label: "Attrezzature" },
  { href: "/app/ticket", label: "Ticket" },
];

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const org = demoStore.getOrganization();
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight">
              RistoCare <span className="text-gold">OS</span>
            </Link>
            <nav className="flex gap-4 text-sm" aria-label="Area cliente">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-1 font-medium text-stone-600 hover:bg-stone-100 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-sm text-warmgray">
            {org.name} · piano <span className="font-medium uppercase text-ink">{org.plan}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
