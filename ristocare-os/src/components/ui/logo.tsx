import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 font-semibold", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary/60 bg-surface text-foreground">
        <span className="text-lg font-bold leading-none">R</span>
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] tracking-tight">
          RistoCare <span className="text-primary-strong">OS</span>
        </span>
        <span className="text-[10px] font-normal uppercase tracking-[0.18em] text-muted">
          by Emotive S.r.l.
        </span>
      </span>
    </Link>
  );
}
