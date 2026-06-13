import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/utils";

const PROBLEMS = [
  "Manuali introvabili e fatture sparse",
  "Matricole mancanti, garanzie non tracciate",
  "Foto su WhatsApp e telefonate a raffica",
  "Tecnici chiamati all'ultimo momento",
  "Nessuno storico degli interventi",
  "Dipendenti che non sanno cosa fare",
];

const SOLUTIONS = [
  { title: "Apri ticket in pochi secondi", desc: "Dallo smartphone, scansionando il QR dell'attrezzatura." },
  { title: "Trovi manuale e matricola", desc: "Tutti i documenti tecnici in un unico archivio protetto." },
  { title: "Controlli la garanzia", desc: "Stato e scadenza sempre aggiornati, con alert automatici." },
  { title: "Richiedi ricambi", desc: "Guarnizioni, filtri, detergenti e consumabili ricorrenti." },
  { title: "Programmi manutenzioni", desc: "Promemoria su filtri, pulizie e verifiche periodiche." },
  { title: "Conservi lo storico", desc: "Ogni intervento archiviato con foto, relazione e costi." },
];

const STEPS = [
  { n: "01", title: "Digitalizziamo il locale", desc: "Sopralluogo e raccolta documenti." },
  { n: "02", title: "Censiamo le attrezzature", desc: "Foto matricole, manuali, fatture." },
  { n: "03", title: "Creiamo i QR code", desc: "Un codice univoco per ogni macchina." },
  { n: "04", title: "Attiviamo il portale", desc: "Area cliente, utenti e procedure." },
  { n: "05", title: "Gestiamo le richieste", desc: "Ticket, ricambi e manutenzioni." },
];

const AUDIENCE = [
  "Bar", "Ristoranti", "Gelaterie", "Pizzerie", "Pasticcerie",
  "Lounge bar", "Pub", "Take away", "Gastronomie", "Catene food", "Hotel con cucina", "Catering",
];

const FAQ = [
  {
    q: "RistoCare OS è un'assistenza gratuita?",
    a: "No. È un sistema professionale per gestire attrezzature, documenti e richieste. Gli interventi, i ricambi e le attività non coperti da garanzia vengono preventivati separatamente.",
  },
  {
    q: "Devo scegliere io il tecnico?",
    a: "No. Apri un ticket verso la centrale operativa RistoCare: qualifichiamo il problema, contattiamo il tecnico più adatto, ti inviamo un preventivo e coordiniamo l'intervento. Hai un unico interlocutore.",
  },
  {
    q: "Funziona sul telefono?",
    a: "Sì. RistoCare OS è una web app installabile (PWA): la aggiungi alla schermata Home su Android e iPhone, senza passare dagli store.",
  },
  {
    q: "Ho comprato le attrezzature da un altro fornitore?",
    a: "Nessun problema. Offriamo la digitalizzazione completa del parco attrezzature anche per chi non ha acquistato da Emotive S.r.l.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-pretty text-muted">{subtitle}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden border-b border-border">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-strong" />
              Ho.Re.Ca · Messina e provincia
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Il passaporto digitale delle attrezzature del tuo ristorante
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted">
              Con RistoCare OS gestisci garanzie, manuali, matricole, ticket, manutenzioni,
              ricambi e interventi tecnici da un unico portale.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contatti?tipo=demo"
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-strong sm:w-auto"
              >
                Richiedi una demo
              </Link>
              <Link
                href="/contatti?tipo=censimento"
                className="w-full rounded-xl border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:w-auto"
              >
                Digitalizza il tuo locale
              </Link>
            </div>
            <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
              {[
                ["Meno", "fermi macchina"],
                ["Zero", "documenti persi"],
                ["1", "solo interlocutore"],
              ].map(([k, v]) => (
                <div key={v} className="rounded-2xl border border-border bg-surface/50 p-4">
                  <dt className="text-2xl font-semibold text-foreground">{k}</dt>
                  <dd className="mt-1 text-xs text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Il problema"
          title="Quando una macchina si ferma, il problema non è solo il guasto. È il caos."
          subtitle="Oggi molti ristoratori gestiscono le attrezzature tra foto su WhatsApp, manuali persi e urgenze continue."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-300">✕</span>
              <span className="text-muted">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Soluzione */}
      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading
            eyebrow="La soluzione"
            title="Con RistoCare OS ogni attrezzatura ha il suo QR code"
            subtitle="Scansiona e gestisci tutto dal telefono. Meno caos, più controllo."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary-strong">✓</div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Come funziona" title="Dal sopralluogo alla centrale operativa" />
        <ol className="mt-12 grid gap-4 md:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-2xl border border-border bg-surface/40 p-5">
              <span className="text-sm font-bold text-gold">{step.n}</span>
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs text-muted">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Pacchetti */}
      <section id="pacchetti" className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading
            eyebrow="Pacchetti"
            title="Un piano per ogni tipo di locale"
            subtitle="Prezzi consigliati. Il setup iniziale include sopralluogo, censimento e creazione dei QR code."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-surface p-6 ${
                  plan.highlighted ? "border-primary/60 ring-1 ring-primary/30" : "border-border"
                }`}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                    Più scelto
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted">{plan.audience}</p>
                <div className="mt-4">
                  {plan.monthlyPrice !== null ? (
                    <p className="text-3xl font-semibold">
                      {formatEuro(plan.monthlyPrice)}
                      <span className="text-sm font-normal text-muted">/mese</span>
                    </p>
                  ) : (
                    <p className="text-2xl font-semibold">Su preventivo</p>
                  )}
                  {plan.setupFrom !== null ? (
                    <p className="mt-1 text-xs text-muted">Setup da {formatEuro(plan.setupFrom)}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted">Setup dedicato</p>
                  )}
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-primary-strong">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contatti?tipo=preventivo&piano=${plan.id}`}
                  className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-white hover:bg-primary-strong"
                      : "border border-border text-foreground hover:bg-surface-2"
                  }`}
                >
                  Richiedi preventivo
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            <Link href="/pacchetti" className="text-primary-strong hover:underline">
              Confronta tutti i dettagli dei pacchetti →
            </Link>
          </p>
        </div>
      </section>

      {/* Per chi è */}
      <section id="per-chi" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Per chi è" title="Pensato per il mondo food" />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {AUDIENCE.map((a) => (
            <span key={a} className="rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-muted">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Centrale operativa */}
      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Centrale operativa</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Un ticket, e ci pensiamo noi
            </h2>
            <p className="mt-4 text-muted">
              Il cliente non rincorre i tecnici. Apre un ticket verso RistoCare OS: qualifichiamo
              il problema, verifichiamo la garanzia, contattiamo il tecnico partner, applichiamo il
              margine e inviamo un unico preventivo marchiato RistoCare.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {["Qualificazione e controllo garanzia", "Preventivo a doppio livello (interno e cliente)", "Coordinamento intervento e chiusura pratica", "Storico interventi sempre disponibile"].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-primary-strong">✓</span>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold">Flusso ticket</p>
            <ol className="mt-4 space-y-3 text-sm">
              {["Nuovo", "In verifica", "In attesa tecnico", "Preventivo inviato", "Accettato", "Risolto", "Chiuso"].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary-strong">{i + 1}</span>
                  <span className="text-muted">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Referral */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-surface to-surface-2 p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Referral</p>
          <h2 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-tight">
            Diventa partner RistoCare
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Segnala locali interessati a digitalizzare la gestione delle attrezzature. Se il cliente
            attiva un piano, ricevi un premio.
          </p>
          <Link
            href="/referral"
            className="mt-7 inline-flex rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-[#1a1407] transition-opacity hover:opacity-90"
          >
            Scopri il programma referral
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <SectionHeading eyebrow="FAQ" title="Domande frequenti" />
          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-surface p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-gold transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight">
            Vuoi sapere quanto costa digitalizzare il tuo locale?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contatti?tipo=preventivo" className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-strong sm:w-auto">
              Richiedi preventivo
            </Link>
            <Link href="/contatti?tipo=censimento" className="w-full rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-surface-2 sm:w-auto">
              Prenota sopralluogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
