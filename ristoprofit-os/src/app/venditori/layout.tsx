import { AppShell } from "@/components/app-shell";

const NAV = [
  { href: "/venditori", label: "Dashboard" },
  { href: "/venditori#classifica", label: "Classifica" },
  { href: "/venditori#provvigioni", label: "Piano provvigioni" },
];

export default function VenditoriLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell
      areaLabel="Area venditori"
      subtitle="Lead, trattative, provvigioni e classifica — Davide Costantino (demo)"
      nav={NAV}
    >
      {children}
    </AppShell>
  );
}
