import Link from "next/link";
import { Sparkles, ArrowRight, CalendarCheck2, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 grain">
      {/* linee decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,162,75,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,162,75,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <Badge variant="gold" className="mb-6">
              <Sparkles className="h-3 w-3" />
              Progettato per barbieri premium
            </Badge>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-ink-50 mb-6">
              Il tuo barbershop
              <br />
              <span className="text-gold-gradient italic">meritava di meglio.</span>
            </h1>

            <p className="text-lg text-ink-300 max-w-2xl mb-8 leading-relaxed">
              Prenotazioni online, database clienti, incassi e campagne{" "}
              <em className="font-display text-[color:var(--color-gold-300)] not-italic">
                porta un amico
              </em>{" "}
              — tutto in un'unica app pensata per chi vuole trasformare la
              propria bottega in un'esperienza premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button asChild size="xl">
                <Link href="/dashboard">
                  Inizia gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="secondary">
                <Link href="/b/barberia-del-corso">Vedi demo prenotazione</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-xs text-ink-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Nessuna carta di credito
              </div>
              <div>Setup in 5 minuti</div>
              <div className="hidden sm:block">Assistenza in italiano</div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-up-delay-2">
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 rounded-3xl bg-gradient-to-tr from-[color:var(--color-gold-500)]/20 via-transparent to-transparent blur-3xl"
      />

      <div className="glass-strong rounded-2xl p-6 relative shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs text-ink-400 uppercase tracking-widest">
            Oggi, 3 luglio
          </div>
          <Badge variant="gold">In diretta</Badge>
        </div>

        <div className="space-y-3">
          <MockBooking
            time="10:00"
            name="Marco Bianchi"
            service="Taglio Signature"
            status="confirmed"
          />
          <MockBooking
            time="11:15"
            name="Luca Ferrari"
            service="Taglio + Barba"
            status="confirmed"
          />
          <MockBooking
            time="14:30"
            name="Andrea Ricci"
            service="Barba tradizionale"
            status="referral"
            highlight
          />
          <MockBooking
            time="17:00"
            name="Paolo Verdi"
            service="Rituale VIP"
            status="confirmed"
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-white/5">
          <MiniStat icon={<CalendarCheck2 className="h-3.5 w-3.5" />} label="Oggi" value="7" />
          <MiniStat icon={<Users className="h-3.5 w-3.5" />} label="Clienti" value="184" />
          <MiniStat icon={<Wallet className="h-3.5 w-3.5" />} label="Incassi" value="€ 342" />
        </div>
      </div>
    </div>
  );
}

function MockBooking({
  time,
  name,
  service,
  status,
  highlight,
}: {
  time: string;
  name: string;
  service: string;
  status: "confirmed" | "referral";
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 ${
        highlight
          ? "bg-[color:var(--color-gold-500)]/10 border border-[color:var(--color-gold-500)]/30"
          : "bg-black/30 border border-white/5"
      }`}
    >
      <div className="text-sm font-medium text-[color:var(--color-gold-300)] w-14 tabular-nums font-display">
        {time}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink-50 truncate">{name}</div>
        <div className="text-xs text-ink-400 truncate">{service}</div>
      </div>
      {status === "referral" && (
        <Badge variant="gold" className="text-[10px]">
          Referral
        </Badge>
      )}
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-ink-400 text-[10px] uppercase tracking-widest mb-1">
        {icon}
        {label}
      </div>
      <div className="font-display text-xl text-ink-50">{value}</div>
    </div>
  );
}
