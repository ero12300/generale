"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  soon?: boolean;
}

export function AppSidebar({
  title,
  subtitle,
  items,
  homeHref,
}: {
  title: string;
  subtitle: string;
  items: NavItem[];
  homeHref: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface/50 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-border p-4">
        <Logo href={homeHref} />
        <div className="mt-4 rounded-lg border border-border bg-surface p-3">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      <nav aria-label="Navigazione" className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== homeHref && pathname.startsWith(item.href));
          if (item.soon) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-muted/50"
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">Presto</span>
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-primary/15 font-medium text-foreground" : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground">
          ← Torna al sito
        </Link>
      </div>
    </aside>
  );
}
