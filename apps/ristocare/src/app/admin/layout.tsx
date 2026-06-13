import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Centrale operativa" },
  { href: "/admin/tecnici", label: "Tecnici partner" },
  { href: "/admin/referral", label: "Referral" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-stone-700 bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight">
              RistoCare <span className="text-gold">OS</span>
            </Link>
            <nav className="flex gap-4 text-sm" aria-label="Area admin">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-1 font-medium text-stone-300 hover:bg-ink-soft hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
            Solo operatori RistoCare
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
