import { listServices } from "@/lib/data/repo";
import { ServicesView } from "@/components/services/ServicesView";

export default async function ServiziPage() {
  const services = await listServices();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Servizi</h1>
        <p className="text-ink-400 text-sm mt-1">
          Il tuo listino: nomi, durate e prezzi. Modifica in qualsiasi momento.
        </p>
      </div>
      <ServicesView initial={services} />
    </div>
  );
}
