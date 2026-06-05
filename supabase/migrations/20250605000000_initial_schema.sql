-- Deal Desk Immobiliare — Schema iniziale
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE deal_stage AS ENUM (
  'lead', 'analysis', 'offer', 'renovation', 'rental', 'exit', 'archived'
);
CREATE TYPE deal_strategy AS ENUM (
  'fix_flip', 'buy_renovate_rent', 'buy_hold_sell'
);
CREATE TYPE property_status AS ENUM ('draft', 'confirmed');
CREATE TYPE work_category AS ENUM (
  'demolition', 'masonry', 'electrical', 'plumbing', 'hvac',
  'windows', 'drywall', 'flooring', 'tiling', 'painting',
  'bathroom', 'kitchen', 'doors', 'lighting', 'furnishing',
  'disposal', 'inspection'
);
CREATE TYPE work_status AS ENUM ('planned', 'in_progress', 'done', 'cancelled');
CREATE TYPE org_role AS ENUM ('owner', 'admin', 'analyst', 'viewer');

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  vat_number text,
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'analyst',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Tax profiles (SRL parametric)
CREATE TABLE tax_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  ires_rate numeric(5,4) NOT NULL DEFAULT 0.24,
  irap_rate numeric(5,4) NOT NULL DEFAULT 0.039,
  registration_tax_rate numeric(5,4) NOT NULL DEFAULT 0.09,
  vat_rate numeric(5,4) NOT NULL DEFAULT 0.22,
  seller_type text NOT NULL DEFAULT 'private' CHECK (seller_type IN ('private', 'company')),
  tax_regime text NOT NULL DEFAULT 'registry' CHECK (tax_regime IN ('registry', 'vat')),
  rental_registration_rate numeric(5,4) NOT NULL DEFAULT 0.02,
  is_default boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Deals
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  stage deal_stage NOT NULL DEFAULT 'lead',
  strategy deal_strategy NOT NULL DEFAULT 'fix_flip',
  source_url text,
  assigned_to uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE deal_stage_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage deal_stage,
  to_stage deal_stage NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz NOT NULL DEFAULT now(),
  note text
);

-- Properties
CREATE TABLE normalized_properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL UNIQUE REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status property_status NOT NULL DEFAULT 'draft',
  price_asked numeric(14,2),
  surface_sqm numeric(10,2),
  address text,
  zone text,
  city text,
  province text,
  property_type text,
  condition text,
  rooms integer,
  floor text,
  energy_class text,
  condo_fees_monthly numeric(10,2),
  has_elevator boolean,
  has_terrace boolean,
  has_parking boolean,
  description text,
  media_urls jsonb NOT NULL DEFAULT '[]',
  location geography(POINT, 4326),
  raw_fields jsonb NOT NULL DEFAULT '{}',
  confirmed_at timestamptz,
  confirmed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE property_snapshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_url text NOT NULL,
  snapshot_type text NOT NULL CHECK (snapshot_type IN ('html', 'screenshot', 'json')),
  content jsonb NOT NULL DEFAULT '{}',
  captured_at timestamptz NOT NULL DEFAULT now()
);

-- Analysis
CREATE TABLE analysis_runs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tax_profile_id uuid REFERENCES tax_profiles(id),
  assumptions jsonb NOT NULL DEFAULT '{}',
  results jsonb NOT NULL DEFAULT '{}',
  version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Offer letters
CREATE TABLE offer_letters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  offered_price numeric(14,2) NOT NULL,
  commercial_text text NOT NULL,
  legal_placeholders jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Work items
CREATE TABLE work_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  room text,
  category work_category NOT NULL,
  description text NOT NULL,
  unit text NOT NULL DEFAULT 'cad',
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  supplier text,
  priority integer NOT NULL DEFAULT 3,
  depends_on uuid[] DEFAULT '{}',
  status work_status NOT NULL DEFAULT 'planned',
  requires_permit boolean NOT NULL DEFAULT false,
  attachments jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Documents
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  category text,
  embedding vector(384),
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Rentals
CREATE TABLE rental_contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tenant_name text,
  monthly_rent numeric(12,2) NOT NULL,
  start_date date,
  end_date date,
  registration_done boolean NOT NULL DEFAULT false,
  condo_fees_tenant numeric(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Freedom coverage
CREATE TABLE freedom_snapshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  active_income numeric(14,2) NOT NULL DEFAULT 0,
  passive_income numeric(14,2) NOT NULL DEFAULT 0,
  fixed_expenses numeric(14,2) NOT NULL DEFAULT 0,
  liquidity numeric(14,2) NOT NULL DEFAULT 0,
  reserves numeric(14,2) NOT NULL DEFAULT 0,
  coverage_ratio numeric(8,4) NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_deals_org_stage ON deals(organization_id, stage);
CREATE INDEX idx_properties_org ON normalized_properties(organization_id);
CREATE INDEX idx_work_items_deal ON work_items(deal_id);
CREATE INDEX idx_analysis_runs_deal ON analysis_runs(deal_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON normalized_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER work_items_updated_at BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper: get user's organization ids
CREATE OR REPLACE FUNCTION user_organization_ids()
RETURNS SETOF uuid AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE normalized_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE freedom_snapshots ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY org_select ON organizations FOR SELECT
  USING (id IN (SELECT user_organization_ids()));
CREATE POLICY org_insert ON organizations FOR INSERT
  WITH CHECK (true);
CREATE POLICY org_update ON organizations FOR UPDATE
  USING (id IN (SELECT user_organization_ids()));

-- Members policies
CREATE POLICY members_select ON organization_members FOR SELECT
  USING (organization_id IN (SELECT user_organization_ids()));
CREATE POLICY members_insert ON organization_members FOR INSERT
  WITH CHECK (organization_id IN (SELECT user_organization_ids()) OR NOT EXISTS (
    SELECT 1 FROM organization_members WHERE user_id = auth.uid()
  ));
CREATE POLICY members_update ON organization_members FOR UPDATE
  USING (organization_id IN (SELECT user_organization_ids()));

-- Generic org-scoped policies macro pattern
CREATE POLICY tax_profiles_all ON tax_profiles FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY deals_all ON deals FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY deal_history_select ON deal_stage_history FOR SELECT
  USING (deal_id IN (SELECT id FROM deals WHERE organization_id IN (SELECT user_organization_ids())));
CREATE POLICY deal_history_insert ON deal_stage_history FOR INSERT
  WITH CHECK (deal_id IN (SELECT id FROM deals WHERE organization_id IN (SELECT user_organization_ids())));

CREATE POLICY properties_all ON normalized_properties FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY snapshots_all ON property_snapshots FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY analysis_all ON analysis_runs FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY offers_all ON offer_letters FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY work_items_all ON work_items FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY documents_all ON documents FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY rentals_all ON rental_contracts FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY freedom_all ON freedom_snapshots FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));
