-- RistoProfit su Supabase condiviso (RistoCare) — schema profit
-- Vedi migrazione applicata: profit_schema_and_storage

-- Per deploy standalone, usare 20250613000000_ristoprofit_initial.sql

CREATE SCHEMA IF NOT EXISTS profit;

-- Documentazione: tabelle in schema `profit` con FK a public.organizations
-- Storage bucket: profit-invoices
