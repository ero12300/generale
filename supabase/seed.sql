-- Deal Desk Immobiliare — seed minimo per ambienti di sviluppo.
-- Da eseguire DOPO la migrazione iniziale, e SOLO in ambienti dev/staging.
-- Crea una organization demo e un tax profile predefinito SRL.

DO $$
DECLARE
  demo_org_id uuid;
BEGIN
  -- Inserisci organizzazione demo solo se non esiste già una con questo nome.
  SELECT id INTO demo_org_id
  FROM organizations
  WHERE name = 'Immobiliare Demo SRL';

  IF demo_org_id IS NULL THEN
    INSERT INTO organizations (name, vat_number, settings)
    VALUES (
      'Immobiliare Demo SRL',
      'IT00000000000',
      jsonb_build_object('locale', 'it', 'currency', 'EUR')
    )
    RETURNING id INTO demo_org_id;

    -- Tax profile SRL parametrico — IRES 24%, IRAP 3.9%, registro 9%.
    INSERT INTO tax_profiles (
      organization_id, name,
      ires_rate, irap_rate, registration_tax_rate, vat_rate,
      seller_type, tax_regime, rental_registration_rate,
      is_default
    ) VALUES (
      demo_org_id, 'SRL — Default Italia',
      0.24, 0.039, 0.09, 0.22,
      'private', 'registry', 0.02,
      true
    );
  END IF;
END
$$;

-- Nota: i record business (deals, properties, work_items, ...) non sono
-- seedati: usa il flusso "Nuovo deal" dell'app per popolarli, oppure i
-- demo data in-memory di apps/web/src/lib/demo-store.ts quando le env
-- Supabase non sono configurate.
