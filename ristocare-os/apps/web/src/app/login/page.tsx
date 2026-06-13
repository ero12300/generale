"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, User, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoRole } from "@/lib/auth/session";

const roles: { role: DemoRole; title: string; desc: string; icon: React.ComponentType<{ className?: string }>; href: string }[] = [
  { role: "customer", title: "Cliente", desc: "Gelateria, ristorante o bar", icon: User, href: "/app/dashboard" },
  { role: "operator", title: "Operatore RistoCare", desc: "Centrale operativa", icon: Shield, href: "/admin/dashboard" },
  { role: "technician", title: "Tecnico partner", desc: "Interventi assegnati", icon: Wrench, href: "/tech/tickets" },
  { role: "referral", title: "Partner referral", desc: "Lead segnalati", icon: Users, href: "/referral/dashboard" },
];

export default function LoginPage() {
  const router = useRouter();

  async function enterDemo(role: DemoRole, href: string) {
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(href);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0c0f0e]">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">RistoCare OS</span>
        </Link>
        <p className="text-zinc-400 text-sm">Accedi al portale o prova la demo</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {roles.map(({ role, title, desc, icon: Icon, href }) => (
          <Card key={role} className="hover:border-emerald-600/40 transition-colors">
            <CardHeader>
              <Icon className="h-6 w-6 text-emerald-500 mb-2" />
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => enterDemo(role, href)}>
                Entra in demo ({title.toLowerCase()})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-600 text-center max-w-md">
        In produzione l&apos;accesso avviene tramite Supabase Auth.
        Configura le variabili in <code className="text-zinc-500">.env.local</code>.
      </p>
    </div>
  );
}
