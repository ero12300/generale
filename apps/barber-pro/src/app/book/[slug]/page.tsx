import { notFound } from "next/navigation";
import { getShopBySlug, listServices, listStaff } from "@/lib/data/repo";
import { PublicBookingForm } from "@/components/booking/PublicBookingForm";
import { Scissors, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default async function PublicBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const shop = await getShopBySlug(slug);
  if (!shop) return notFound();
  const [services, staff] = await Promise.all([listServices(shop.id), listStaff(shop.id)]);

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5 bg-ink-950/70 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950">
              <Scissors className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base gold-shine">BarberPro</span>
          </Link>
          <span className="text-xs text-ink-500">Prenotazione ufficiale</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold-400)] mb-2">Salone</div>
          <h1 className="font-display text-4xl">{shop.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-400">
            {shop.address ? (
              <div className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{shop.address}</div>
            ) : null}
            {shop.phone ? (
              <div className="inline-flex items-center gap-1.5"><Phone className="w-4 h-4" />{shop.phone}</div>
            ) : null}
          </div>
        </header>

        <PublicBookingForm shopId={shop.id} services={services} staff={staff} referralCode={ref ?? ""} />
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-ink-500">
        Pagina di prenotazione gestita con{" "}
        <Link href="/" className="text-[color:var(--color-gold-400)] hover:underline">BarberPro</Link>
      </footer>
    </div>
  );
}
