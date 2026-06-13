-- RistoCare OS — Schema iniziale MVP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM (
  'super_admin', 'operator', 'customer_admin', 'customer_staff', 'technician', 'referral_partner'
);
CREATE TYPE subscription_plan AS ENUM ('start', 'pro', 'premium', 'enterprise');
CREATE TYPE organization_status AS ENUM ('active', 'trial', 'suspended', 'cancelled');
CREATE TYPE equipment_category AS ENUM (
  'frigo', 'freezer', 'abbattitore', 'lavastoviglie', 'forno', 'friggitrice',
  'piano_cottura', 'vetrina_gelato', 'vetrina_refrigerata', 'banco_bar', 'retrobanco',
  'cappa', 'aspirazione', 'macchina_caffe', 'macinacaffe', 'addolcitore',
  'impastatrice', 'planetaria', 'affettatrice', 'registratore_cassa', 'climatizzatore', 'altro'
);
CREATE TYPE warranty_status AS ENUM ('active', 'expiring', 'expired', 'unknown');
CREATE TYPE equipment_status AS ENUM ('active', 'maintenance', 'broken', 'retired');
CREATE TYPE ticket_status AS ENUM (
  'new', 'in_review', 'info_requested', 'awaiting_technician', 'quote_received',
  'quote_sent', 'accepted', 'scheduled', 'in_progress', 'awaiting_spare',
  'resolved', 'closed', 'not_covered', 'disputed', 'cancelled'
);
CREATE TYPE ticket_urgency AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE document_type AS ENUM ('manual', 'invoice', 'certificate', 'photo', 'label_photo', 'report', 'quote', 'other');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE referral_status AS ENUM ('lead', 'contacted', 'converted', 'rejected', 'duplicate');
CREATE TYPE reward_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  vat_number text,
  fiscal_code text,
  billing_email text,
  phone text,
  address text,
  city text NOT NULL DEFAULT 'Messina',
  province text NOT NULL DEFAULT 'ME',
  region text NOT NULL DEFAULT 'Sicilia',
  status organization_status NOT NULL DEFAULT 'trial',
  plan subscription_plan NOT NULL DEFAULT 'start',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  phone text,
  manager_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer_staff',
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE equipment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  category equipment_category NOT NULL DEFAULT 'altro',
  brand text,
  model text,
  serial_number text,
  supplier text,
  purchase_date date,
  delivery_date date,
  installation_date date,
  warranty_start date,
  warranty_end date,
  warranty_status warranty_status NOT NULL DEFAULT 'unknown',
  area text,
  notes text,
  qr_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status equipment_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE equipment_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE technicians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  company_name text,
  phone text NOT NULL,
  email text,
  categories equipment_category[] NOT NULL DEFAULT '{}',
  city text NOT NULL,
  province text NOT NULL,
  rating_internal numeric(3,2) NOT NULL DEFAULT 0,
  notes_internal text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES equipment(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  urgency ticket_urgency NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'new',
  warranty_check boolean,
  customer_visible_status text,
  internal_notes text,
  opened_by uuid REFERENCES auth.users(id),
  assigned_operator_id uuid REFERENCES auth.users(id),
  assigned_technician_id uuid REFERENCES technicians(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE ticket_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE technician_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  technician_id uuid NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  internal_price numeric(12,2),
  availability text,
  response_status text NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  internal_cost numeric(12,2) NOT NULL,
  customer_price numeric(12,2) NOT NULL,
  margin numeric(12,2) NOT NULL,
  status quote_status NOT NULL DEFAULT 'draft',
  accepted_at timestamptz,
  valid_until date,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_name text NOT NULL,
  partner_type text NOT NULL,
  phone text,
  email text,
  referred_company text NOT NULL,
  referred_contact text,
  status referral_status NOT NULL DEFAULT 'lead',
  plan_sold subscription_plan,
  reward_amount numeric(12,2),
  reward_status reward_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_equipment_org ON equipment(organization_id);
CREATE INDEX idx_equipment_qr ON equipment(qr_token);
CREATE INDEX idx_tickets_org ON tickets(organization_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_locations_org ON locations(organization_id);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION user_organization_ids()
RETURNS SETOF uuid AS $$
  SELECT organization_id FROM memberships WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_role_check(allowed user_role[])
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid() AND role = ANY(allowed)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY org_select ON organizations FOR SELECT USING (
  id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY loc_select ON locations FOR SELECT USING (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY eq_select ON equipment FOR SELECT USING (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY eq_insert ON equipment FOR INSERT WITH CHECK (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY eq_update ON equipment FOR UPDATE USING (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY ticket_select ON tickets FOR SELECT USING (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
  OR assigned_technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
);

CREATE POLICY ticket_insert ON tickets FOR INSERT WITH CHECK (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY ticket_update ON tickets FOR UPDATE USING (
  organization_id IN (SELECT user_organization_ids())
  OR user_role_check(ARRAY['super_admin', 'operator']::user_role[])
  OR assigned_technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
);

CREATE POLICY tech_select ON technicians FOR SELECT USING (
  user_role_check(ARRAY['super_admin', 'operator']::user_role[])
  OR user_id = auth.uid()
);

CREATE POLICY quote_select ON quotes FOR SELECT USING (
  user_role_check(ARRAY['super_admin', 'operator']::user_role[])
  OR ticket_id IN (
    SELECT id FROM tickets WHERE organization_id IN (SELECT user_organization_ids())
  )
);

CREATE POLICY quote_insert ON quotes FOR INSERT WITH CHECK (
  user_role_check(ARRAY['super_admin', 'operator']::user_role[])
);

CREATE POLICY referral_select ON referrals FOR SELECT USING (
  user_role_check(ARRAY['super_admin', 'operator', 'referral_partner']::user_role[])
);

CREATE POLICY referral_insert ON referrals FOR INSERT WITH CHECK (true);
