-- RistoProfit OS — Schema iniziale multi-tenant con Row Level Security
-- Emotive S.r.l. — separato da RistoCare OS ma con struttura dati compatibile
-- per la futura integrazione in RistoSuite OS (stesse tabelle comuni).

-- ============ TABELLE COMUNI (condivisibili con RistoCare OS) ============

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

-- Profili utente collegati a auth.users di Supabase
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create type app_role as enum (
  'super_admin', 'admin_emotive', 'operator_emotive', 'sales_agent',
  'customer_owner', 'customer_manager', 'customer_staff', 'accountant',
  'referral_partner'
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role app_role not null,
  unique (user_id, organization_id)
);

create table if not exists plans (
  id text primary key, -- start | pro | premium | enterprise
  name text not null,
  monthly_cents integer, -- null = su preventivo; importi sempre in centesimi
  setup_cents integer,
  max_recipes integer,
  max_users integer
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  plan_id text not null references plans(id),
  status text not null default 'in_prova', -- in_prova | attivo | scaduto | disdetto | setup
  started_at date,
  expires_at date,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  amount_cents integer not null,
  description text,
  issued_at date not null,
  paid boolean not null default false
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount_cents integer not null,
  method text not null default 'bonifico', -- bonifico | stripe_link | manuale
  paid_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  storage_path text not null,
  kind text not null, -- fattura_fornitore | contratto | report_pdf
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  channel text not null default 'email', -- email | whatsapp | telegram | app
  title text not null,
  body text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid references organizations(id) on delete set null,
  user_id uuid,
  action text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ============ TABELLE RISTOPROFIT ============

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  city text,
  email text,
  phone text
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  name text not null,
  unit text not null check (unit in ('kg','g','l','ml','pz')),
  price_cents integer not null check (price_cents >= 0),
  previous_price_cents integer not null default 0,
  stock_qty numeric not null default 0,
  min_stock_qty numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  number text,
  invoice_date date not null,
  total_cents integer not null,
  status text not null default 'da_verificare',
  document_id uuid references documents(id) on delete set null
);

create table if not exists supplier_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references supplier_invoices(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  quantity numeric not null,
  unit_price_cents integer not null
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  category text,
  packaging_cents integer not null default 0,
  sale_price_cents integer not null,
  vat_pct numeric not null default 10,
  portions integer not null default 1 check (portions > 0)
);

create table if not exists recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  quantity numeric not null check (quantity >= 0),
  waste_pct numeric not null default 0 check (waste_pct >= 0 and waste_pct < 100)
);

create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  active boolean not null default true
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references menus(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  position integer not null default 0
);

create table if not exists sales_daily (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  sales_date date not null,
  revenue_cents integer not null default 0,
  covers integer not null default 0,
  unique (organization_id, sales_date)
);

create table if not exists sales_items (
  id uuid primary key default gen_random_uuid(),
  sales_daily_id uuid not null references sales_daily(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete set null,
  quantity integer not null default 0
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  expires_at date
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  quantity numeric not null, -- positivo = carico, negativo = scarico
  reason text not null default 'manuale', -- fattura | manuale | spreco | vendita
  created_at timestamptz not null default now()
);

create table if not exists production_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  plan_date date not null,
  recipe_id uuid not null references recipes(id) on delete cascade,
  suggested_qty integer not null,
  confirmed_qty integer
);

create table if not exists staff_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  role text,
  hourly_cost_cents integer not null default 0
);

create table if not exists staff_shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  shift_date date not null,
  hours numeric not null check (hours >= 0)
);

create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  report_date date not null,
  payload jsonb not null,
  sent_via text[],
  unique (organization_id, report_date)
);

create table if not exists ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  kind text not null, -- prezzo | menu | descrizione | riordino
  recipe_id uuid references recipes(id) on delete cascade,
  suggestion text not null,
  created_at timestamptz not null default now()
);

-- ============ TABELLE VENDITORI E REFERRAL ============

create table if not exists sales_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  full_name text not null,
  level text not null default 'base' check (level in ('base','senior')),
  active boolean not null default true
);

create table if not exists agent_commissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references sales_agents(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  kind text not null, -- setup | canone | bonus
  amount_cents integer not null,
  accrued_at date not null,
  paid_at date
);

create table if not exists referral_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  code text not null unique,
  kind text -- haccp | commercialista | fornitore | cliente | altro
);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references referral_partners(id) on delete cascade,
  customer_name text not null,
  phone text,
  city text,
  status text not null default 'Nuovo',
  plan_id text references plans(id),
  protected_until date, -- segnalazione protetta per 90 giorni
  created_at timestamptz not null default now()
);

create table if not exists referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id) on delete cascade,
  amount_cents integer not null,
  accrued_at date not null,
  paid_at date
);

create table if not exists sales_targets (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references sales_agents(id) on delete cascade,
  quarter text not null, -- es. 2026-Q3
  target_clients integer not null,
  bonus_cents integer not null
);

create table if not exists sales_leaderboard (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references sales_agents(id) on delete cascade,
  month text not null, -- es. 2026-06
  mrr_cents integer not null default 0,
  demos integer not null default 0,
  closed_won integer not null default 0,
  unique (agent_id, month)
);

-- ============ ROW LEVEL SECURITY ============

-- Helper: organizzazioni a cui l'utente appartiene
create or replace function user_org_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select organization_id from memberships where user_id = auth.uid();
$$;

-- Helper: l'utente è staff Emotive (vede tutto)
create or replace function is_emotive_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where user_id = auth.uid()
      and role in ('super_admin','admin_emotive','operator_emotive')
  );
$$;

-- Attiva RLS e applica policy tenant a tutte le tabelle business
do $$
declare
  t text;
begin
  foreach t in array array[
    'locations','subscriptions','invoices','payments','documents','notifications',
    'suppliers','ingredients','supplier_invoices','recipes','menus','sales_daily',
    'inventory_items','stock_movements','production_plans','staff_members',
    'staff_shifts','daily_reports','ai_suggestions'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy tenant_isolation on %I for all
       using (is_emotive_staff() or organization_id in (select user_org_ids()))
       with check (is_emotive_staff() or organization_id in (select user_org_ids()))',
      t
    );
  end loop;
end $$;

alter table organizations enable row level security;
create policy org_member_read on organizations for select
  using (is_emotive_staff() or id in (select user_org_ids()));

alter table memberships enable row level security;
create policy membership_self on memberships for select
  using (is_emotive_staff() or user_id = auth.uid());

alter table users enable row level security;
create policy user_self on users for all
  using (is_emotive_staff() or id = auth.uid())
  with check (id = auth.uid() or is_emotive_staff());

-- Tabelle figlie: ereditano l'isolamento dalla tabella padre
alter table supplier_invoice_items enable row level security;
create policy invoice_items_tenant on supplier_invoice_items for all
  using (exists (
    select 1 from supplier_invoices si
    where si.id = invoice_id
      and (is_emotive_staff() or si.organization_id in (select user_org_ids()))
  ));

alter table recipe_items enable row level security;
create policy recipe_items_tenant on recipe_items for all
  using (exists (
    select 1 from recipes r
    where r.id = recipe_id
      and (is_emotive_staff() or r.organization_id in (select user_org_ids()))
  ));

alter table menu_items enable row level security;
create policy menu_items_tenant on menu_items for all
  using (exists (
    select 1 from menus m
    where m.id = menu_id
      and (is_emotive_staff() or m.organization_id in (select user_org_ids()))
  ));

alter table sales_items enable row level security;
create policy sales_items_tenant on sales_items for all
  using (exists (
    select 1 from sales_daily sd
    where sd.id = sales_daily_id
      and (is_emotive_staff() or sd.organization_id in (select user_org_ids()))
  ));

-- Venditori: vedono solo i propri dati
alter table sales_agents enable row level security;
create policy agent_self on sales_agents for select
  using (is_emotive_staff() or user_id = auth.uid());

alter table agent_commissions enable row level security;
create policy commissions_own on agent_commissions for select
  using (is_emotive_staff() or exists (
    select 1 from sales_agents a where a.id = agent_id and a.user_id = auth.uid()
  ));

alter table sales_targets enable row level security;
create policy targets_own on sales_targets for select
  using (is_emotive_staff() or exists (
    select 1 from sales_agents a where a.id = agent_id and a.user_id = auth.uid()
  ));

alter table sales_leaderboard enable row level security;
create policy leaderboard_agents on sales_leaderboard for select
  using (is_emotive_staff() or exists (
    select 1 from sales_agents a where a.user_id = auth.uid()
  ));

-- Referral: il partner vede solo le proprie segnalazioni
alter table referral_partners enable row level security;
create policy partner_self on referral_partners for select
  using (is_emotive_staff() or user_id = auth.uid());

alter table referrals enable row level security;
create policy referrals_own on referrals for all
  using (is_emotive_staff() or exists (
    select 1 from referral_partners p where p.id = partner_id and p.user_id = auth.uid()
  ))
  with check (is_emotive_staff() or exists (
    select 1 from referral_partners p where p.id = partner_id and p.user_id = auth.uid()
  ));

alter table referral_rewards enable row level security;
create policy rewards_own on referral_rewards for select
  using (is_emotive_staff() or exists (
    select 1 from referrals r
    join referral_partners p on p.id = r.partner_id
    where r.id = referral_id and p.user_id = auth.uid()
  ));

alter table plans enable row level security;
create policy plans_public_read on plans for select using (true);

alter table audit_logs enable row level security;
create policy audit_admin_only on audit_logs for select using (is_emotive_staff());

-- ============ DATI INIZIALI ============

insert into plans (id, name, monthly_cents, setup_cents, max_recipes, max_users) values
  ('start', 'Start', 5900, 49000, 30, 1),
  ('pro', 'Pro', 12900, 99000, 100, 3),
  ('premium', 'Premium', 24900, 199000, null, 10),
  ('enterprise', 'Enterprise', null, 300000, null, null)
on conflict (id) do nothing;
