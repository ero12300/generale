-- Modulo Barber Premium: clienti, prenotazioni, incassi, campagne, abbonamenti
CREATE TYPE barber_booking_status AS ENUM (
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE barber_booking_source AS ENUM ('online', 'walk_in', 'phone', 'instagram');
CREATE TYPE barber_payment_method AS ENUM ('cash', 'card', 'online', 'bank_transfer');
CREATE TYPE barber_payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE barber_campaign_channel AS ENUM ('sms', 'email', 'whatsapp', 'in_app');
CREATE TYPE barber_campaign_discount_type AS ENUM ('percent', 'fixed');
CREATE TYPE barber_campaign_status AS ENUM ('draft', 'active', 'completed');
CREATE TYPE barber_plan AS ENUM ('basic', 'pro');

CREATE TABLE barber_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  price_amount numeric(12,2) NOT NULL CHECK (price_amount >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE barber_clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  email text,
  notes text,
  total_visits integer NOT NULL DEFAULT 0 CHECK (total_visits >= 0),
  referral_code text NOT NULL,
  referred_by_client_id uuid REFERENCES barber_clients(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, referral_code)
);

CREATE TABLE barber_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES barber_clients(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES barber_services(id) ON DELETE RESTRICT,
  barber_name text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status barber_booking_status NOT NULL DEFAULT 'pending',
  source barber_booking_source NOT NULL DEFAULT 'online',
  notes text,
  price_amount numeric(12,2) NOT NULL CHECK (price_amount >= 0),
  deposit_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE barber_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES barber_bookings(id) ON DELETE SET NULL,
  client_id uuid REFERENCES barber_clients(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  method barber_payment_method NOT NULL DEFAULT 'cash',
  status barber_payment_status NOT NULL DEFAULT 'paid',
  paid_at timestamptz NOT NULL DEFAULT now(),
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE barber_campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  channel barber_campaign_channel NOT NULL,
  discount_type barber_campaign_discount_type NOT NULL,
  discount_value numeric(10,2) NOT NULL CHECK (discount_value >= 0),
  referral_bonus numeric(10,2) NOT NULL DEFAULT 0 CHECK (referral_bonus >= 0),
  message text,
  starts_at date NOT NULL,
  ends_at date NOT NULL,
  status barber_campaign_status NOT NULL DEFAULT 'draft',
  audience text NOT NULL DEFAULT 'all',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at >= starts_at)
);

CREATE TABLE barber_subscriptions (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  plan barber_plan NOT NULL DEFAULT 'basic',
  status text NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_barber_services_org_active ON barber_services(organization_id, is_active);
CREATE INDEX idx_barber_clients_org_name ON barber_clients(organization_id, full_name);
CREATE INDEX idx_barber_bookings_org_start ON barber_bookings(organization_id, starts_at DESC);
CREATE INDEX idx_barber_payments_org_paid_at ON barber_payments(organization_id, paid_at DESC);
CREATE INDEX idx_barber_campaigns_org_status ON barber_campaigns(organization_id, status);

CREATE TRIGGER barber_services_updated_at BEFORE UPDATE ON barber_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER barber_clients_updated_at BEFORE UPDATE ON barber_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER barber_bookings_updated_at BEFORE UPDATE ON barber_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER barber_campaigns_updated_at BEFORE UPDATE ON barber_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER barber_subscriptions_updated_at BEFORE UPDATE ON barber_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE barber_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY barber_services_all ON barber_services FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY barber_clients_all ON barber_clients FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY barber_bookings_all ON barber_bookings FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY barber_payments_all ON barber_payments FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY barber_campaigns_all ON barber_campaigns FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

CREATE POLICY barber_subscriptions_all ON barber_subscriptions FOR ALL
  USING (organization_id IN (SELECT user_organization_ids()))
  WITH CHECK (organization_id IN (SELECT user_organization_ids()));

-- Servizi base per onboarding
INSERT INTO barber_services (organization_id, name, duration_minutes, price_amount)
SELECT o.id, s.name, s.duration_minutes, s.price_amount
FROM organizations o
CROSS JOIN (
  VALUES
    ('Taglio Uomo', 30, 25.00),
    ('Taglio + Barba', 45, 35.00),
    ('Ritocco Barba', 20, 15.00)
) AS s(name, duration_minutes, price_amount)
WHERE NOT EXISTS (
  SELECT 1 FROM barber_services bs WHERE bs.organization_id = o.id
);

INSERT INTO barber_subscriptions (organization_id, plan, status, trial_ends_at)
SELECT o.id, 'basic', 'trialing', now() + interval '14 days'
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM barber_subscriptions bsub WHERE bsub.organization_id = o.id
);
