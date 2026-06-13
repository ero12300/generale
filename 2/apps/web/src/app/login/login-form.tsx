"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const areas = [
  { key: "app", label: "Area cliente", href: "/app/dashboard", desc: "Titolare / manager ristorante" },
  { key: "admin", label: "Admin Emotive", href: "/admin/dashboard", desc: "Pannello interno" },
  { key: "sales", label: "Area venditori", href: "/sales/dashboard", desc: "Provvigioni e lead" },
  { key: "referral", label: "Portale referral", href: "/partner/dashboard", desc: "Partner segnalatori" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultArea = searchParams.get("area") ?? "app";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Scegli area demo</CardTitle>
        <div className="mt-4 space-y-2">
          {areas.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => router.push(a.href)}
              className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                defaultArea === a.key
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              <p className="font-medium text-sm">{a.label}</p>
              <p className="text-xs text-zinc-500">{a.desc}</p>
            </button>
          ))}
        </div>
        <Button className="w-full mt-6" onClick={() => router.push("/app/dashboard")}>
          Entra in demo cliente
        </Button>
        <p className="text-xs text-zinc-500 text-center mt-4">
          Con Supabase configurato, il login email sarà attivo qui.
        </p>
      </CardHeader>
    </Card>
  );
}
