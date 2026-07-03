# Barber Suite - Firebase schema

Barber Suite usa Next.js su Vercel e Firestore come database operativo. Se le variabili Firebase non sono configurate, l'app usa un demo store in memoria con gli stessi campi.

## Variabili ambiente Vercel

| Variabile | Uso |
| --- | --- |
| `FIREBASE_PROJECT_ID` | ID progetto Firebase |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_PRIVATE_KEY` | Service account private key con `\n` escaped |
| `BARBER_ORGANIZATION_ID` | Tenant/salone corrente |
| `BARBER_ORGANIZATION_NAME` | Nome mostrato nel gestionale |
| `STRIPE_SECRET_KEY` | Checkout abbonamenti |
| `STRIPE_PRICE_BASIC` | Price ID piano Basic |
| `STRIPE_PRICE_PRO` | Price ID piano Pro |
| `STRIPE_PRICE_ELITE` | Price ID piano Elite |
| `NEXT_PUBLIC_APP_URL` | URL pubblico Vercel |

## Collezioni Firestore

Percorso tenant:

`organizations/{organizationId}`

Sottocollezioni:

### `barber_services`

- `id`: string
- `organization_id`: string
- `name`: string
- `description`: string
- `duration_minutes`: integer
- `price_cents`: integer
- `active`: boolean
- `created_at`: ISO string

### `barber_customers`

- `id`: string
- `organization_id`: string
- `full_name`: string
- `phone`: string
- `email`: string | null
- `segment`: `new` | `regular` | `vip` | `at_risk` | `referred`
- `referral_code`: string
- `referred_by_customer_id`: string | null
- `total_spent_cents`: integer
- `visits_count`: integer
- `last_visit_at`: ISO string | null
- `notes`: string | null
- `created_at`: ISO string

### `barber_bookings`

- `id`: string
- `organization_id`: string
- `customer_id`: string | null
- `customer_name`: string
- `customer_phone`: string
- `service_id`: string
- `service_name`: string
- `starts_at`: ISO string
- `duration_minutes`: integer
- `price_cents`: integer
- `status`: `requested` | `confirmed` | `completed` | `cancelled` | `no_show`
- `referral_code`: string | null
- `notes`: string | null
- `created_at`: ISO string

### `barber_campaigns`

- `id`: string
- `organization_id`: string
- `name`: string
- `type`: `discount` | `referral` | `reactivation` | `vip`
- `audience`: customer segment | `all`
- `incentive`: string
- `message`: string
- `active`: boolean
- `expected_redemptions`: integer
- `revenue_target_cents`: integer
- `created_at`: ISO string

## Regole importanti

- Gli importi sono sempre interi in centesimi.
- Ogni documento contiene `organization_id`.
- In produzione proteggi le API admin con auth e custom claims Firebase.
- Per SaaS multi-salone, crea una `organizationId` per ogni cliente pagante e collega lo Stripe customer ID al tenant.
