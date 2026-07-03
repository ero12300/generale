import Link from "next/link";
import { Crown, Lock } from "lucide-react";

export function ProGate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--gold-deep)]/40 bg-gradient-to-br from-[var(--gold)]/10 to-transparent p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
        <Lock size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
      <Link
        href="/dashboard/abbonamento"
        className="mt-5 inline-flex items-center gap-2 rounded-xl gold-gradient px-5 py-2.5 text-sm font-semibold text-[#0b0b0f]"
      >
        <Crown size={16} /> Sblocca con Pro
      </Link>
    </div>
  );
}

export function ProBadgeInline() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-soft)]">
      <Crown size={10} /> PRO
    </span>
  );
}
