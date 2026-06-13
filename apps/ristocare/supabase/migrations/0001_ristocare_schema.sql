-- RistoCare OS — Schema MVP multi-tenant con Row Level Security
-- Da applicare a un progetto Supabase dedicato (separato da Deal Desk Immobiliare).

create type plan_id as enum ('start', 'pro', 'premium', 'enterprise');
create type ticket_status as enum (
  'nuovo', 'in_verifica', 'richiesta_informazioni', 'in_attesa_tecnico',
  'preventivo_ricevuto', 'preventivo_inviato', 'accettato', 'programmato',
  'in_intervento', 'in_attesa_ricambio', 'risolto', 'chiuso',
  'non_coperto_garanzia', 'contestato', 'annullato'
);
create type ticket_urgency as enum ('bassa', 'media', 'alta', 'blocco_servizio');
create type user_role as enum (
  'super_admin', 'operator', 'customer_admin', 'customer_staff',
  'technician', 'referral_partner'
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  billing_email text,
  phone text,
  address text,
  city text,
  province text,
  plan plan_id not null default 'start',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role user_role not null default 'customer_staff',
  created_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  city text,
  province text,
  phone text,
  manager_name text,
  created_at timestamptz not null default now()
);

create table equipment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  name text not null,
  category text not null,
  brand text,
  model text,
  serial_number text,
  supplier text,
  purchase_date date,
  delivery_date date,
  installation_date date,
  warranty_start date,
  warranty_end date,
  area text,
  notes text,
  qr_token text unique not null default encode(gen_random_bytes(12), 'hex'),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table equipment_documents (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references equipment(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  document_type text not null,
  file_url text not null,
  file_name text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  company_name text,
  phone text,
  email text,
  categories text[] not null default '{}',
  city text,
  province text,
  rating_internal smallint check (rating_internal between 1 and 5),
  notes_internal text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  equipment_id uuid references equipment(id) on delete set null,
  title text not null,
  description text not null,
  urgency ticket_urgency not null default 'media',
  status ticket_status not null default 'nuovo',
  machine_down boolean not null default false,
  warranty_check text,
  internal_notes text,
  opened_by text,
  assigned_operator_id uuid references auth.users(id),
  assigned_technician_id uuid references technicians(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  file_url text not null,
  file_type text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table technician_requests (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  technician_id uuid not null references technicians(id) on delete cascade,
  internal_price_cents integer check (internal_price_cents >= 0),
  availability text,
  response_status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

-- Importi sempre in centesimi (integer): nessun float monetario.
create table quotes (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  internal_cost_cents integer not null check (internal_cost_cents >= 0),
  customer_price_cents integer not null check (customer_price_cents >= 0),
  status text not null default 'bozza',
  accepted_at timestamptz,
  valid_until date,
  pdf_url text,
  created_at timestamptz not null default now()
);

create table interventions (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  technician_id uuid references technicians(id),
  scheduled_at timestamptz,
  completed_at timestamptz,
  technician_report text,
  customer_signature text,
  warranty_days integer,
  created_at timestamptz not null default now()
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  partner_type text,
  phone text,
  email text,
  referred_company text not null,
  referred_contact text,
  city text,
  status text not null default 'nuovo',
  plan_sold plan_id,
  reward_amount_cents integer check (reward_amount_cents >= 0),
  reward_status text not null default 'in_attesa',
  created_at timestamptz not null default now()
);

create index idx_equipment_org on equipment(organization_id);
create index idx_tickets_org on tickets(organization_id);
create index idx_tickets_status on tickets(status);
create index idx_quotes_ticket on quotes(ticket_id);
create index idx_memberships_user on memberships(user_id);

-- ============ Row Level Security ============

alter table organizations enable row level security;
alter table memberships enable row level security;
alter table locations enable row level security;
alter table equipment enable row level security;
alter table equipment_documents enable row level security;
alter table technicians enable row level security;
alter table tickets enable row level security;
alter table ticket_attachments enable row level security;
alter table technician_requests enable row level security;
alter table quotes enable row level security;
alter table interventions enable row level security;
alter table referrals enable row level security;

-- Helper: ruoli interni RistoCare (vedono tutto)
create or replace function is_ristocare_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where user_id = auth.uid() and role in ('super_admin', 'operator')
  );
$$;

-- Helper: appartenenza all'organizzazione
create or replace function is_org_member(org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where user_id = auth.uid() and organization_id = org
  );
$$;

-- Organizzazioni: il cliente vede solo la propria, lo staff tutte.
create policy org_select on organizations for select
  using (is_ristocare_staff() or is_org_member(id));

create policy memberships_select on memberships for select
  using (is_ristocare_staff() or user_id = auth.uid());

create policy locations_select on locations for select
  using (is_ristocare_staff() or is_org_member(organization_id));

create policy equipment_select on equipment for select
  using (is_ristocare_staff() or is_org_member(organization_id));
create policy equipment_write on equipment for all
  using (is_ristocare_staff() or is_org_member(organization_id))
  with check (is_ristocare_staff() or is_org_member(organization_id));

create policy equipment_documents_select on equipment_documents for select
  using (is_ristocare_staff() or is_org_member(organization_id));
create policy equipment_documents_write on equipment_documents for insert
  with check (is_ristocare_staff() or is_org_member(organization_id));

-- Anagrafica tecnici, ranking e note interne: solo staff RistoCare.
create policy technicians_staff_only on technicians for all
  using (is_ristocare_staff()) with check (is_ristocare_staff());

create policy tickets_select on tickets for select
  using (
    is_ristocare_staff()
    or is_org_member(organization_id)
    or assigned_technician_id in (select id from technicians where user_id = auth.uid())
  );
create policy tickets_insert on tickets for insert
  with check (is_ristocare_staff() or is_org_member(organization_id));
create policy tickets_update_staff on tickets for update
  using (is_ristocare_staff()) with check (is_ristocare_staff());

create policy ticket_attachments_select on ticket_attachments for select
  using (is_ristocare_staff() or is_org_member(organization_id));
create policy ticket_attachments_insert on ticket_attachments for insert
  with check (is_ristocare_staff() or is_org_member(organization_id));

-- Richieste tecnico (prezzo interno riservato): staff + tecnico assegnato.
create policy technician_requests_select on technician_requests for select
  using (
    is_ristocare_staff()
    or technician_id in (select id from technicians where user_id = auth.uid())
  );
create policy technician_requests_staff_write on technician_requests for insert
  with check (is_ristocare_staff());

-- Preventivi: il cliente vede solo il prezzo finale tramite vista dedicata;
-- la tabella completa (costo interno + margine) è solo staff.
create policy quotes_staff_only on quotes for all
  using (is_ristocare_staff()) with check (is_ristocare_staff());

create policy interventions_select on interventions for select
  using (
    is_ristocare_staff()
    or ticket_id in (select id from tickets where is_org_member(organization_id))
    or technician_id in (select id from technicians where user_id = auth.uid())
  );

-- Referral: solo staff RistoCare (i partner inseriscono via API server-side).
create policy referrals_staff_only on referrals for all
  using (is_ristocare_staff()) with check (is_ristocare_staff());

-- Vista cliente del preventivo: nessun costo interno, nessun margine.
create view customer_quotes
with (security_invoker = true) as
  select id, ticket_id, organization_id, customer_price_cents, status, valid_until, pdf_url, created_at
  from quotes;
