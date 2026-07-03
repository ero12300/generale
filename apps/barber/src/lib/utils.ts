import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount / 100)
}

export function formatCurrencyRaw(amount: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMMM yyyy', { locale: it })
}

export function formatTime(time: string): string {
  return time
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: it })
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: it })
}

export function generateReferralCode(name: string): string {
  const base = name.toUpperCase().replace(/\s+/g, '').slice(0, 4)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${base}${random}`
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getMonthRange(date = new Date()): { from: string; to: string } {
  const from = new Date(date.getFullYear(), date.getMonth(), 1)
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

export function generateTimeSlots(open: string, close: string, duration = 30): string[] {
  const slots: string[] = []
  const [openH, openM] = open.split(':').map(Number)
  const [closeH, closeM] = close.split(':').map(Number)
  let current = openH * 60 + openM
  const end = closeH * 60 + closeM

  while (current + duration <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += duration
  }
  return slots
}

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'In attesa',
  confirmed: 'Confermata',
  completed: 'Completata',
  cancelled: 'Annullata',
  no_show: 'Non presentato',
}

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  no_show: 'text-gray-400 bg-gray-400/10',
}

export const DAYS_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
