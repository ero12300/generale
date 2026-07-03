import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './client'
import type { Barbershop, Booking, Client, RevenueRecord, Campaign } from '@/types'

// ─── Collection helpers ───────────────────────────────────────────────────────

const shopCol = (shopId: string) => `barbershops/${shopId}`
const bookingsCol = (shopId: string) => `barbershops/${shopId}/bookings`
const clientsCol = (shopId: string) => `barbershops/${shopId}/clients`
const revenueCol = (shopId: string) => `barbershops/${shopId}/revenue`
const campaignsCol = (shopId: string) => `barbershops/${shopId}/campaigns`

// ─── Barbershop ───────────────────────────────────────────────────────────────

export async function getShop(shopId: string): Promise<Barbershop | null> {
  const snap = await getDoc(doc(db, shopCol(shopId)))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Barbershop
}

export async function getShopByOwner(ownerId: string): Promise<Barbershop | null> {
  const q = query(collection(db, 'barbershops'), where('ownerId', '==', ownerId), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Barbershop
}

export async function createShop(data: Omit<Barbershop, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'barbershops'))
  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return ref.id
}

export async function updateShop(shopId: string, data: Partial<Barbershop>) {
  await updateDoc(doc(db, shopCol(shopId)), { ...data, updatedAt: serverTimestamp() })
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookings(shopId: string, constraints: QueryConstraint[] = []): Promise<Booking[]> {
  const q = query(collection(db, bookingsCol(shopId)), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[]
}

export async function getTodayBookings(shopId: string): Promise<Booking[]> {
  const today = new Date().toISOString().split('T')[0]
  return getBookings(shopId, [where('date', '==', today), orderBy('time')])
}

export async function createBooking(shopId: string, data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, bookingsCol(shopId)), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateBooking(shopId: string, bookingId: string, data: Partial<Booking>) {
  await updateDoc(doc(db, bookingsCol(shopId), bookingId), { ...data, updatedAt: serverTimestamp() })
}

export function subscribeBookings(shopId: string, date: string, cb: (bookings: Booking[]) => void) {
  const q = query(collection(db, bookingsCol(shopId)), where('date', '==', date), orderBy('time'))
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[]))
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export async function getClients(shopId: string, limitCount = 100): Promise<Client[]> {
  const q = query(collection(db, clientsCol(shopId)), orderBy('name'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Client[]
}

export async function searchClientByPhone(shopId: string, phone: string): Promise<Client | null> {
  const q = query(collection(db, clientsCol(shopId)), where('phone', '==', phone), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Client
}

export async function createClient(shopId: string, data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, clientsCol(shopId)), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateClient(shopId: string, clientId: string, data: Partial<Client>) {
  await updateDoc(doc(db, clientsCol(shopId), clientId), { ...data, updatedAt: serverTimestamp() })
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export async function getRevenue(shopId: string, fromDate: string, toDate: string): Promise<RevenueRecord[]> {
  const q = query(
    collection(db, revenueCol(shopId)),
    where('date', '>=', fromDate),
    where('date', '<=', toDate),
    orderBy('date', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as RevenueRecord[]
}

export async function createRevenue(shopId: string, data: Omit<RevenueRecord, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, revenueCol(shopId)), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export async function getCampaigns(shopId: string): Promise<Campaign[]> {
  const q = query(collection(db, campaignsCol(shopId)), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Campaign[]
}

export async function createCampaign(shopId: string, data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, campaignsCol(shopId)), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCampaign(shopId: string, campaignId: string, data: Partial<Campaign>) {
  await updateDoc(doc(db, campaignsCol(shopId), campaignId), { ...data, updatedAt: serverTimestamp() })
}

export async function validateCampaignCode(shopId: string, code: string): Promise<Campaign | null> {
  const q = query(
    collection(db, campaignsCol(shopId)),
    where('code', '==', code),
    where('status', '==', 'active'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const campaign = { id: snap.docs[0].id, ...snap.docs[0].data() } as Campaign
  if (campaign.validUntil && new Date(campaign.validUntil) < new Date()) return null
  if (campaign.usageLimit && campaign.usageCount >= campaign.usageLimit) return null
  return campaign
}

export { Timestamp }
