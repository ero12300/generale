import Link from "next/link";
import { Scissors } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(201,162,74,0.15),transparent_60%)]" />
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950">
            <Scissors className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg gold-shine">BarberPro</span>
        </Link>
        <div>
          <h1 className="font-display text-4xl leading-tight max-w-md">
            Il tuo salone,{" "}
            <span className="gold-shine">gestito come un marchio di lusso.</span>
          </h1>
          <p className="text-ink-400 mt-4 max-w-md">
            Prenotazioni online, CRM, incassi e referral in un'unica app.
          </p>
        </div>
        <div className="text-xs text-ink-500">© {new Date().getFullYear()} BarberPro · Made in Italy</div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
