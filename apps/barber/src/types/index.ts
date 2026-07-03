// ─── Subscription ───────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'pro_yearly'

export interface Subscription {
  tier: PlanTier
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
}

// ─── Barbershop ──────────────────────────────────────────────────────────────

export interface Barbershop {
  id: string
  ownerId: string
  name: string
  slug: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
  coverUrl?: string
  description?: string
  services: Service[]
  workingHours: WorkingHours
  subscription: Subscription
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
  active: boolean
}

export interface WorkingHours {
  [day: string]: { open: string; close: string; closed: boolean }
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Booking {
  id: string
  shopId: string
  clientId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  serviceId: string
  serviceName: string
  servicePrice: number
  barberId?: string
  barberName?: string
  date: string
  time: string
  duration: number
  status: BookingStatus
  notes?: string
  referralCode?: string
  discountApplied?: number
  createdAt: string
  updatedAt: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  shopId: string
  name: string
  phone: string
  email?: string
  birthdate?: string
  notes?: string
  totalVisits: number
  totalSpent: number
  lastVisit?: string
  referralCode: string
  referredBy?: string
  referralCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other'

export interface RevenueRecord {
  id: string
  shopId: string
  bookingId?: string
  clientId?: string
  clientName?: string
  amount: number
  tip?: number
  paymentMethod: PaymentMethod
  serviceName: string
  notes?: string
  date: string
  createdAt: string
}

// ─── Campaign ────────────────────────────────────────────────────────────────

export type CampaignType = 'discount' | 'referral' | 'birthday' | 'loyalty'
export type CampaignStatus = 'active' | 'paused' | 'ended' | 'scheduled'

export interface Campaign {
  id: string
  shopId: string
  name: string
  type: CampaignType
  status: CampaignStatus
  discountType: 'percent' | 'fixed'
  discountValue: number
  code?: string
  usageLimit?: number
  usageCount: number
  validFrom: string
  validUntil?: string
  description?: string
  conditions?: {
    minSpend?: number
    firstVisitOnly?: boolean
    minVisits?: number
  }
  createdAt: string
  updatedAt: string
}
