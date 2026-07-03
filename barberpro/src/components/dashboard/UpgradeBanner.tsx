import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export function UpgradeBanner({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-start gap-4 border-gold/30 bg-gold/5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink">
          <Crown className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg text-cream">Funzione Pro</h3>
          <p className="text-sm text-cream/60">{message}</p>
        </div>
      </div>
      <Link href="/dashboard/settings" className="btn-gold shrink-0">
        Passa a Pro <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
