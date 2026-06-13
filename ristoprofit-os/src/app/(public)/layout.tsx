import Link from "next/link";

const NAV = [
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/referral", label: "Referral" },
  { href: "/demo", label: "Demo" },
];

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-white">
            Risto<span className="text-profit">Profit</span> OS
          </Link>
          <nav aria-label="Navigazione principale" className="flex items-center gap-1 sm:gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-300 hover:bg-ink-soft hover:text-white sm:block"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-lg bg-profit px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-800 bg-ink px-4 py-8 text-sm text-stone-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p>
            RistoProfit OS — Emotive S.r.l. · Messina e provincia ·{" "}
            <span className="text-stone-500">
              Parte della futura suite RistoSuite OS insieme a RistoCare OS
            </span>
          </p>
          <nav aria-label="Navigazione footer" className="flex gap-4">
            <Link href="/prezzi" className="hover:text-white">Prezzi</Link>
            <Link href="/demo" className="hover:text-white">Richiedi demo</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
