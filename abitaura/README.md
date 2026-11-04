# ABITAURA | Interior Design & Valorizzazione

Sito premium mobile-first ricostruito dalle pagine Notion del brand.

## Funzioni
- Landing e servizi, gallery con foto di ispirazione, Home Value Check.
- Chatbot FAQ guidato: `POST /api/chat`. È volutamente gratuito, non usa un modello AI esterno.
- Form contatti con validazione e persistenza: `POST /api/leads` su Supabase.
- Health: `GET /api/health`.

## Backend e sicurezza
Tabella `public.abitaura_leads` nel progetto Supabase gruppo, con RLS attiva e sola INSERT concessa ad anon. Nessuna SELECT, UPDATE o DELETE pubblica. La chiave nel codice è publishable e non service-role. L'amministrazione dei lead è riservata alla dashboard del database fino all'integrazione CRM centrale.

## Per la pubblicazione
- Completare l'informativa GDPR (titolare, email privacy, retention e fornitori).
- Confermare dominio e master logo; foto d'ispirazione non sono case study.
- Attivare rate limiting persistente e CAPTCHA quando partono campagne.
- Prezzi pacchetti non pubblicati perché ancora da approvare.

## Stack
Vercel static + Node.js functions + Supabase REST/RLS, nessun package frontend richiesto.
