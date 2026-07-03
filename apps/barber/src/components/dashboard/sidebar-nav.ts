import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Gift,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Panoramica", icon: LayoutDashboard },
  { href: "/dashboard/prenotazioni", label: "Prenotazioni", icon: CalendarDays },
  { href: "/dashboard/clienti", label: "Clienti", icon: Users },
  { href: "/dashboard/incassi", label: "Incassi", icon: Wallet },
  { href: "/dashboard/campagne", label: "Campagne", icon: Gift },
  { href: "/dashboard/abbonamento", label: "Abbonamento", icon: CreditCard },
  { href: "/dashboard/impostazioni", label: "Impostazioni", icon: Settings },
];
