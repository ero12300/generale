# Costruzione piattaforma gestionale ristoratore

Documento operativo per sviluppo, vendita, prezzi, mobile app e referral.

- **Nome piattaforma:** RistoProfit OS
- **Suite futura:** RistoSuite OS
- **Modulo assistenza già in sviluppo:** RistoCare OS
- **Ragione sociale:** Emotive S.r.l.
- **Mercato iniziale:** Messina e provincia
- **Espansione futura:** Sicilia, Calabria, Sud Italia, Italia
- **Target:** ristoranti, bar, gelaterie, pasticcerie, pizzerie, lounge, gastronomie, take away, format food
- **Obiettivo:** piattaforma SaaS per controllare margini, food cost, menu, personale, magazzino, procedure e report giornalieri.

---

## 1. Visione generale

RistoProfit OS è **il cruscotto economico del ristoratore**. Deve aiutarlo a
rispondere ogni giorno a: sto guadagnando davvero? quanto margino su ogni piatto?
quali piatti vendono ma rendono poco? quali prodotti aumentare? quali ingredienti
stanno salendo di prezzo? quanto costa il personale rispetto all'incasso? cosa
produrre domani? quali sprechi sto generando? cosa ordinare ai fornitori? quali
decisioni prendere questa settimana?

> Non è "un altro gestionale": è il sistema che mostra al ristoratore **dove
> guadagna, dove perde e cosa deve correggere**.

## 2. Rapporto con RistoCare OS

| Piattaforma | Funzione principale |
|---|---|
| RistoCare OS | assistenza, attrezzature, garanzie, ticket, ricambi, tecnici |
| RistoProfit OS | food cost, margini, menu, magazzino, personale, report |

Separate in fase 1 (commercialmente e tecnicamente), ma con struttura dati
compatibile. **Fase 3:** RistoSuite OS come contenitore unico con i moduli
RistoProfit, RistoCare, RistoStaff, RistoMarketing. Unico accesso, moduli
attivabili a scelta.

## 3. Posizionamento commerciale

- **Payoff:** Controlla food cost, margini e gestione del tuo ristorante da
  un'unica dashboard.
- Altri payoff: «Scopri quanto guadagni davvero su ogni piatto», «Il cruscotto
  economico del tuo ristorante», «Meno sprechi, più margine, più controllo».
- Frase diretta: «Non è un gestionale in più. È il sistema che Le dice dove sta
  guadagnando e dove sta perdendo soldi.»

## 4. Problema del ristoratore

Menu senza calcolo margini; prezzi "a sensazione"; listino non aggiornato dopo
gli aumenti; piatti molto venduti ma poco redditizi; personale sovradimensionato;
sprechi; magazzino non controllato; fatture non analizzate; produzione non
pianificata; report giornaliero inesistente.

## 5. Promessa principale

> «Le facciamo vedere quanto guadagna davvero su ogni piatto.»

Vendere prima il **risultato** (più controllo, meno sprechi, prezzi corretti,
margini chiari, decisioni veloci), non l'elenco delle funzioni.

## 6. Moduli della piattaforma

1. **Food Cost** — costo reale per piatto. Output: costo porzione, food cost %,
   margine lordo, utile, prezzo minimo/ideale, alert food cost alto.
2. **Menu Engineering** — Star (spingere), Puzzle (migliorare foto/descrizione),
   Cavallo da lavoro (aumentare prezzo/ridurre costo), Dog (eliminare).
3. **Fatture fornitori** — upload PDF/foto, aggiornamento prezzi ingredienti,
   alert variazioni.
4. **Magazzino semplice** — scorta minima, carichi/scarichi, esaurimento,
   scadenze, lista riordino, invio ordine, storico prezzi.
5. **Produzione giornaliera** — quantità consigliate da storico, giorno, periodo,
   meteo, festività, prenotazioni.
6. **Personale** — incidenza costo lavoro su incasso (non è un software paghe).
7. **Report giornaliero** — email / WhatsApp / Telegram / notifica / dashboard.

## 7. Lato cliente

Menu: Dashboard, Food Cost, Ingredienti, Ricette, Menu, Fatture, Magazzino,
Produzione, Personale, Report, Fornitori, Impostazioni, Supporto. La dashboard
mostra incasso, margine, food cost medio, prodotti critici, ingredienti
aumentati, prodotti sotto scorta, costo personale, azioni consigliate, report,
e i pulsanti "carica fattura" e "aggiungi ricetta".

## 8. Lato admin Emotive

Pannello interno: clienti attivi, locali, piani, setup, ricette/fatture/report,
alert clienti critici, venditori, referral, provvigioni, incassi, abbonamenti,
ticket. KPI: MRR, nuovi clienti, setup venduti, clienti in prova/attivi,
disdette, ricavi per venditore, referral, conversione demo, moduli più venduti.

## 9. App mobile

Partire con una **PWA** (web app installabile): meno costosa, veloce, Android +
iPhone, stesso codice, aggiornamenti immediati, ideale per MVP. Evoluzione:
Fase 1 PWA con Next.js → Fase 2 Capacitor → Fase 3 Play Store → Fase 4 App Store.

## 10. Stack tecnico

- **Frontend:** Next.js (sito, area cliente/admin, dashboard, PWA).
- **UI:** Tailwind CSS — premium, pulito, mobile first. Colori:
  nero/antracite, bianco, verde profitto, oro leggero, grigio caldo.
- **Backend/DB:** Supabase (PostgreSQL, Auth, ruoli, RLS, Storage, Edge
  Functions, realtime, multi-tenant).
- **Hosting:** Vercel (deploy, dominio, preview, GitHub).
- **AI:** OpenRouter / modelli economici / Hugging Face → analisi ricette,
  suggerimenti prezzi, descrizioni menu, report, lettura fatture, advisor.
- **Pagamenti:** inizio bonifico / Stripe Payment Link / manuale; poi Stripe
  Checkout, abbonamenti, rinnovi, provvigioni.

## 11. Architettura database

**Comuni:** organizations, locations, users, memberships, subscriptions, plans,
invoices, payments, documents, notifications, audit_logs.

**RistoProfit:** ingredients, suppliers, supplier_invoices,
supplier_invoice_items, recipes, recipe_items, menus, menu_items, sales_daily,
sales_items, inventory_items, stock_movements, production_plans, staff_members,
staff_shifts, daily_reports, ai_suggestions.

**Venditori/referral:** sales_agents, agent_commissions, referral_partners,
referrals, referral_rewards, sales_targets, sales_leaderboard.

## 12. Multi-tenant

Ogni cliente è un'organizzazione separata (organization → location → users →
plan → modules). Ruoli: super_admin, admin_emotive, operator_emotive,
sales_agent, customer_owner, customer_manager, customer_staff, accountant,
referral_partner. Il cliente vede solo i propri dati; il venditore solo i clienti
assegnati; il referral solo le proprie segnalazioni; admin Emotive vede tutto.

## 13. Politica prezzi

Prezzo = **setup iniziale** + **canone mensile** (il setup paga la
configurazione: menu, ricette, ingredienti, fornitori, formazione, primo report).

| Piano | Canone | Setup | Per chi |
|---|---|---|---|
| Start | 59 €/mese | 490 € | piccoli bar, take away |
| Pro | 129 €/mese | 990 € | ristoranti, pizzerie, gelaterie |
| Premium | 249 €/mese | 1.990 € | locali strutturati |
| Enterprise | su preventivo | da 3.000 € | catene, franchising |

## 14. Politica sconti

Non scontare il canone: meglio scontare il setup o aggiungere funzioni.
- **Lancio (primi 10 a Messina):** setup Pro 690 € (invece di 990 €), canone Pro
  99 €/mese per 12 mesi, report iniziale + 30 giorni affiancamento.
- **Clienti Emotive:** sconto setup 20%, primo report incluso, bundle futuro.
- **Pagamento annuale:** 2 mesi gratis oppure 15% di sconto.
- **Bundle futuro:** RistoProfit Pro + RistoCare Pro = 199 €/mese.

## 15. Come spiegare il prezzo

Il setup configura il locale; il canone mantiene attiva la piattaforma, aggiorna
i dati, genera report e supporta le decisioni. Esempio: un piatto venduto 300
volte/mese, aumentato di 1 € perché il food cost era alto, recupera 300 €/mese —
il canone si ripaga con una sola correzione.

## 16–17. Vendita e offerte

Script, domande da fare, risposte alle obiezioni ("ho già il gestionale", "non
ho tempo", "costa troppo"). Offerte: Analisi Food Cost iniziale (490 €), Setup
Pro (990 € + 129 €/mese), Revisione menu/listino (1.500–3.000 €), Pacchetto
gestione mensile (299–599 €/mese).

## 18–22. Referral e venditori

- **Segnalatore:** Start 50 €, Pro 100 €, Premium 200 €, Enterprise dedicato.
- **Partner commerciale:** 10% setup + 10% canone per 6 mesi + bonus.
- **Venditore interno:** 15% setup + 10% canone 12 mesi + bonus trimestrale.
- **Provvigioni base** e **senior** (dopo 5 clienti: 20% setup), bonus trimestrale
  (5→300 €, 10→800 €, 15→1.500 €, 25→3.000 €).
- La provvigione ricorrente si paga solo se il cliente paga regolarmente, non
  disdice, è stato registrato nel CRM prima della trattativa.
- **Protezione lead 90 giorni.** Portale referral con stati lead (Nuovo,
  Contattato, Demo, Preventivo, Trattativa, Chiuso vinto/perso, Non valido, Già
  presente, Premio maturato/pagato). Dashboard venditori + gamification.

## 23. Sito pubblico

Pagine: Home, Come funziona, Food Cost, Menu Engineering, Prezzi, Per ristoranti/
bar/pizzerie/gelaterie, Referral, Demo, Contatti, Login. Hero: «Scopri quanto
guadagni davvero su ogni piatto».

## 24. Funzioni richieste (MVP → completo)

Sito pubblico, login, area cliente/admin/venditori/referral, organizzazioni,
locali, utenti, ingredienti, fornitori, upload fatture, ricette, food cost,
prezzo consigliato, margine, menu engineering, magazzino, lista riordino,
produzione, personale, report giornaliero, dashboard KPI, piani, setup,
pagamenti manuali + Stripe, provvigioni, referral, PWA, notifiche.

## 25. Roadmap

1. **MVP (30/45 gg):** sito, login, organizzazioni, locali, ingredienti,
   ricette, food cost, dashboard cliente/admin, report PDF base, PWA, prezzi,
   area venditori/referral base.
2. **Vendibile (60/90 gg):** upload fatture, storico prezzi, menu engineering,
   magazzino, report giornaliero, personale, provvigioni, referral, email.
3. **Automazioni:** AI fatture, report automatico, WhatsApp, Stripe, reminder.
4. **Integrazione RistoCare OS** in RistoSuite OS.

## 26–27. Lancio a Messina

5 locali pilota (pizzeria, gelateria, bar, ristorante, pasticceria) con offerta
agevolata in cambio di testimonianze e casi studio. Materiale venditori: scheda
prodotto, demo script, frase di chiusura.

## 28. Conclusione

Continuare RistoCare OS separato; creare RistoProfit OS economico/gestionale;
strutturare per integrazione in RistoSuite OS; partire da Messina con piloti;
monetizzare con setup + canone; venditori motivati; referral; PWA per mobile.

> «RistoProfit OS Le fa vedere dove guadagna, dove perde e cosa deve correggere
> per migliorare il risultato del Suo locale.»
