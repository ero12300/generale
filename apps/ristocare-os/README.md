# RistoCare OS

Programma Next.js separato per trasformare il documento strategico RistoCare OS in una prima web app dimostrabile.

## Cosa include

- Landing page premium per il mercato Ho.Re.Ca.
- Modello contenuti TypeScript per piani commerciali, ruoli, workflow e stati ticket.
- Test Vitest sui contenuti principali estratti dal documento.
- Porta di sviluppo dedicata `3001`, così può girare accanto all'app Deal Desk.

## Comandi

```bash
pnpm dev:ristocare
pnpm test:ristocare
pnpm build:ristocare
```

## Prossimi blocchi naturali

1. Schema Supabase multi-tenant per organizzazioni, locali, attrezzature e ticket.
2. Login e ruoli: super admin, operatore, cliente, tecnico, referral.
3. Area cliente con dashboard, lista attrezzature e apertura ticket da QR.
4. Area admin RistoCare per qualificare ticket, assegnare tecnico e preparare preventivo.

Il documento originale resta la fonte strategica; questa cartella avvia il prodotto in modo piccolo e verificabile.
