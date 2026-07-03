import { cn } from "@/lib/utils";
import Link from "next/link";

type Variant = "gold" | "outline" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  gold: "gold-gradient text-[#0b0b0f] hover:brightness-110 shadow-lg shadow-[#c9a349]/20 font-semibold",
  outline: "border border-[var(--gold-deep)] text-[var(--gold-soft)] hover:bg-[var(--gold)]/10",
  ghost: "text-foreground hover:bg-white/5",
  subtle: "bg-surface-2 text-foreground hover:bg-white/10 border border-border",
  danger: "bg-[var(--danger)]/15 text-[var(--danger)] hover:bg-[var(--danger)]/25 border border-[var(--danger)]/30",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "gold",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
