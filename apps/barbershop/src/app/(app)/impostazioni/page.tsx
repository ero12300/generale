"use client";

import { useState } from "react";
import { Plus, Scissors, Users, RotateCcw, Lock } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCents, eurosToCents } from "@/lib/money";
import { PLAN_LIMITS } from "@/lib/types";

export default function ImpostazioniPage() {
  const { data, addService, addStaff, resetDemo } = useStore();
  const limits = PLAN_LIMITS[data.subscription.plan];

  const [svcName, setSvcName] = useState("");
  const [svcDuration, setSvcDuration] = useState("30");
  const [svcPrice, setSvcPrice] = useState("");
  const [svcError, setSvcError] = useState("");

  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("Barber");
  const staffLimitReached = data.staff.length >= limits.maxStaff;

  function submitService(e: React.FormEvent) {
    e.preventDefault();
    const cents = eurosToCents(svcPrice);
    if (!svcName.trim() || cents <= 0) {
      setSvcError("Nome e prezzo validi richiesti.");
      return;
    }
    addService({
      name: svcName.trim(),
      durationMin: Number(svcDuration) || 30,
      priceCents: cents,
    });
    setSvcName("");
    setSvcPrice("");
    setSvcDuration("30");
    setSvcError("");
  }

  function submitStaff(e: React.FormEvent) {
    e.preventDefault();
    if (staffLimitReached || !staffName.trim()) return;
    addStaff({ name: staffName.trim(), role: staffRole.trim() || "Barber" });
    setStaffName("");
    setStaffRole("Barber");
  }

  return (
    <div>
      <PageHeader
        title="Impostazioni"
        subtitle={`${data.organization.name} · ${data.organization.address}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <Scissors className="h-4 w-4 text-amber-400" /> Listino servizi
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-zinc-500">{s.durationMin} min</p>
                </div>
                <span className="font-semibold text-amber-300">{formatCents(s.priceCents)}</span>
              </div>
            ))}
            <form onSubmit={submitService} className="space-y-3 border-t border-zinc-800 pt-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3 space-y-1.5">
                  <Label htmlFor="svc-name">Nome servizio</Label>
                  <Input id="svc-name" value={svcName} onChange={(e) => setSvcName(e.target.value)} placeholder="Es. Shampoo & Piega" />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="svc-dur">Minuti</Label>
                  <Input id="svc-dur" type="number" value={svcDuration} onChange={(e) => setSvcDuration(e.target.value)} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="svc-price">Prezzo (€)</Label>
                  <Input id="svc-price" inputMode="decimal" value={svcPrice} onChange={(e) => setSvcPrice(e.target.value)} placeholder="18,00" />
                </div>
              </div>
              {svcError && <p className="text-sm text-red-400">{svcError}</p>}
              <Button type="submit" size="sm">
                <Plus className="h-4 w-4" /> Aggiungi servizio
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" /> Team barbieri
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.staff.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-zinc-500">{s.role}</p>
                  </div>
                </div>
              </div>
            ))}

            {staffLimitReached ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="flex items-center gap-2 text-sm text-amber-100">
                  <Lock className="h-4 w-4" />
                  Il piano <strong>{data.subscription.plan === "base" ? "Base" : "Pro"}</strong> consente max{" "}
                  {limits.maxStaff} {limits.maxStaff === 1 ? "barbiere" : "barbieri"}.
                </p>
                {data.subscription.plan === "base" && (
                  <Link
                    href="/abbonamento"
                    className="mt-2 inline-block text-sm font-semibold text-amber-300 hover:text-amber-200"
                  >
                    Passa a Pro per aggiungere il team →
                  </Link>
                )}
              </div>
            ) : (
              <form onSubmit={submitStaff} className="space-y-3 border-t border-zinc-800 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="stf-name">Nome</Label>
                    <Input id="stf-name" value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Es. Antonio" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stf-role">Ruolo</Label>
                    <Input id="stf-role" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" /> Aggiungi barbiere
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dati demo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Ripristina i dati dimostrativi originali (clienti, prenotazioni, incassi).
            <br />
            <Badge variant="neutral" className="mt-2">
              I dati sono salvati localmente nel browser (modalità demo)
            </Badge>
          </p>
          <Button variant="secondary" onClick={resetDemo}>
            <RotateCcw className="h-4 w-4" /> Ripristina demo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
