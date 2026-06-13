# RistoProfit OS

## Costruzione piattaforma gestionale ristoratore

Documento operativo per sviluppo, vendita, prezzi, mobile app e referral.

- Nome piattaforma consigliato: RistoProfit OS
- Suite futura: RistoSuite OS
- Modulo assistenza gia in sviluppo: RistoCare OS
- Ragione sociale: Emotive S.r.l.
- Mercato iniziale: Messina e provincia
- Espansione futura: Sicilia, Calabria, Sud Italia, Italia
- Target: ristoranti, bar, gelaterie, pasticcerie, pizzerie, lounge, gastronomie, take away, format food
- Obiettivo: creare una piattaforma SaaS utile al ristoratore per controllare margini, food cost, menu, personale, magazzino, procedure e report giornalieri.

---

## 1. Visione generale

Emotive S.r.l. sta gia creando RistoCare OS, programma dedicato ad assistenza, attrezzature, ticket, manutenzioni, ricambi e garanzie.

Questo documento riguarda la costruzione di una seconda piattaforma, piu orientata alla gestione economica e operativa del ristorante.

La piattaforma consigliata e:

**RistoProfit OS**

Il cruscotto economico del ristoratore.

RistoProfit OS deve aiutare il ristoratore a rispondere ogni giorno a queste domande:

- Sto guadagnando davvero?
- Quanto margino su ogni piatto?
- Quali piatti vendono ma mi fanno guadagnare poco?
- Quali prodotti devo aumentare?
- Quali ingredienti stanno salendo di prezzo?
- Quanto mi costa il personale rispetto all'incasso?
- Cosa devo produrre domani?
- Quali sprechi sto generando?
- Cosa devo ordinare ai fornitori?
- Quali decisioni devo prendere questa settimana?

La piattaforma non deve essere presentata come "un altro gestionale", ma come:

> Il sistema che mostra al ristoratore dove guadagna, dove perde e cosa deve correggere.

---

## 2. Rapporto con RistoCare OS

RistoCare OS non deve essere escluso.

Deve rimanere separato nella prima fase, perche ha logiche diverse:

| Piattaforma | Funzione principale |
| --- | --- |
| RistoCare OS | Assistenza, attrezzature, garanzie, ticket, ricambi, tecnici |
| RistoProfit OS | Food cost, margini, menu, magazzino, personale, report |

Le due piattaforme devono essere separate commercialmente e tecnicamente nella prima fase, ma devono essere progettate per integrarsi in futuro.

### Strategia consigliata

**Fase 1**

Sviluppare RistoCare OS come piattaforma separata.

**Fase 2**

Sviluppare RistoProfit OS come piattaforma separata ma con struttura dati compatibile.

**Fase 3**

Creare RistoSuite OS come contenitore unico.

### Suite futura

**RistoSuite OS**

Moduli:

1. RistoProfit OS
2. RistoCare OS
3. RistoStaff OS
4. RistoMarketing OS

Il cliente avra un unico accesso e potra attivare i moduli che desidera.

---

## 3. Posizionamento commerciale

### Nome prodotto

RistoProfit OS

### Payoff

Controlla food cost, margini e gestione del tuo ristorante da un'unica dashboard.

### Altri payoff possibili

- Scopri quanto guadagni davvero su ogni piatto.
- Il cruscotto economico del tuo ristorante.
- Meno sprechi, piu margine, piu controllo.
- Dal menu ai fornitori: tutto sotto controllo.
- Il sistema che trasforma i dati del ristorante in decisioni operative.

### Frase semplice per il cliente

RistoProfit OS Le permette di capire quanto guadagna davvero su ogni prodotto, quali piatti migliorare, quali prezzi correggere, quali ingredienti stanno aumentando e quali azioni fare ogni giorno per gestire meglio il locale.

### Frase ancora piu diretta

Non e un gestionale in piu. E il sistema che Le dice dove sta guadagnando e dove sta perdendo soldi.

---

## 4. Problema del ristoratore

Molti ristoratori lavorano tanto, ma non hanno il controllo reale dei numeri.

Problemi frequenti:

- Menu creato senza calcolo margini.
- Prezzi stabiliti "a sensazione".
- Ingredienti aumentati ma listino non aggiornato.
- Piatti molto venduti ma poco redditizi.
- Personale sovradimensionato rispetto all'incasso.
- Sprechi in cucina.
- Magazzino non controllato.
- Fatture fornitori non analizzate.
- Produzione giornaliera non pianificata.
- Report giornaliero inesistente.
- Nessuna analisi tra vendite, costi e utile reale.

RistoProfit OS deve trasformare questi problemi in funzioni semplici e vendibili.

---

## 5. Promessa principale

La promessa principale deve essere:

> Le facciamo vedere quanto guadagna davvero su ogni piatto.

Questa e la frase piu potente per vendere il software.

Non vendere subito tutte le funzioni.

Vendere prima il risultato:

- Piu controllo.
- Meno sprechi.
- Prezzi corretti.
- Margini chiari.
- Decisioni piu veloci.
- Dati ordinati.

---

## 6. Moduli della piattaforma

### Modulo 1 - Food Cost

Funzione principale:

Calcolare il costo reale di ogni piatto, prodotto o preparazione.

Dati richiesti:

- Ingredienti.
- Prezzo unitario.
- Unita di misura.
- Grammatura.
- Scarto.
- Costo packaging.
- IVA.
- Prezzo di vendita.
- Quantita prodotta.
- Porzioni.

Output:

- Costo porzione.
- Food cost percentuale.
- Margine lordo.
- Utile per prodotto.
- Prezzo minimo consigliato.
- Prezzo ideale consigliato.
- Alert se il food cost e troppo alto.

Esempio:

- Piatto: Pizza Pistacchio.
- Prezzo vendita: 13,00 euro.
- Costo ingredienti: 4,20 euro.
- Food cost: 32,3%.
- Margine lordo: 8,80 euro.
- Stato: buono.
- Suggerimento: mantenere prezzo o valutare 13,50 euro se aumenta il pistacchio.

### Modulo 2 - Menu Engineering

Funzione principale:

Capire quali prodotti conviene spingere, modificare, aumentare o eliminare.

Classificazione:

| Categoria | Significato | Azione |
| --- | --- | --- |
| Star | Vende tanto e margina bene | Spingere |
| Puzzle | Margina bene ma vende poco | Migliorare descrizione/foto |
| Cavallo da lavoro | Vende tanto ma margina poco | Aumentare prezzo o ridurre costo |
| Dog | Vende poco e margina poco | Eliminare o sostituire |

Output:

- Prodotti migliori.
- Prodotti critici.
- Prodotti da aumentare.
- Prodotti da eliminare.
- Combo consigliate.
- Suggerimenti per nuovo menu.
- Descrizioni persuasive generate con AI.

### Modulo 3 - Fatture fornitori

Funzione principale:

Caricare fatture PDF o foto e aggiornare automaticamente i prezzi degli ingredienti.

Dati estratti:

- Fornitore.
- Data.
- Prodotto.
- Quantita.
- Prezzo unitario.
- IVA.
- Totale.
- Variazione rispetto all'ultimo acquisto.

Alert:

> Il prezzo della mozzarella e aumentato del 9% rispetto all'ultima fattura. Il margine della Pizza Bufala si e ridotto.

### Modulo 4 - Magazzino semplice

Non creare subito un magazzino troppo complesso.

Il primo magazzino deve essere pratico:

- Prodotti.
- Scorta minima.
- Carichi da fattura.
- Scarichi manuali.
- Prodotti in esaurimento.
- Prodotti in scadenza.
- Lista riordino.
- Invio ordine a fornitore.
- Storico prezzi.

Obiettivo:

> Il ristoratore deve sapere cosa manca, cosa sta aumentando e cosa deve ordinare.

### Modulo 5 - Produzione giornaliera

Utile per:

- Bar.
- Gelaterie.
- Pasticcerie.
- Pizzerie.
- Gastronomie.
- Take away.

Il sistema suggerisce quantita da produrre in base a:

- Storico vendite.
- Giorno della settimana.
- Periodo.
- Meteo.
- Festivita.
- Prenotazioni.
- Eventi locali.
- Vendite precedenti.

Esempio:

> Sabato scorso hai venduto 48 brioche. Per questo sabato produzione consigliata: 55 brioche.

### Modulo 6 - Personale e incidenza costo lavoro

Non e un software paghe.

Serve a capire se il personale e proporzionato all'incasso.

Dati:

- Dipendenti.
- Costo orario stimato.
- Turni.
- Ore lavorate.
- Incasso.
- Coperti.
- Scontrino medio.

Output:

- Costo personale giornaliero.
- Incidenza personale su incasso.
- Costo per coperto.
- Produttivita per turno.
- Alert se il costo e troppo alto.

Esempio:

> Incasso: 1.200 euro
> Costo personale stimato: 430 euro
> Incidenza: 35,8%
> Attenzione: incidenza elevata.

### Modulo 7 - Report giornaliero

Questa deve essere la funzione piu percepita.

Ogni sera il titolare riceve un report.

Canali possibili:

- Email.
- WhatsApp Business.
- Telegram.
- Notifica app.
- Dashboard.

Esempio report:

> REPORT GIORNALIERO - RistoProfit OS
>
> Incasso: 2.430 euro
> Coperti: 86
> Scontrino medio: 28,25 euro
>
> Food cost stimato: 31%
> Costo personale stimato: 520 euro
> Margine lordo stimato: 1.150 euro
>
> Prodotto piu venduto: Pizza Pistacchio
> Prodotto piu redditizio: Tagliere Aperitivo
> Prodotto critico: Burger Special, food cost 44%
>
> Ingredienti in aumento:
> - Pistacchio +12%
> - Mozzarella +8%
>
> Azioni consigliate:
> 1. Aumentare Burger Special da 11 euro a 13 euro
> 2. Spingere Tagliere Aperitivo nel weekend
> 3. Ridurre grammatura mozzarella su Pizza Bufala
> 4. Riordinare farina e passata

---

## 7. Lato cliente

### Area cliente

Il cliente deve accedere da web e da telefono.

Menu principale:

- Dashboard.
- Food Cost.
- Ingredienti.
- Ricette.
- Menu.
- Fatture.
- Magazzino.
- Produzione.
- Personale.
- Report.
- Fornitori.
- Impostazioni.
- Supporto.

### Dashboard cliente

La dashboard deve mostrare:

- Incasso del giorno.
- Margine stimato.
- Food cost medio.
- Prodotti critici.
- Ingredienti aumentati.
- Prodotti sotto scorta.
- Costo personale.
- Azioni consigliate.
- Report ultimo giorno.
- Pulsante "carica fattura".
- Pulsante "aggiungi ricetta".

---

## 8. Lato admin Emotive

Emotive deve avere un pannello interno.

Funzioni:

- Clienti attivi.
- Locali.
- Piani abbonamento.
- Setup da completare.
- Ricette caricate.
- Fatture caricate.
- Report generati.
- Alert clienti critici.
- Opportunita consulenza.
- Venditori.
- Referral.
- Provvigioni.
- Incassi mensili.
- Abbonamenti scaduti.
- Ticket supporto software.

### Dashboard admin

KPI:

- MRR mensile.
- Nuovi clienti.
- Setup venduti.
- Clienti in prova.
- Clienti attivi.
- Disdette.
- Ricavi per venditore.
- Referral attivi.
- Tasso conversione demo.
- Moduli piu venduti.
- Clienti da richiamare.

---

## 9. App mobile

### Scelta consigliata

Partire con una PWA, cioe una web app installabile sul telefono.

Il cliente apre il sito e puo aggiungerlo alla schermata Home.

### Perche PWA

Vantaggi:

- Meno costosa.
- Piu veloce da sviluppare.
- Funziona su Android e iPhone.
- Stesso codice della web app.
- Non richiede subito Play Store/App Store.
- Aggiornamenti immediati.
- Ideale per MVP.

### Funzioni mobile iniziali

Il titolare deve poter fare dal telefono:

- Vedere dashboard.
- Caricare fattura con foto.
- Aggiungere ingrediente.
- Vedere food cost.
- Consultare report.
- Ricevere alert.
- Approvare ordine fornitore.
- Controllare personale.
- Vedere prodotti critici.
- Consultare azioni consigliate.

### Evoluzione futura

**Fase 1**

PWA con Next.js.

**Fase 2**

Trasformazione in app mobile con Capacitor.

**Fase 3**

Pubblicazione su Play Store.

**Fase 4**

Pubblicazione su App Store.

---

## 10. Stack tecnico consigliato

### Frontend

Next.js

Utilizzo:

- Sito pubblico.
- Landing page.
- Area cliente.
- Area admin.
- Dashboard.
- PWA mobile.

### UI

Tailwind CSS

Design:

- Premium.
- Pulito.
- Adatto a ristoratori.
- Semplice da usare.
- Stile gestionale moderno.

Colori consigliati:

- Nero/antracite.
- Bianco.
- Verde profitto.
- Oro leggero.
- Grigio caldo.

### Backend e database

Supabase

Utilizzo:

- PostgreSQL.
- Autenticazione.
- Ruoli.
- Row Level Security.
- Storage fatture e documenti.
- API.
- Edge Functions.
- Realtime.
- Gestione multi-tenant.

### Hosting

Vercel

Utilizzo:

- Deploy web app.
- Deploy sito.
- Dominio.
- Ambiente preview.
- Aggiornamenti continui.
- Integrazione GitHub.

### AI

Possibili provider:

- OpenRouter.
- Modelli economici.
- Eventuale Hugging Face.
- In futuro modelli locali.

Funzioni AI:

- Analisi ricette.
- Suggerimenti prezzi.
- Descrizioni menu.
- Report giornaliero.
- Lettura fatture.
- Alert margini.
- Consulente virtuale per il ristoratore.

### Pagamenti

Fase iniziale:

- Bonifico.
- Stripe Payment Link.
- Pagamento manuale registrato in admin.

Fase avanzata:

- Stripe Checkout.
- Abbonamenti Stripe.
- Fatture ricorrenti.
- Rinnovi automatici.
- Gestione provvigioni.

---

## 11. Architettura database

### Tabelle comuni

- organizations
- locations
- users
- memberships
- subscriptions
- plans
- invoices
- payments
- documents
- notifications
- audit_logs

### Tabelle RistoProfit OS

- ingredients
- suppliers
- supplier_invoices
- supplier_invoice_items
- recipes
- recipe_items
- menus
- menu_items
- sales_daily
- sales_items
- inventory_items
- stock_movements
- production_plans
- staff_members
- staff_shifts
- daily_reports
- ai_suggestions

### Tabelle venditori e referral

- sales_agents
- agent_commissions
- referral_partners
- referrals
- referral_rewards
- sales_targets
- sales_leaderboard

---

## 12. Multi-tenant

Ogni cliente deve essere una organizzazione separata.

Esempio:

- Organization: Ristorante La Lumachina S.r.l.
- Location: La Lumachina Messina.
- Users: titolare, manager, dipendenti.
- Plan: Pro.
- Modules: RistoProfit attivo, RistoCare non attivo.

### Ruoli

- super_admin
- admin_emotive
- operator_emotive
- sales_agent
- customer_owner
- customer_manager
- customer_staff
- accountant
- referral_partner

### Permessi

- Il cliente vede solo i propri dati.
- Il venditore vede solo i clienti assegnati.
- Il referral vede solo le segnalazioni inviate.
- Admin Emotive vede tutto.
- Staff cliente vede solo funzioni operative.

---

## 13. Politica prezzi clienti

### Principio

Il prezzo deve avere due componenti:

1. Setup iniziale.
2. Canone mensile.

Il setup e fondamentale perche il valore iniziale non e solo il software, ma il lavoro di configurazione.

RistoProfit OS richiede:

- Inserimento menu.
- Inserimento ricette.
- Caricamento ingredienti.
- Configurazione fornitori.
- Impostazione prezzi.
- Formazione cliente.
- Primo report.

Questo lavoro deve essere pagato.

### Piano Start

- Prezzo mensile: 59 euro/mese.
- Setup: 490 euro.

Pensato per:

- Piccoli bar.
- Take away.
- Locali semplici.
- Piccole attivita con pochi prodotti.

Include:

- 1 locale.
- Fino a 30 ricette.
- Fino a 100 ingredienti.
- Food cost base.
- Dashboard.
- Report settimanale.
- Caricamento fatture manuale.
- 1 utente titolare.
- Supporto email.

Non include:

- Report giornaliero.
- Analisi menu avanzata.
- Personale.
- AI avanzata.
- Consulenza mensile.

### Piano Pro

- Prezzo mensile: 129 euro/mese.
- Setup: 990 euro.

Pensato per:

- Ristoranti.
- Pizzerie.
- Gelaterie.
- Pasticcerie.
- Locali con menu strutturato.

Include:

- 1 locale.
- Fino a 100 ricette.
- Ingredienti illimitati.
- Food cost avanzato.
- Menu engineering.
- Report giornaliero.
- Fatture fornitori.
- Storico prezzi ingredienti.
- Magazzino semplice.
- Lista riordino.
- Suggerimenti prezzo.
- 3 utenti.
- Supporto prioritario.

### Piano Premium

- Prezzo mensile: 249 euro/mese.
- Setup: 1.990 euro.

Pensato per:

- Locali strutturati.
- Ristoranti con cucina complessa.
- Gelaterie/pasticcerie.
- Locali con piu reparti.
- Attivita che vogliono controllo manageriale.

Include:

- Tutto il piano Pro.
- Utenti fino a 10.
- Report WhatsApp/Telegram.
- Controllo personale.
- Produzione giornaliera consigliata.
- AI advisor.
- Analisi menu mensile.
- Confronto fornitori.
- Report PDF mensile.
- Call mensile di controllo.
- Supporto prioritario.

### Piano Enterprise

- Prezzo: su preventivo.
- Setup: da 3.000 euro.

Pensato per:

- Catene.
- Franchising.
- Piu punti vendita.
- Imprenditori con piu locali.

Include:

- Multi-sede.
- Utenti illimitati.
- Report direzionale.
- Confronto tra sedi.
- Controllo centrale.
- Dashboard gruppo.
- Account manager.
- Integrazioni personalizzate.

---

## 14. Politica sconti

### Regola generale

Non scontare troppo il canone mensile.

Meglio scontare il setup o regalare funzioni extra.

### Sconto lancio

Per i primi 10 clienti a Messina:

- Setup Pro a 690 euro invece di 990 euro.
- Canone Pro a 99 euro/mese per 12 mesi.
- Report iniziale incluso.
- 30 giorni di affiancamento inclusi.

### Sconto clienti Emotive

Per clienti che hanno gia acquistato arredi o attrezzature da Emotive:

- Sconto setup 20%.
- Primo report food cost incluso.
- Possibile bundle futuro con RistoCare OS.

### Sconto pagamento annuale

Se il cliente paga 12 mesi anticipati:

- 2 mesi gratuiti.
- Oppure 15% di sconto sul canone annuale.

### Sconto multi-modulo futuro

Quando sara integrato con RistoCare:

- RistoProfit Pro: 129 euro/mese.
- RistoCare Pro: 99 euro/mese.
- Pacchetto insieme: 199 euro/mese.

---

## 15. Come spiegare il prezzo al cliente

### Spiegazione semplice

Il costo iniziale serve per configurare il Suo locale: inseriamo menu, ingredienti, ricette, fornitori, prezzi e impostiamo il primo controllo dei margini. Il canone mensile serve per mantenere attiva la piattaforma, aggiornare i dati, generare report, controllare i margini e supportarLa nelle decisioni.

### Frase commerciale

Non sta pagando solo un software. Sta pagando un sistema di controllo che Le permette di capire quali prodotti Le fanno guadagnare, quali Le fanno perdere margine e quali azioni fare per migliorare il risultato del locale.

### Frase orientata al ritorno economico

Se il sistema Le permette di correggere anche solo 5 prodotti venduti male, recuperare sprechi o aumentare leggermente alcuni prezzi, il canone si ripaga facilmente.

### Esempio pratico

Se un piatto viene venduto 300 volte al mese e viene aumentato di 1 euro perche il food cost era troppo alto, il locale recupera 300 euro al mese solo su quel prodotto.

Un canone da 129 euro/mese puo essere recuperato con una sola correzione di prezzo.

---

## 16. Come venderlo ai clienti

### Script breve per venditore

Abbiamo creato RistoProfit OS, un sistema che aiuta il ristoratore a capire quanto guadagna davvero su ogni piatto. Inseriamo ricette, ingredienti e prezzi di vendita, e il software calcola food cost, margini e prodotti critici. Ogni giorno il titolare puo vedere cosa sta andando bene, cosa deve aumentare e dove sta perdendo soldi.

### Script ancora piu diretto

Il problema non e solo vendere. Il problema e sapere se quello che vendi ti lascia margine. RistoProfit OS serve proprio a questo.

### Domande da fare al cliente

- Sa quanto Le costa realmente ogni piatto?
- Ha aggiornato i prezzi dopo gli ultimi aumenti dei fornitori?
- Sa quali prodotti vendono tanto ma Le lasciano poco margine?
- Ha un report giornaliero con incasso, food cost e personale?
- Decide i prezzi con dati o a sensazione?
- Sa quanto incide il personale sull'incasso?
- Le capita di accorgersi troppo tardi che un ingrediente e aumentato?

### Risposta se il cliente dice "ho gia il gestionale"

Perfetto. RistoProfit OS non vuole sostituire il gestionale o la cassa. Serve a leggere i dati e trasformarli in decisioni: margini, food cost, menu, prezzi, fornitori e report economico.

### Risposta se il cliente dice "non ho tempo"

Proprio per questo esiste il setup iniziale. La prima configurazione la facciamo noi. Lei deve solo darci menu, listino, fatture fornitori e ricette principali.

### Risposta se il cliente dice "costa troppo"

Capisco. Il punto e capire quanto Le costa non avere controllo sui margini. Basta un prodotto venduto molto con prezzo sbagliato per perdere piu del canone mensile.

---

## 17. Offerte vendibili

### Offerta 1 - Analisi Food Cost iniziale

- Prezzo: 490 euro.

Include:

- Analisi 20 prodotti.
- Calcolo food cost.
- Margine.
- Suggerimenti prezzo.
- Report PDF.
- Proposta attivazione RistoProfit.

Questa offerta puo essere usata come ingresso.

### Offerta 2 - Setup RistoProfit Pro

- Prezzo: 990 euro + 129 euro/mese.

Include:

- Configurazione locale.
- Caricamento menu.
- Caricamento ingredienti.
- Prime 50 ricette.
- Dashboard.
- Report giornaliero.
- Formazione titolare.

### Offerta 3 - Revisione menu e listino

- Prezzo: 1.500 - 3.000 euro.

Include:

- Analisi food cost.
- Menu engineering.
- Aumento prezzi consigliato.
- Nuova struttura menu.
- Descrizioni persuasive.
- Report finale.

### Offerta 4 - Pacchetto gestione mensile

- Prezzo: 299 - 599 euro/mese.

Include:

- RistoProfit Premium.
- Controllo mensile.
- Report consulenziale.
- Call mensile.
- Aggiornamento prezzi fornitori.
- Suggerimenti menu.

---

## 18. Referral e affiliazione

### Obiettivo

Creare un sistema per far portare clienti da:

- Venditori interni.
- Collaboratori.
- Agenti.
- Consulenti HACCP.
- Commercialisti.
- Tecnici.
- Fornitori food.
- Agenti caffe.
- Agenti beverage.
- Architetti.
- Clienti soddisfatti.
- Professionisti locali.

### Tipi di partner

#### Segnalatore semplice

Porta il nome di un potenziale cliente.

Compenso:

- Start: 50 euro.
- Pro: 100 euro.
- Premium: 200 euro.
- Enterprise: accordo dedicato.

Pagamento:

- Dopo pagamento setup.
- Oppure dopo incasso primo canone.

#### Partner commerciale

Segue il cliente fino alla vendita.

Compenso:

- 10% sul setup.
- 10% del canone per 6 mesi.
- Bonus al raggiungimento obiettivi.

#### Venditore interno

Ha obiettivi mensili.

Compenso consigliato:

- 15% sul setup.
- 10% del canone per 12 mesi.
- Bonus trimestrale.
- Extra se vende Premium o Enterprise.

---

## 19. Piano provvigioni venditori

### Venditore base

| Vendita | Provvigione |
| --- | --- |
| Analisi Food Cost 490 euro | 50 euro |
| Setup Start 490 euro | 75 euro |
| Setup Pro 990 euro | 150 euro |
| Setup Premium 1.990 euro | 300 euro |
| Canone Start | 10% per 6 mesi |
| Canone Pro | 10% per 12 mesi |
| Canone Premium | 10% per 12 mesi |

### Venditore senior

Dopo 5 clienti attivi:

- 20% sul setup.
- 10% canone per 12 mesi.
- Bonus 300 euro ogni 5 clienti Pro/Premium.

### Bonus trimestrale

| Risultato trimestrale | Bonus |
| --- | --- |
| 5 clienti attivi | 300 euro |
| 10 clienti attivi | 800 euro |
| 15 clienti attivi | 1.500 euro |
| 25 clienti attivi | 3.000 euro |

### Regola importante

La provvigione ricorrente si paga solo se:

- Il cliente paga regolarmente.
- Non disdice.
- Non e insolvente.
- Il venditore ha seguito correttamente il processo.
- Il cliente e stato registrato nel CRM prima della trattativa.

---

## 20. Come stimolare i venditori

### Dashboard venditori

Ogni venditore deve vedere:

- Lead assegnati.
- Trattative aperte.
- Demo fatte.
- Clienti chiusi.
- Setup venduti.
- MRR generato.
- Provvigioni maturate.
- Provvigioni pagate.
- Classifica venditori.

### Gamification

Creare classifiche:

- Venditore del mese.
- Maggior MRR.
- Piu demo fissate.
- Piu clienti Pro.
- Piu upgrade Premium.
- Miglior tasso conversione.

### Premi non solo economici

- Bonus denaro.
- Cena premio.
- Weekend.
- Premio tecnologia.
- Percentuale extra.
- Lead migliori assegnati.
- Ruolo area manager.

### Frase motivazionale per venditori

Non stiamo vendendo software. Stiamo vendendo controllo economico a imprenditori che ogni giorno rischiano di lavorare tanto senza sapere quanto guadagnano davvero.

---

## 21. Regole referral

### Quando si matura il premio

Il premio si matura quando:

- Il cliente firma.
- Paga setup.
- Attiva canone.
- Supera eventuale periodo di prova.
- Non era gia presente nel database.

### Lead gia esistenti

Se il cliente era gia presente nel CRM, il referral non viene riconosciuto, salvo approvazione manuale.

### Durata protezione lead

Un referral protegge il partner per 90 giorni.

Se entro 90 giorni il cliente non compra, il lead torna libero.

### Tracciamento

Ogni segnalazione deve avere:

- Nome partner.
- Codice partner.
- Data segnalazione.
- Nome cliente.
- Telefono.
- Citta.
- Stato.
- Piano venduto.
- Premio maturato.
- Premio pagato.

---

## 22. Portale referral

Il portale referral deve permettere al partner di:

- Registrarsi.
- Inserire lead.
- Vedere stato lead.
- Vedere premi maturati.
- Vedere premi pagati.
- Scaricare materiale commerciale.
- Copiare link referral.

### Stati lead

- Nuovo.
- Contattato.
- Demo fissata.
- Preventivo inviato.
- In trattativa.
- Chiuso vinto.
- Chiuso perso.
- Non valido.
- Gia presente.
- Premio maturato.
- Premio pagato.

---

## 23. Sito pubblico

### Pagine principali

- Home.
- Come funziona.
- Food Cost.
- Menu Engineering.
- Prezzi.
- Per ristoranti.
- Per bar.
- Per pizzerie.
- Per gelaterie.
- Referral.
- Demo.
- Contatti.
- Login.

### Homepage

#### Hero

Titolo:

> Scopri quanto guadagni davvero su ogni piatto

Sottotitolo:

> RistoProfit OS e il cruscotto economico per ristoranti, bar, pizzerie e gelaterie. Calcola food cost, margini, prezzi consigliati, sprechi, fornitori e report giornalieri.

CTA:

- Richiedi una demo.
- Calcola il tuo food cost.

#### Sezione problema

Titolo:

> Vendere tanto non significa guadagnare bene

Testo:

Ingredienti in aumento, menu non aggiornati, piatti con margini bassi e personale costoso possono ridurre il profitto del locale senza che il titolare se ne accorga.

#### Sezione soluzione

Titolo:

> RistoProfit OS trasforma ricette, fatture e vendite in decisioni

Punti:

- Calcolo food cost.
- Margine per piatto.
- Menu engineering.
- Prezzi consigliati.
- Report giornaliero.
- Alert ingredienti.
- Controllo personale.

#### Sezione pacchetti

Mostrare Start, Pro, Premium, Enterprise.

#### CTA finale

> Vuole sapere quali prodotti Le fanno guadagnare davvero?

CTA:

- Prenota analisi iniziale.
- Richiedi demo.

---

## 24. Prompt master per Cursor/Codex

Crea una piattaforma SaaS chiamata RistoProfit OS, gestita da Emotive S.r.l., dedicata a ristoranti, bar, pizzerie, gelaterie e locali food.

La piattaforma deve aiutare il ristoratore a controllare food cost, margini, menu, ingredienti, fatture fornitori, magazzino, personale e report giornalieri.

La piattaforma deve essere separata da RistoCare OS, che e il programma gia in sviluppo per assistenza, attrezzature, ticket, ricambi e manutenzioni, ma deve essere progettata per integrazione futura in RistoSuite OS.

Stack tecnico:

- Next.js.
- Tailwind CSS.
- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Row Level Security.
- Vercel.
- PWA installabile su mobile.
- Predisposizione futura per Capacitor e app mobile.

Ruoli:

- super_admin.
- admin_emotive.
- operator_emotive.
- sales_agent.
- customer_owner.
- customer_manager.
- customer_staff.
- referral_partner.

Funzioni richieste:

1. Sito pubblico commerciale.
2. Area login.
3. Area cliente.
4. Area admin Emotive.
5. Area venditori.
6. Area referral.
7. Gestione organizzazioni.
8. Gestione locali.
9. Gestione utenti.
10. Gestione ingredienti.
11. Gestione fornitori.
12. Upload fatture.
13. Lettura fatture manuale iniziale, AI futura.
14. Gestione ricette.
15. Calcolo food cost.
16. Prezzo consigliato.
17. Margine lordo.
18. Menu engineering.
19. Magazzino semplice.
20. Lista riordino.
21. Produzione giornaliera consigliata.
22. Personale e costo orario.
23. Incidenza personale su incasso.
24. Report giornaliero.
25. Dashboard KPI.
26. Piani abbonamento.
27. Setup iniziale.
28. Gestione pagamenti manuale iniziale.
29. Predisposizione Stripe.
30. Gestione venditori.
31. Provvigioni venditori.
32. Referral partner.
33. Tracciamento lead.
34. Report provvigioni.
35. PWA mobile.
36. Notifiche email.
37. Notifiche WhatsApp future.
38. Dashboard admin MRR.
39. Dashboard cliente margini.
40. Dashboard venditore.

Design:

- Premium.
- Moderno.
- Semplice.
- Adatto al mondo ristorazione.
- Mobile first.
- Colori nero/antracite, bianco, verde, oro leggero.

La piattaforma deve essere multi-tenant: ogni cliente deve vedere solo i propri dati.

Crea struttura database, pagine, componenti, layout, policy RLS, dashboard, modelli dati, flussi principali e prima versione MVP.

---

## 25. Roadmap sviluppo

### Fase 1 - MVP

Funzioni:

- Sito pubblico.
- Login.
- Organizzazioni.
- Locali.
- Ingredienti.
- Ricette.
- Calcolo food cost.
- Dashboard cliente.
- Dashboard admin.
- Report PDF base.
- PWA.
- Piano prezzi.
- Area venditori base.
- Area referral base.

### Fase 2 - Vendibile

Aggiungere:

- Upload fatture.
- Storico prezzi.
- Menu engineering.
- Magazzino base.
- Report giornaliero.
- Gestione personale base.
- Provvigioni venditori.
- Referral tracking.
- Notifiche email.

### Fase 3 - Automazioni

Aggiungere:

- Lettura fatture con AI.
- Report automatico.
- WhatsApp Business.
- Stripe.
- Abbonamenti.
- Reminder.
- Suggerimenti prezzi.
- Analisi menu mensile.

### Fase 4 - Integrazione con RistoCare OS

Aggiungere:

- Cliente unico.
- Locale unico.
- Login unico.
- Dashboard RistoSuite.
- Collegamento attrezzature.
- Collegamento report operativo.
- Pacchetti combinati.

---

## 26. Strategia di lancio a Messina

### Primi clienti pilota

Scegliere 5 locali:

- 1 pizzeria.
- 1 gelateria.
- 1 bar.
- 1 ristorante.
- 1 pasticceria.

### Offerta pilota

- Setup agevolato.
- Canone Pro a 99 euro/mese per 12 mesi.
- Analisi food cost inclusa.
- Testimonianza richiesta.
- Autorizzazione a usare risultati in forma anonima.

### Obiettivo pilota

Ottenere:

- Casi studio.
- Screenshot dashboard.
- Esempi aumento margini.
- Testimonianze.
- Materiale per venditori.
- Miglioramento software.

---

## 27. Materiale per venditori

### Scheda prodotto una pagina

Deve contenere:

- Problema.
- Soluzione.
- Benefici.
- Piani.
- Esempio economico.
- Call to action.

### Demo script

1. Mostrare dashboard.
2. Mostrare ricetta.
3. Mostrare food cost.
4. Mostrare prezzo consigliato.
5. Mostrare prodotto critico.
6. Mostrare report giornaliero.
7. Chiudere con setup e canone.

### Frase chiusura

La domanda non e se Le serve un altro software. La domanda e se oggi sa con precisione quanto guadagna su ogni piatto. Se la risposta e no, RistoProfit OS serve proprio a questo.

---

## 28. Conclusione

La strategia migliore e:

1. Continuare RistoCare OS come programma assistenza separato.
2. Creare RistoProfit OS come programma economico/gestionale per ristoratori.
3. Strutturare entrambi per futura integrazione in RistoSuite OS.
4. Partire da Messina con clienti pilota.
5. Monetizzare con setup + canone mensile.
6. Creare venditori motivati con provvigioni su setup e canoni.
7. Creare referral per professionisti e clienti.
8. Usare PWA per mobile e trasformare in app vera solo dopo validazione.
9. Non vendere "software", ma controllo economico, margini e decisioni.

La frase finale da usare sempre e:

> RistoProfit OS Le fa vedere dove guadagna, dove perde e cosa deve correggere per migliorare il risultato del Suo locale.
