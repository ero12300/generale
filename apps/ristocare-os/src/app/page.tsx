import {
  commercialPlans,
  launchOffer,
  productHighlights,
  ticketStatuses,
  userRoles,
  workflowSteps,
} from "@/lib/ristocare-content";

const metrics = [
  { label: "MVP", value: "5 portali" },
  { label: "Mercato pilota", value: "Messina" },
  { label: "Offerta lancio", value: "10 locali" },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <nav className="flex items-center justify-between" aria-label="Navigazione principale">
          <a className="text-lg font-semibold tracking-[0.28em] text-[#f8f4ec]" href="#top">
            RISTOCARE OS
          </a>
          <div className="hidden items-center gap-6 text-sm text-[#b7afa1] md:flex">
            <a className="hover:text-[#f8f4ec]" href="#workflow">
              Flusso
            </a>
            <a className="hover:text-[#f8f4ec]" href="#piani">
              Piani
            </a>
            <a className="hover:text-[#f8f4ec]" href="#mvp">
              MVP
            </a>
          </div>
        </nav>

        <div
          className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.08fr_0.92fr]"
          id="top"
        >
          <div className="rise-in max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#3a3429] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6ee7b7]">
              Brand dedicato Emotive S.r.l.
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f8f4ec] md:text-7xl">
              Il passaporto digitale delle attrezzature del tuo ristorante.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d8d0c1]">
              Gestisci garanzie, manuali, matricole, ticket, manutenzioni, ricambi e interventi
              tecnici da un unico portale operativo.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-full bg-[#6ee7b7] px-6 py-3 text-center text-sm font-bold text-[#11100e] hover:-translate-y-0.5 hover:bg-[#8ef0ca]"
                href="mailto:info@ristocare.it?subject=Richiesta%20demo%20RistoCare%20OS"
              >
                {launchOffer.primaryAction}
              </a>
              <a
                className="rounded-full border border-[#d6a94f] px-6 py-3 text-center text-sm font-bold text-[#f8f4ec] hover:-translate-y-0.5 hover:bg-[#d6a94f] hover:text-[#11100e]"
                href="#piani"
              >
                {launchOffer.secondaryAction}
              </a>
            </div>
          </div>

          <aside className="rise-in rounded-[2rem] border border-[#3a3429] bg-[#1b1915]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] bg-[#242018] p-5">
              <div className="flex items-start justify-between border-b border-[#3a3429] pb-5">
                <div>
                  <p className="text-sm text-[#b7afa1]">Ticket aperto da QR</p>
                  <h2 className="mt-2 text-2xl font-semibold">Banco frigo non raffredda</h2>
                </div>
                <span className="rounded-full bg-[#6ee7b7]/15 px-3 py-1 text-xs font-bold text-[#6ee7b7]">
                  In verifica
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-4 py-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#b7afa1]">Matricola</dt>
                  <dd className="mt-1 font-semibold">RX-2049-ME</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#b7afa1]">Garanzia</dt>
                  <dd className="mt-1 font-semibold text-[#6ee7b7]">Attiva</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#b7afa1]">Priorita</dt>
                  <dd className="mt-1 font-semibold text-[#d6a94f]">Servizio bloccato</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#b7afa1]">Tecnico</dt>
                  <dd className="mt-1 font-semibold">Da assegnare</dd>
                </div>
              </dl>

              <div className="space-y-3">
                {ticketStatuses.slice(0, 6).map((status, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-[#3a3429] bg-[#11100e]/50 px-4 py-3"
                    key={status}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index < 2 ? "bg-[#6ee7b7]" : "bg-[#514838]"
                      }`}
                    />
                    <span className="text-sm text-[#d8d0c1]">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#3a3429] bg-[#f8f4ec] text-[#11100e]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:px-10">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-sm uppercase tracking-[0.18em] text-[#625946]">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6ee7b7]">
            Problema risolto
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] md:text-6xl">
            Quando una macchina si ferma, il problema e il caos operativo.
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {productHighlights.map((highlight) => (
            <article className="rounded-[1.5rem] border border-[#3a3429] p-6" key={highlight.title}>
              <h3 className="text-xl font-semibold">{highlight.title}</h3>
              <p className="mt-4 leading-7 text-[#b7afa1]">{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1b1915] px-6 py-28 lg:px-10" id="workflow">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d6a94f]">
                Centrale operativa
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                Il tecnico resta partner operativo, RistoCare resta l unico interlocutore.
              </h2>
            </div>
            <div className="grid gap-4">
              {workflowSteps.map((step) => (
                <article
                  className="grid gap-4 rounded-[1.5rem] border border-[#3a3429] bg-[#11100e]/50 p-5 md:grid-cols-[5rem_1fr]"
                  key={step.label}
                >
                  <span className="text-3xl font-semibold text-[#6ee7b7]">{step.label}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-7 text-[#b7afa1]">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10" id="piani">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.72fr)_minmax(18rem,0.28fr)] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6ee7b7]">
              Piani commerciali
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Setup, abbonamento, ticket e margine tecnico in un modello vendibile.
            </h2>
          </div>
          <p className="max-w-sm justify-self-start leading-7 text-[#b7afa1] md:justify-self-end">
            {launchOffer.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {commercialPlans.map((plan) => (
            <article
              className="flex min-h-[28rem] flex-col rounded-[1.5rem] border border-[#3a3429] bg-[#1b1915] p-6"
              key={plan.name}
            >
              <p className="text-sm text-[#b7afa1]">{plan.equipmentLimit}</p>
              <h3 className="mt-3 text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-4 text-3xl font-semibold text-[#6ee7b7]">{plan.price}</p>
              <p className="mt-2 text-sm text-[#d6a94f]">{plan.setup}</p>
              <p className="mt-5 leading-7 text-[#b7afa1]">{plan.audience}</p>
              <ul className="mt-6 space-y-3 text-sm text-[#d8d0c1]">
                {plan.includes.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="text-[#6ee7b7]" aria-hidden="true">
                      /
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f4ec] px-6 py-24 text-[#11100e] lg:px-10" id="mvp">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3b8065]">
              MVP operativo
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Un sistema semplice da vendere prima delle automazioni complesse.
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-[#625946]">
              La prima promessa e concreta: digitalizzare il parco attrezzature e dare ordine a
              garanzie, manuali, matricole, ticket, ricambi e manutenzioni.
            </p>
          </div>

          <div className="grid gap-8">
            <article>
              <h3 className="text-xl font-semibold">Ruoli da coprire</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {userRoles.map((role) => (
                  <span
                    className="rounded-full border border-[#d8cfbd] px-4 py-2 text-sm text-[#453d31]"
                    key={role}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </article>

            <article>
              <h3 className="text-xl font-semibold">Stati ticket</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {ticketStatuses.map((status, index) => (
                  <div className="flex items-center gap-3 text-sm text-[#453d31]" key={status}>
                    <span className="font-mono text-[#3b8065]">{String(index + 1).padStart(2, "0")}</span>
                    {status}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-[#b7afa1] md:flex-row md:items-center md:justify-between lg:px-10">
        <p>RistoCare OS - brand dedicato di Emotive S.r.l.</p>
        <a className="text-[#6ee7b7] hover:text-[#f8f4ec]" href="#top">
          Torna su
        </a>
      </footer>
    </main>
  );
}
