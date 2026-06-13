# Costruzione piattaforma gestionale ristoratore

Documento operativo per sviluppo, vendita, prezzi, mobile app e referral.

- Nome piattaforma consigliato: **RistoProfit OS**
- Suite futura: **RistoSuite OS**
- Modulo assistenza già in sviluppo: **RistoCare OS**
- Ragione sociale: **Emotive S.r.l.**
- Mercato iniziale: **Messina e provincia**
- Espansione futura: **Sicilia, Calabria, Sud Italia, Italia**
- Target: ristoranti, bar, gelaterie, pasticcerie, pizzerie, lounge, gastronomie, take away, format food
- Obiettivo: creare una piattaforma SaaS utile al ristoratore per controllare margini, food cost, menu, personale, magazzino, procedure e report giornalieri.

---

## 1. Visione generale

Emotive S.r.l. sta già creando **RistoCare OS**, programma dedicato ad assistenza, attrezzature, ticket, manutenzioni, ricambi e garanzie.

Questo documento riguarda la costruzione di una seconda piattaforma, più orientata alla gestione economica e operativa del ristorante.

La piattaforma consigliata è:

**RistoProfit OS**  
Il cruscotto economico del ristoratore

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

> "Il sistema che mostra al ristoratore dove guadagna, dove perde e cosa deve correggere."

---

## 2. Rapporto con RistoCare OS

RistoCare OS non deve essere escluso.

Deve rimanere separato nella prima fase, perché ha logiche diverse:

| Piattaforma | Funzione principale |
|---|---|
| RistoCare OS | assistenza, attrezzature, garanzie, ticket, ricambi, tecnici |
| RistoProfit OS | food cost, margini, menu, magazzino, personale, report |

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

Il cliente avrà un unico accesso e potrà attivare i moduli che desidera.

---

## 3. Posizionamento commerciale

### Nome prodotto

**RistoProfit OS**

### Payoff

Controlla food cost, margini e gestione del tuo ristorante da un'unica dashboard.

### Altri payoff possibili

- Scopri quanto guadagni davvero su ogni piatto.
- Il cruscotto economico del tuo ristorante.
- Meno sprechi, più margine, più controllo.
- Dal menu ai fornitori: tutto sotto controllo.
- Il sistema che trasforma i dati del ristorante in decisioni operative.

### Frase semplice per il cliente

> "RistoProfit OS Le permette di capire quanto guadagna davvero su ogni prodotto, quali piatti migliorare, quali prezzi correggere, quali ingredienti stanno aumentando e quali azioni fare ogni giorno per gestire meglio il locale."

### Frase ancora più diretta

> "Non è un gestionale in più. È il sistema che Le dice dove sta guadagnando e dove sta perdendo soldi."

---

## 4. Problema del ristoratore

Molti ristoratori lavorano tanto, ma non hanno il controllo reale dei numeri.

Problemi frequenti:

- menu creato senza calcolo margini;
- prezzi stabiliti "a sensazione";
- ingredienti aumentati ma listino non aggiornato;
- piatti molto venduti ma poco redditizi;
- personale sovradimensionato rispetto all'incasso;
- sprechi in cucina;
- magazzino non controllato;
- fatture fornitori non analizzate;
- produzione giornaliera non pianificata;
- report giornaliero inesistente;
- nessuna analisi tra vendite, costi e utile reale.

RistoProfit OS deve trasformare questi problemi in funzioni semplici e vendibili.

---

## 5. Promessa principale

La promessa principale deve essere:

**"Le facciamo vedere quanto guadagna davvero su ogni piatto."**

Questa è la frase più potente per vendere il software.

Non vendere subito tutte le funzioni.

Vendere prima il risultato:

- più controllo;
- meno sprechi;
- prezzi corretti;
- margini chiari;
- decisioni più veloci;
- dati ordinati.

---

## 6. Moduli della piattaforma

### Modulo 1 — Food Cost

Funzione principale:

Calcolare il costo reale di ogni piatto, prodotto o preparazione.

Dati richiesti:

- ingredienti;
- prezzo unitario;
- unità di misura;
- grammatura;
- scarto;
- costo packaging;
- IVA;
- prezzo di vendita;
- quantità prodotta;
- porzioni.

Output:

- costo porzione;
- food cost percentuale;
- margine lordo;
- utile per prodotto;
- prezzo minimo consigliato;
- prezzo ideale consigliato;
- alert se il food cost è troppo alto.

Esempio:

- Piatto: Pizza Pistacchio
- Prezzo vendita: 13,00 euro
- Costo ingredienti: 4,20 euro
- Food cost: 32,3%
- Margine lordo: 8,80 euro
- Stato: buono
- Suggerimento: mantenere prezzo o valutare 13,50 euro se aumenta il pistacchio.

### Modulo 2 — Menu Engineering

Funzione principale:

Capire quali prodotti conviene spingere, modificare, aumentare o eliminare.

Classificazione:

| Categoria | Significato | Azione |
|---|---|---|
| Star | vende tanto e margina bene | spingere |
| Puzzle | margina bene ma vende poco | migliorare descrizione/foto |
| Cavallo da lavoro | vende tanto ma margina poco | aumentare prezzo o ridurre costo |
| Dog | vende poco e margina poco | eliminare o sostituire |

Output:

- prodotti migliori;
- prodotti critici;
- prodotti da aumentare;
- prodotti da eliminare;
- combo consigliate;
- suggerimenti per nuovo menu;
- descrizioni persuasive generate con AI.

### Modulo 3 — Fatture fornitori

Funzione principale:

Caricare fatture PDF o foto e aggiornare automaticamente i prezzi degli ingredienti.

Dati estratti:

- fornitore;
- data;
- prodotto;
- quantità;
- prezzo unitario;
- IVA;
- totale;
- variazione rispetto all'ultimo acquisto.

Alert:

> "Il prezzo della mozzarella è aumentato del 9% rispetto all'ultima fattura. Il margine della Pizza Bufala si è ridotto."

### Modulo 4 — Magazzino semplice

Non creare subito un magazzino troppo complesso.

Il primo magazzino deve essere pratico:

- prodotti;
- scorta minima;
- carichi da fattura;
- scarichi manuali;
- prodotti in esaurimento;
- prodotti in scadenza;
- lista riordino;
- invio ordine a fornitore;
- storico prezzi.

Obiettivo:

> "Il ristoratore deve sapere cosa manca, cosa sta aumentando e cosa deve ordinare."

### Modulo 5 — Produzione giornaliera

Utile per:

- bar;
- gelaterie;
- pasticcerie;
- pizzerie;
- gastronomie;
- take away.

Il sistema suggerisce quantità da produrre in base a:

- storico vendite;
- giorno della settimana;
- periodo;
- meteo;
- festività;
- prenotazioni;
- eventi locali;
- vendite precedenti.

Esempio:

> "Sabato scorso hai venduto 48 brioche. Per questo sabato produzione consigliata: 55 brioche."

### Modulo 6 — Personale e incidenza costo lavoro

Non è un software paghe.

Serve a capire se il personale è proporzionato all'incasso.

Dati:

- dipendenti;
- costo orario stimato;
- turni;
- ore lavorate;
- incasso;
- coperti;
- scontrino medio.

Output:

- costo personale giornaliero;
- incidenza personale su incasso;
- costo per coperto;
- produttività per turno;
- alert se il costo è troppo alto.

Esempio:

> "Incasso: 1.200 euro  
> Costo personale stimato: 430 euro  
> Incidenza: 35,8%  
> Attenzione: incidenza elevata."

### Modulo 7 — Report giornaliero

Questa deve essere la funzione più percepita.

Ogni sera il titolare riceve un report.

Canali possibili:

- email;
- WhatsApp Business;
- Telegram;
- notifica app;
- dashboard.

Esempio report:

**REPORT GIORNALIERO — RistoProfit OS**

- Incasso: 2.430 euro
- Coperti: 86
- Scontrino medio: 28,25 euro
- Food cost stimato: 31%
- Costo personale stimato: 520 euro
- Margine lordo stimato: 1.150 euro
- Prodotto più venduto: Pizza Pistacchio
- Prodotto più redditizio: Tagliere Aperitivo
- Prodotto critico: Burger Special, food cost 44%

Ingredienti in aumento:

- Pistacchio +12%
- Mozzarella +8%

Azioni consigliate:

1. Aumentare Burger Special da 11 euro a 13 euro
2. Spingere Tagliere Aperitivo nel weekend
3. Ridurre grammatura mozzarella su Pizza Bufala
4. Riordinare farina e passata

---

## 7. Lato cliente

### Area cliente

Il cliente deve accedere da web e da telefono.

Menu principale:

- Dashboard
- Food Cost
- Ingredienti
- Ricette
- Menu
- Fatture
- Magazzino
- Produzione
- Personale
- Report
- Fornitori
- Impostazioni
- Supporto

### Dashboard cliente

La dashboard deve mostrare:

- incasso del giorno;
- margine stimato;
- food cost medio;
- prodotti critici;
- ingredienti aumentati;
- prodotti sotto scorta;
- costo personale;
- azioni consigliate;
- report ultimo giorno;
- pulsante "carica fattura";
- pulsante "aggiungi ricetta".

---

## 8. Lato admin Emotive

Emotive deve avere un pannello interno.

Funzioni:

- clienti attivi;
- locali;
- piani abbonamento;
- setup da completare;
- ricette caricate;
- fatture caricate;
- report generati;
- alert clienti critici;
- opportunità consulenza;
- venditori;
- referral;
- provvigioni;
- incassi mensili;
- abbonamenti scaduti;
- ticket supporto software.

### Dashboard admin

KPI:

- MRR mensile;
- nuovi clienti;
- setup venduti;
- clienti in prova;
- clienti attivi;
- disdette;
- ricavi per venditore;
- referral attivi;
- tasso conversione demo;
- moduli più venduti;
- clienti da richiamare.

---

## 9. App mobile

### Scelta consigliata

Partire con una PWA, cioè una web app installabile sul telefono.

Il cliente apre il sito e può aggiungerlo alla schermata Home.

### Perché PWA

Vantaggi:

- meno costosa;
- più veloce da sviluppare;
- funziona su Android e iPhone;
- stesso codice della web app;
- non richiede subito Play Store/App Store;
- aggiornamenti immediati;
- ideale per MVP.

### Funzioni mobile iniziali

Il titolare deve poter fare dal telefono:

- vedere dashboard;
- caricare fattura con foto;
- aggiungere ingrediente;
- vedere food cost;
- consultare report;
- ricevere alert;
- approvare ordine fornitore;
- controllare personale;
- vedere prodotti critici;
- consultare azioni consigliate.

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

**Next.js**

Utilizzo:

- sito pubblico;
- landing page;
- area cliente;
- area admin;
- dashboard;
- PWA mobile.

### UI

**Tailwind CSS**

Design:

- premium;
- pulito;
- adatto a ristoratori;
- semplice da usare;
- stile gestionale moderno.

Colori consigliati:

- nero/antracite;
- bianco;
- verde profitto;
- oro leggero;
- grigio caldo.

### Backend e database

**Supabase**

Utilizzo:

- PostgreSQL;
- autenticazione;
- ruoli;
- Row Level Security;
- storage fatture e documenti;
- API;
- Edge Functions;
- realtime;
- gestione multi-tenant.

### Hosting

**Vercel**

Utilizzo:

- deploy web app;
- deploy sito;
- dominio;
- ambiente preview;
- aggiornamenti continui;
- integrazione GitHub.

### AI

Possibili provider:

- OpenRouter;
- modelli economici;
- eventuale Hugging Face;
- in futuro modelli locali.

Funzioni AI:

- analisi ricette;
- suggerimenti prezzi;
- descrizioni menu;
- report giornaliero;
- lettura fatture;
- alert margini;
- consulente virtuale per il ristoratore.

### Pagamenti

Fase iniziale:

- bonifico;
- Stripe Payment Link;
- pagamento manuale registrato in admin.

Fase avanzata:

- Stripe Checkout;
- abbonamenti Stripe;
- fatture ricorrenti;
- rinnovi automatici;
- gestione provvigioni.

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
- Location: La Lumachina Messina
- Users: titolare, manager, dipendenti
- Plan: Pro
- Modules: RistoProfit attivo, RistoCare non attivo

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

- il cliente vede solo i propri dati;
- il venditore vede solo i clienti assegnati;
- il referral vede solo le segnalazioni inviate;
- admin Emotive vede tutto;
- staff cliente vede solo funzioni operative.

---

## 13. Politica prezzi clienti

### Principio

Il prezzo deve avere due componenti:

1. Setup iniziale
2. Canone mensile

Il setup è fondamentale perché il valore iniziale non è solo il software, ma il lavoro di configurazione.

RistoProfit OS richiede:

- inserimento menu;
- inserimento ricette;
- caricamento ingredienti;
- configurazione fornitori;
- impostazione prezzi;
- formazione cliente;
- primo report.

Questo lavoro deve essere pagato.

### Piano Start

- Prezzo mensile: 59 euro/mese
- Setup: 490 euro

Pensato per:

- piccoli bar;
- take away;
- locali semplici;
- piccole attività con pochi prodotti.

Include:

- 1 locale;
- fino a 30 ricette;
- fino a 100 ingredienti;
- food cost base;
- dashboard;
- report settimanale;
- caricamento fatture manuale;
- 1 utente titolare;
- supporto email.

Non include:

- report giornaliero;
- analisi menu avanzata;
- personale;
- AI avanzata;
- consulenza mensile.

### Piano Pro

- Prezzo mensile: 129 euro/mese
- Setup: 990 euro

Pensato per:

- ristoranti;
- pizzerie;
- gelaterie;
- pasticcerie;
- locali con menu strutturato.

Include:

- 1 locale;
- fino a 100 ricette;
- ingredienti illimitati;
- food cost avanzato;
- menu engineering;
- report giornaliero;
- fatture fornitori;
- storico prezzi ingredienti;
- magazzino semplice;
- lista riordino;
- suggerimenti prezzo;
- 3 utenti;
- supporto prioritario.

### Piano Premium

- Prezzo mensile: 249 euro/mese
- Setup: 1.990 euro

Pensato per:

- locali strutturati;
- ristoranti con cucina complessa;
- gelaterie/pasticcerie;
- locali con più reparti;
- attività che vogliono controllo manageriale.

Include:

- tutto il piano Pro;
- utenti fino a 10;
- report WhatsApp/Telegram;
- controllo personale;
- produzione giornaliera consigliata;
- AI advisor;
- analisi menu mensile;
- confronto fornitori;
- report PDF mensile;
- call mensile di controllo;
- supporto prioritario.

### Piano Enterprise

- Prezzo: su preventivo
- Setup: da 3.000 euro

Pensato per:

- catene;
- franchising;
- più punti vendita;
- imprenditori con più locali.

Include:

- multi-sede;
- utenti illimitati;
- report direzionale;
- confronto tra sedi;
- controllo centrale;
- dashboard gruppo;
- account manager;
- integrazioni personalizzate.

---

## 14. Politica sconti

### Regola generale

Non scontare troppo il canone mensile.

Meglio scontare il setup o regalare funzioni extra.

### Sconto lancio

Per i primi 10 clienti a Messina:

- setup Pro a 690 euro invece di 990 euro;
- canone Pro a 99 euro/mese per 12 mesi;
- report iniziale incluso;
- 30 giorni di affiancamento inclusi.

### Sconto clienti Emotive

Per clienti che hanno già acquistato arredi o attrezzature da Emotive:

- sconto setup 20%;
- primo report food cost incluso;
- possibile bundle futuro con RistoCare OS.

### Sconto pagamento annuale

Se il cliente paga 12 mesi anticipati:

- 2 mesi gratuiti;
- oppure 15% di sconto sul canone annuale.

### Sconto multi-modulo futuro

Quando sarà integrato con RistoCare:

- RistoProfit Pro: 129 euro/mese
- RistoCare Pro: 99 euro/mese
- Pacchetto insieme: 199 euro/mese

---

## 15. Come spiegare il prezzo al cliente

### Spiegazione semplice

> "Il costo iniziale serve per configurare il Suo locale: inseriamo menu, ingredienti, ricette, fornitori, prezzi e impostiamo il primo controllo dei margini. Il canone mensile serve per mantenere attiva la piattaforma, aggiornare i dati, generare report, controllare i margini e supportarLa nelle decisioni."

### Frase commerciale

> "Non sta pagando solo un software. Sta pagando un sistema di controllo che Le permette di capire quali prodotti Le fanno guadagnare, quali Le fanno perdere margine e quali azioni fare per migliorare il risultato del locale."

### Frase orientata al ritorno economico

> "Se il sistema Le permette di correggere anche solo 5 prodotti venduti male, recuperare sprechi o aumentare leggermente alcuni prezzi, il canone si ripaga facilmente."

### Esempio pratico

Se un piatto viene venduto 300 volte al mese e viene aumentato di 1 euro perché il food cost era troppo alto, il locale recupera 300 euro al mese solo su quel prodotto.

Un canone da 129 euro/mese può essere recuperato con una sola correzione di prezzo.

---

## 16. Come venderlo ai clienti

### Script breve per venditore

"Abbiamo creato RistoProfit OS, un sistema che aiuta il ristoratore a capire quanto guadagna davvero su ogni piatto. Inseriamo ricette, ingredienti e prezzi di vendita, e il software calcola food cost, margini e prodotti critici. Ogni giorno il titolare può vedere cosa sta andando bene, cosa deve aumentare e dove sta perdendo soldi."

### Script ancora più diretto

"Il problema non è solo vendere. Il problema è sapere se quello che vendi ti lascia margine. RistoProfit OS serve proprio a questo."

### Domande da fare al cliente

- Sa quanto Le costa realmente ogni piatto?
- Ha aggiornato i prezzi dopo gli ultimi aumenti dei fornitori?
- Sa quali prodotti vendono tanto ma Le lasciano poco margine?
- Ha un report giornaliero con incasso, food cost e personale?
- Decide i prezzi con dati o a sensazione?
- Sa quanto incide il personale sull'incasso?
- Le capita di accorgersi troppo tardi che un ingrediente è aumentato?

### Risposta se il cliente dice "ho già il gestionale"

"Perfetto. RistoProfit OS non vuole sostituire il gestionale o la cassa. Serve a leggere i dati e trasformarli in decisioni: margini, food cost, menu, prezzi, fornitori e report economico."

### Risposta se il cliente dice "non ho tempo"

"Proprio per questo esiste il setup iniziale. La prima configurazione la facciamo noi. Lei deve solo darci menu, listino, fatture fornitori e ricette principali."

### Risposta se il cliente dice "costa troppo"

"Capisco. Il punto è capire quanto Le costa non avere controllo sui margini. Basta un prodotto venduto molto con prezzo sbagliato per perdere più del canone mensile."

---

## 17. Offerte vendibili

### Offerta 1 — Analisi Food Cost iniziale

Prezzo: 490 euro

Include:

- analisi 20 prodotti;
- calcolo food cost;
- margine;
- suggerimenti prezzo;
- report PDF;
- proposta attivazione RistoProfit.

Questa offerta può essere usata come ingresso.

### Offerta 2 — Setup RistoProfit Pro

Prezzo: 990 euro + 129 euro/mese

Include:

- configurazione locale;
- caricamento menu;
- caricamento ingredienti;
- prime 50 ricette;
- dashboard;
- report giornaliero;
- formazione titolare.

### Offerta 3 — Revisione menu e listino

Prezzo: 1.500 - 3.000 euro

Include:

- analisi food cost;
- menu engineering;
- aumento prezzi consigliato;
- nuova struttura menu;
- descrizioni persuasive;
- report finale.

### Offerta 4 — Pacchetto gestione mensile

Prezzo: 299 - 599 euro/mese

Include:

- RistoProfit Premium;
- controllo mensile;
- report consulenziale;
- call mensile;
- aggiornamento prezzi fornitori;
- suggerimenti menu.

---

## 18. Referral e affiliazione

### Obiettivo

Creare un sistema per far portare clienti da:

- venditori interni;
- collaboratori;
- agenti;
- consulenti HACCP;
- commercialisti;
- tecnici;
- fornitori food;
- agenti caffè;
- agenti beverage;
- architetti;
- clienti soddisfatti;
- professionisti locali.

### Tipi di partner

**Segnalatore semplice**  
Porta il nome di un potenziale cliente.

Compenso:

- Start: 50 euro
- Pro: 100 euro
- Premium: 200 euro
- Enterprise: accordo dedicato

Pagamento:

- dopo pagamento setup;
- oppure dopo incasso primo canone.

**Partner commerciale**  
Segue il cliente fino alla vendita.

Compenso:

- 10% sul setup;
- 10% del canone per 6 mesi;
- bonus al raggiungimento obiettivi.

**Venditore interno**

Ha obiettivi mensili.

Compenso consigliato:

- 15% sul setup;
- 10% del canone per 12 mesi;
- bonus trimestrale;
- extra se vende Premium o Enterprise.

---

## 19. Piano provvigioni venditori

### Venditore base

| Vendita | Provvigione |
|---|---|
| Analisi Food Cost 490 euro | 50 euro |
| Setup Start 490 euro | 75 euro |
| Setup Pro 990 euro | 150 euro |
| Setup Premium 1.990 euro | 300 euro |
| Canone Start | 10% per 6 mesi |
| Canone Pro | 10% per 12 mesi |
| Canone Premium | 10% per 12 mesi |

### Venditore senior

Dopo 5 clienti attivi:

- 20% sul setup;
- 10% canone per 12 mesi;
- bonus 300 euro ogni 5 clienti Pro/Premium.

### Bonus trimestrale

| Risultato trimestrale | Bonus |
|---|---|
| 5 clienti attivi | 300 euro |
| 10 clienti attivi | 800 euro |
| 15 clienti attivi | 1.500 euro |
| 25 clienti attivi | 3.000 euro |

### Regola importante

La provvigione ricorrente si paga solo se:

- il cliente paga regolarmente;
- non disdice;
- non è insolvente;
- il venditore ha seguito correttamente il processo;
- il cliente è stato registrato nel CRM prima della trattativa.

---

## 20. Come stimolare i venditori

### Dashboard venditori

Ogni venditore deve vedere:

- lead assegnati;
- trattative aperte;
- demo fatte;
- clienti chiusi;
- setup venduti;
- MRR generato;
- provvigioni maturate;
- provvigioni pagate;
- classifica venditori.

### Gamification

Creare classifiche:

- venditore del mese;
- maggior MRR;
- più demo fissate;
- più clienti Pro;
- più upgrade Premium;
- miglior tasso conversione.

### Premi non solo economici

- bonus denaro;
- cena premio;
- weekend;
- premio tecnologia;
- percentuale extra;
- lead migliori assegnati;
- ruolo area manager.

Frase motivazionale per venditori:

> "Non stiamo vendendo software. Stiamo vendendo controllo economico a imprenditori che ogni giorno rischiano di lavorare tanto senza sapere quanto guadagnano davvero."

---

## 21. Regole referral

### Quando si matura il premio

Il premio si matura quando:

- il cliente firma;
- paga setup;
- attiva canone;
- supera eventuale periodo di prova;
- non era già presente nel database.

### Lead già esistenti

Se il cliente era già presente nel CRM, il referral non viene riconosciuto, salvo approvazione manuale.

### Durata protezione lead

Un referral protegge il partner per 90 giorni.

Se entro 90 giorni il cliente non compra, il lead torna libero.

### Tracciamento

Ogni segnalazione deve avere:

- nome partner;
- codice partner;
- data segnalazione;
- nome cliente;
- telefono;
- città;
- stato;
- piano venduto;
- premio maturato;
- premio pagato.

---

## 22. Portale referral

Il portale referral deve permettere al partner di:

- registrarsi;
- inserire lead;
- vedere stato lead;
- vedere premi maturati;
- vedere premi pagati;
- scaricare materiale commerciale;
- copiare link referral.

### Stati lead

- Nuovo
- Contattato
- Demo fissata
- Preventivo inviato
- In trattativa
- Chiuso vinto
- Chiuso perso
- Non valido
- Già presente
- Premio maturato
- Premio pagato

---

## 23. Sito pubblico

### Pagine principali

- Home
- Come funziona
- Food Cost
- Menu Engineering
- Prezzi
- Per ristoranti
- Per bar
- Per pizzerie
- Per gelaterie
- Referral
- Demo
- Contatti
- Login

### Homepage

**Hero**

Titolo:

Scopri quanto guadagni davvero su ogni piatto

Sottotitolo:

RistoProfit OS è il cruscotto economico per ristoranti, bar, pizzerie e gelaterie. Calcola food cost, margini, prezzi consigliati, sprechi, fornitori e report giornalieri.

CTA:

- Richiedi una demo
- Calcola il tuo food cost

**Sezione problema**

Titolo:

Vendere tanto non significa guadagnare bene

Testo:

Ingredienti in aumento, menu non aggiornati, piatti con margini bassi e personale costoso possono ridurre il profitto del locale senza che il titolare se ne accorga.

**Sezione soluzione**

Titolo:

RistoProfit OS trasforma ricette, fatture e vendite in decisioni

Punti:

- calcolo food cost;
- margine per piatto;
- menu engineering;
- prezzi consigliati;
- report giornaliero;
- alert ingredienti;
- controllo personale.

**Sezione pacchetti**

Mostrare Start, Pro, Premium, Enterprise.

**CTA finale**

Vuole sapere quali prodotti Le fanno guadagnare davvero?

CTA:

- Prenota analisi iniziale
- Richiedi demo

---

## 24. Prompt master per Cursor/Codex

Crea una piattaforma SaaS chiamata RistoProfit OS, gestita da Emotive S.r.l., dedicata a ristoranti, bar, pizzerie, gelaterie e locali food.

La piattaforma deve aiutare il ristoratore a controllare food cost, margini, menu, ingredienti, fatture fornitori, magazzino, personale e report giornalieri.

La piattaforma deve essere separata da RistoCare OS, che è il programma già in sviluppo per assistenza, attrezzature, ticket, ricambi e manutenzioni, ma deve essere progettata per integrazione futura in RistoSuite OS.

Stack tecnico:

- Next.js
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security
- Vercel
- PWA installabile su mobile
- predisposizione futura per Capacitor e app mobile

Ruoli:

- super_admin
- admin_emotive
- operator_emotive
- sales_agent
- customer_owner
- customer_manager
- customer_staff
- referral_partner

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

- premium;
- moderno;
- semplice;
- adatto al mondo ristorazione;
- mobile first;
- colori nero/antracite, bianco, verde, oro leggero.

La piattaforma deve essere multi-tenant: ogni cliente deve vedere solo i propri dati.

Crea struttura database, pagine, componenti, layout, policy RLS, dashboard, modelli dati, flussi principali e prima versione MVP.

---

## 25. Roadmap sviluppo

### Fase 1 — MVP 30/45 giorni

Funzioni:

- sito pubblico;
- login;
- organizzazioni;
- locali;
- ingredienti;
- ricette;
- calcolo food cost;
- dashboard cliente;
- dashboard admin;
- report PDF base;
- PWA;
- piano prezzi;
- area venditori base;
- area referral base.

### Fase 2 — Vendibile 60/90 giorni

Aggiungere:

- upload fatture;
- storico prezzi;
- menu engineering;
- magazzino base;
- report giornaliero;
- gestione personale base;
- provvigioni venditori;
- referral tracking;
- notifiche email.

### Fase 3 — Automazioni

Aggiungere:

- lettura fatture con AI;
- report automatico;
- WhatsApp Business;
- Stripe;
- abbonamenti;
- reminder;
- suggerimenti prezzi;
- analisi menu mensile.

### Fase 4 — Integrazione con RistoCare OS

Aggiungere:

- cliente unico;
- locale unico;
- login unico;
- dashboard RistoSuite;
- collegamento attrezzature;
- collegamento report operativo;
- pacchetti combinati.

---

## 26. Strategia di lancio a Messina

### Primi clienti pilota

Scegliere 5 locali:

- 1 pizzeria;
- 1 gelateria;
- 1 bar;
- 1 ristorante;
- 1 pasticceria.

Offerta pilota:

- setup agevolato;
- canone Pro a 99 euro/mese per 12 mesi;
- analisi food cost inclusa;
- testimonianza richiesta;
- autorizzazione a usare risultati in forma anonima.

### Obiettivo pilota

Ottenere:

- casi studio;
- screenshot dashboard;
- esempi aumento margini;
- testimonianze;
- materiale per venditori;
- miglioramento software.

---

## 27. Materiale per venditori

### Scheda prodotto una pagina

Deve contenere:

- problema;
- soluzione;
- benefici;
- piani;
- esempio economico;
- call to action.

### Demo script

1. Mostrare dashboard.
2. Mostrare ricetta.
3. Mostrare food cost.
4. Mostrare prezzo consigliato.
5. Mostrare prodotto critico.
6. Mostrare report giornaliero.
7. Chiudere con setup e canone.

Frase chiusura:

> "La domanda non è se Le serve un altro software. La domanda è se oggi sa con precisione quanto guadagna su ogni piatto. Se la risposta è no, RistoProfit OS serve proprio a questo."

---

## 28. Conclusione

La strategia migliore è:

1. Continuare RistoCare OS come programma assistenza separato.
2. Creare RistoProfit OS come programma economico/gestionale per ristoratori.
3. Strutturare entrambi per futura integrazione in RistoSuite OS.
4. Partire da Messina con clienti pilota.
5. Monetizzare con setup + canone mensile.
6. Creare venditori motivati con provvigioni su setup e canoni.
7. Creare referral per professionisti e clienti.
8. Usare PWA per mobile e trasformare in app vera solo dopo validazione.
9. Non vendere "software", ma controllo economico, margini e decisioni.

La frase finale da usare sempre è:

> "RistoProfit OS Le fa vedere dove guadagna, dove perde e cosa deve correggere per migliorare il risultato del Suo locale."
