# ADR 0001 — RistoProfit OS come piattaforma separata da RistoCare OS

Data: 2026-06-13 · Stato: accettata

## Contesto

Emotive S.r.l. sviluppa già RistoCare OS (assistenza, attrezzature, ticket, ricambi, garanzie). Il documento operativo richiede una seconda piattaforma orientata alla gestione economica (food cost, margini, menu, magazzino, personale, report), con futura integrazione in RistoSuite OS. Questo repository ospita anche un progetto non correlato (Deal Desk Immobiliare).

## Decisione

1. **Cartella dedicata `ristoprofit-os/`** nel monorepo, registrata nel workspace pnpm ma con package, porta (3002), build e deploy indipendenti. Nessuna dipendenza dal codice Deal Desk.
2. **Separazione commerciale e tecnica da RistoCare OS** in fase 1, come da documento: due prodotti, due deploy.
3. **Struttura dati compatibile**: le tabelle comuni (`organizations`, `locations`, `users`, `memberships`, `subscriptions`, `plans`, `invoices`, `payments`, `documents`, `notifications`, `audit_logs`) usano gli stessi nomi e convenzioni, così in fase 3 RistoSuite OS potrà unificare login e anagrafiche.
4. **Importi monetari sempre in centesimi interi** (TypeScript) e `integer` (PostgreSQL); mai float.
5. **Modalità demo in-memory** senza credenziali Supabase, come già fatto per il progetto esistente, per dimostrare UI e flussi.
6. **PWA prima di app nativa**: manifest installabile subito; Capacitor e store solo dopo validazione commerciale (fasi 2-4 della roadmap mobile).

## Conseguenze

- Il dev server gira sulla porta 3002 per non confliggere con l'app esistente (3000).
- Le policy RLS isolano ogni tenant (`organization_id`), i venditori vedono solo i propri clienti e i partner referral solo le proprie segnalazioni.
- La lettura AI delle fatture, Stripe e WhatsApp sono predisposte ma rimandate alla fase 3.
