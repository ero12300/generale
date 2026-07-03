import { CheckCircle2, Cloud, CreditCard, Database, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isFirebaseConfigured } from "@/lib/firebase/config";

const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_APP_URL",
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="border-white/10 bg-white/10 text-white">Setup stack</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Architettura Vercel + Firebase + Stripe</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Questa build resta demo-ready, ma la struttura è pensata per salire di livello senza
          rifare il prodotto: hosting Vercel, auth/database Firebase e billing Stripe.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SetupCard
          icon={Cloud}
          title="Vercel"
          text="Frontend Next.js 15, route handlers, preview deploy e dominio custom."
        />
        <SetupCard
          icon={Database}
          title="Firebase"
          text="Auth + Firestore per clienti, prenotazioni, campagne e multi-location."
        />
        <SetupCard
          icon={CreditCard}
          title="Stripe"
          text="Abbonamenti SaaS, depositi prenotazioni, promo code e billing portal."
        />
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Stato configurazione</CardTitle>
          <CardDescription>
            {isFirebaseConfigured()
              ? "Firebase web configurato in questo ambiente."
              : "Ambiente demo: collega le env per abilitare Firebase reale."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {requiredEnv.map((envName) => (
            <div
              key={envName}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-amber-300" aria-hidden />
                <span className="text-sm text-zinc-200">{envName}</span>
              </div>
              <Badge variant={process.env[envName] ? "success" : "secondary"}>
                {process.env[envName] ? "presente" : "manca"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Passi consigliati</CardTitle>
          <CardDescription>Sequenza semplice per arrivare al go-live.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-zinc-300">
          <Step text="1. Crea progetto Firebase e abilita Authentication + Firestore." />
          <Step text="2. Inserisci le env pubbliche in Vercel per il client web." />
          <Step text="3. Aggiungi service account Firebase per API server-side e automazioni." />
          <Step text="4. Configura Stripe Products/Prices con lookup keys dei piani." />
          <Step text="5. Collega dominio, attiva analytics eventi e prova onboarding reale." />
        </CardContent>
      </Card>
    </div>
  );
}

function SetupCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
        <p className="mt-4 text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{text}</p>
      </CardContent>
    </Card>
  );
}

function Step({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" aria-hidden />
      <span>{text}</span>
    </div>
  );
}
