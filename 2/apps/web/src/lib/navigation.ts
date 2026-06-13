import {
  BarChart3,
  ChefHat,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import type { NavItem } from "@/components/layout/app-shell";

export const customerNav: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/ricette", label: "Ricette", icon: ChefHat },
  { href: "/app/ingredienti", label: "Ingredienti", icon: Wheat },
  { href: "/app/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/app/fatture", label: "Fatture", icon: FileText },
  { href: "/app/magazzino", label: "Magazzino", icon: Package },
  { href: "/app/produzione", label: "Produzione", icon: ShoppingCart },
  { href: "/app/personale", label: "Personale", icon: Users },
  { href: "/app/report", label: "Report", icon: BarChart3 },
  { href: "/app/fornitori", label: "Fornitori", icon: Truck },
  { href: "/app/impostazioni", label: "Impostazioni", icon: Settings },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clienti", label: "Clienti", icon: Users },
  { href: "/admin/abbonamenti", label: "Abbonamenti", icon: ClipboardList },
  { href: "/admin/venditori", label: "Venditori", icon: BarChart3 },
];

export const salesNav: NavItem[] = [
  { href: "/sales/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sales/lead", label: "Lead", icon: ClipboardList },
];

export const referralNav: NavItem[] = [
  { href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partner/lead", label: "Segnalazioni", icon: FileText },
];
