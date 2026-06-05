# ADR-003: Separazione motore analitico Python

## Stato
Accettato

## Contesto
Formule finanziarie (NPV, IRR, DSCR) richiedono precisione Decimal e testabilità. TypeScript nel frontend non è ideale per il calcolo.

## Decisione
FastAPI + Pydantic in `services/analytics`. Next.js fa proxy via API routes. Frontend mostra solo risultati.

## Conseguenze
- Deploy separato del servizio analytics
- Contratto API versionato `/v1/analysis`
- Test pytest per ogni formula
