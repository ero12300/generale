-- RistoProfit OS — Schema iniziale MVP
-- Emotive S.r.l. — multi-tenant con RLS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE rp_user_role AS ENUM (
  'super_admin', 'admin_emotive', 'operator_emotive', 'sales_agent',
  'customer_owner', 'customer_manager', 'customer_staff', 'accountant', 'referral_partner'
);
CREATE TYPE rp_plan_tier AS ENUM ('start', 'pro', 'premium', 'enterprise');
CREATE TYPE rp_subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled');
CREATE TYPE rp_lead_status AS ENUM (
  'new', 'contacted', 'demo_scheduled', 'quote_sent', 'negotiating',
  'won', 'lost', 'invalid', 'duplicate', 'reward_pending', 'reward_paid'
);
CREATE TYPE rp_unit AS ENUM ('g', 'kg', 'ml', 'l', 'pz', 'conf');
CREATE TYPE rp_stock_movement_type AS ENUM ('in', 'out', 'adjustment');

-- Organizzazioni e locali
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  vat_number text,
  city text,
  province text,
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  city text,
  province text,
  business_type text,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role rp_user_role NOT NULL DEFAULT 'customer_owner',
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Piani e abbonamenti
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier rp_plan_tier NOT NULL UNIQUE,
  name text NOT NULL,
  monthly_price_cents integer NOT NULL,
  setup_price_cents integer NOT NULL,
  max_recipes integer,
  max_ingredients integer,
  max_users integer NOT NULL DEFAULT 1,
  max_locations integer NOT NULL DEFAULT 1,
  features jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id),
  status rp_subscription_status NOT NULL DEFAULT 'trial',
  modules text[] NOT NULL DEFAULT ARRAY['ristoprofit'],
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Fornitori e ingredienti
CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  name text NOT NULL,
  unit rp_unit NOT NULL DEFAULT 'kg',
  unit_price_cents integer NOT NULL DEFAULT 0,
  waste_percent numeric(5,2) NOT NULL DEFAULT 0,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  min_stock numeric(12,3),
  current_stock numeric(12,3),
  vat_rate numeric(5,4) NOT NULL DEFAULT 0.10,
  last_price_change_percent numeric(6,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ricette
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text,
  sale_price_cents integer NOT NULL DEFAULT 0,
  vat_rate numeric(5,4) NOT NULL DEFAULT 0.10,
  portions integer NOT NULL DEFAULT 1,
  packaging_cost_cents integer NOT NULL DEFAULT 0,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recipe_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity numeric(12,4) NOT NULL,
  unit rp_unit NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Menu e vendite
CREATE TABLE menus (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id uuid NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true
);

CREATE TABLE sales_daily (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sale_date date NOT NULL,
  revenue_cents integer NOT NULL DEFAULT 0,
  covers integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, location_id, sale_date)
);

CREATE TABLE sales_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sales_daily_id uuid NOT NULL REFERENCES sales_daily(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  revenue_cents integer NOT NULL DEFAULT 0
);

-- Fatture fornitori
CREATE TABLE supplier_invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  invoice_number text,
  invoice_date date,
  total_cents integer,
  document_path text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE supplier_invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES supplier_invoices(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity numeric(12,4),
  unit_price_cents integer,
  vat_rate numeric(5,4),
  total_cents integer,
  price_change_percent numeric(6,2)
);

-- Magazzino
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  quantity numeric(12,3) NOT NULL DEFAULT 0,
  expiry_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stock_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  movement_type rp_stock_movement_type NOT NULL,
  quantity numeric(12,3) NOT NULL,
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Produzione e personale
CREATE TABLE production_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  plan_date date NOT NULL,
  suggested_quantity integer NOT NULL,
  actual_quantity integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  name text NOT NULL,
  role_label text,
  hourly_cost_cents integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff_shifts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_member_id uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  shift_date date NOT NULL,
  hours_worked numeric(5,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Report e AI
CREATE TABLE daily_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  report_date date NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  sent_channels text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, location_id, report_date)
);

CREATE TABLE ai_suggestions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  suggestion_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Pagamenti e documenti
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('setup', 'subscription', 'consulting')),
  method text NOT NULL DEFAULT 'bank_transfer' CHECK (method IN ('bank_transfer', 'stripe', 'manual')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  storage_path text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  channel text NOT NULL DEFAULT 'in_app',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Venditori e referral
CREATE TABLE sales_agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_senior boolean NOT NULL DEFAULT false,
  commission_setup_percent numeric(5,2) NOT NULL DEFAULT 15,
  commission_recurring_percent numeric(5,2) NOT NULL DEFAULT 10,
  recurring_months integer NOT NULL DEFAULT 12,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE agent_commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id uuid NOT NULL REFERENCES sales_agents(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL,
  commission_type text NOT NULL CHECK (commission_type IN ('setup', 'recurring', 'bonus')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  period_month date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referral_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  partner_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid NOT NULL REFERENCES referral_partners(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  phone text NOT NULL,
  city text,
  status rp_lead_status NOT NULL DEFAULT 'new',
  plan_tier rp_plan_tier,
  reward_cents integer,
  protected_until date,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referral_rewards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id uuid NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sales_targets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id uuid NOT NULL REFERENCES sales_agents(id) ON DELETE CASCADE,
  target_month date NOT NULL,
  clients_target integer NOT NULL DEFAULT 5,
  mrr_target_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indici
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_org ON memberships(organization_id);
CREATE INDEX idx_ingredients_org ON ingredients(organization_id);
CREATE INDEX idx_recipes_org ON recipes(organization_id);
CREATE INDEX idx_sales_daily_org_date ON sales_daily(organization_id, sale_date);
CREATE INDEX idx_referrals_partner ON referrals(partner_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- Seed piani
INSERT INTO plans (tier, name, monthly_price_cents, setup_price_cents, max_recipes, max_ingredients, max_users, max_locations, features) VALUES
  ('start', 'Start', 5900, 49000, 30, 100, 1, 1, '["food_cost_base","dashboard","weekly_report"]'),
  ('pro', 'Pro', 12900, 99000, 100, NULL, 3, 1, '["food_cost_advanced","menu_engineering","daily_report","invoices","inventory"]'),
  ('premium', 'Premium', 24900, 199000, NULL, NULL, 10, 1, '["all_pro","staff","production","ai_advisor"]'),
  ('enterprise', 'Enterprise', 0, 300000, NULL, NULL, 999, 99, '["multi_location","custom_integrations"]');

-- Helper: org dell'utente corrente
CREATE OR REPLACE FUNCTION rp_user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM memberships WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION rp_is_emotive_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin_emotive', 'operator_emotive')
  );
$$;

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies tenant
CREATE POLICY org_select ON organizations FOR SELECT
  USING (id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY locations_tenant ON locations FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY ingredients_tenant ON ingredients FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY suppliers_tenant ON suppliers FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY recipes_tenant ON recipes FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY recipe_items_tenant ON recipe_items FOR ALL
  USING (
    recipe_id IN (SELECT id FROM recipes WHERE organization_id IN (SELECT rp_user_org_ids()))
    OR rp_is_emotive_admin()
  );

CREATE POLICY sales_daily_tenant ON sales_daily FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY daily_reports_tenant ON daily_reports FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY subscriptions_tenant ON subscriptions FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY staff_members_tenant ON staff_members FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY supplier_invoices_tenant ON supplier_invoices FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY inventory_tenant ON inventory_items FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY production_tenant ON production_plans FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

CREATE POLICY ai_suggestions_tenant ON ai_suggestions FOR ALL
  USING (organization_id IN (SELECT rp_user_org_ids()) OR rp_is_emotive_admin());

-- Referral: partner vede solo i propri lead
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY referrals_partner ON referrals FOR SELECT
  USING (
    partner_id IN (SELECT id FROM referral_partners WHERE user_id = auth.uid())
    OR rp_is_emotive_admin()
  );

CREATE POLICY referral_partners_self ON referral_partners FOR SELECT
  USING (user_id = auth.uid() OR rp_is_emotive_admin());

-- Sales agents
ALTER TABLE sales_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_agents_self ON sales_agents FOR SELECT
  USING (user_id = auth.uid() OR rp_is_emotive_admin());

CREATE POLICY agent_commissions_self ON agent_commissions FOR SELECT
  USING (
    agent_id IN (SELECT id FROM sales_agents WHERE user_id = auth.uid())
    OR rp_is_emotive_admin()
  );

-- Plans pubblici in lettura
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_public_read ON plans FOR SELECT USING (true);
