# ADR 004 - Barber suite premium su Vercel + Firebase

## Stato

Accepted

## Contesto

Il repository nasce come prodotto immobiliare, ma per questa iterazione serve una verticalizzazione
rapida verso un gestionale premium per barber shop con:

- prenotazioni integrate
- database clienti
- gestione incassi
- campagne sconto e referral
- possibilita di monetizzare il software con abbonamenti

## Decisione

Per la nuova esperienza barber adottiamo questo assetto:

1. **Next.js su Vercel** come frontend e shell SaaS
2. **Firebase-ready** per auth e persistenza operativa del dominio barber
3. **Stripe-ready** per monetizzazione ricorrente Basic / Pro / Multi-store
4. **Demo mode locale** per mostrare il prodotto senza blocchi infrastrutturali

## Motivazione

- Vercel e ottimo per distribuire un frontend premium veloce e iterare rapidamente.
- Firebase e adatto a un MVP scalabile con autenticazione, database documentale e notifiche.
- Stripe e lo standard piu diretto per vendere il gestionale come prodotto SaaS.
- Il demo mode permette di mantenere il repository verificabile anche senza credenziali cloud.

## Implicazioni

- Il dominio barber viene modellato con tipi dedicati e flussi distinti da quello immobiliare.
- Le pagine principali devono restare accessibili via tastiera e mostrare stati loading/error/success.
- La monetizzazione SaaS viene esposta nel prodotto tramite piani chiari e funnel di upgrade.
