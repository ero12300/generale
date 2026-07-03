'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  Megaphone,
  Settings,
  Scissors,
  LogOut,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/bookings', icon: Calendar, label: 'Prenotazioni' },
  { href: '/dashboard/clients', icon: Users, label: 'Clienti' },
  { href: '/dashboard/revenue', icon: TrendingUp, label: 'Incassi' },
  { href: '/dashboard/campaigns', icon: Megaphone, label: 'Campagne', proOnly: true },
  { href: '/dashboard/settings', icon: Settings, label: 'Impostazioni' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { shop, user, logout } = useAuth()
  const isPro = shop?.subscription?.tier === 'pro' || shop?.subscription?.tier === 'pro_yearly'

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-[rgba(212,175,55,0.1)] bg-[rgb(12,12,12)] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(212,175,55,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4.5 h-4.5 text-[rgb(10,10,10)]" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">
              {shop?.name ?? <span className="text-[rgb(140,130,110)]">Il mio Salone</span>}
            </div>
            <div className="text-xs text-[rgb(80,75,65)] truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3 border-b border-[rgba(212,175,55,0.08)]">
        {isPro ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)]">
            <Crown className="w-3.5 h-3.5 text-[rgb(212,175,55)]" />
            <span className="text-xs font-semibold text-[rgb(212,175,55)]">Piano Pro</span>
          </div>
        ) : (
          <Link href="/dashboard/settings?tab=billing">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(212,175,55,0.2)] transition-colors cursor-pointer">
              <span className="text-xs text-[rgb(140,130,110)]">Piano Free</span>
              <span className="text-xs text-[rgb(212,175,55)] font-medium">→ Pro</span>
            </div>
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label, proOnly }) => {
          const isActive = pathname === href
          const locked = proOnly && !isPro
          return (
            <Link
              key={href}
              href={locked ? '/dashboard/settings?tab=billing' : href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-[rgba(212,175,55,0.15)] text-[rgb(212,175,55)] border border-[rgba(212,175,55,0.2)]'
                  : locked
                  ? 'text-[rgb(60,56,50)] cursor-pointer hover:text-[rgb(100,90,70)]'
                  : 'text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)] hover:bg-[rgba(255,255,255,0.04)]'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-[rgb(212,175,55)]')} />
              <span className="flex-1">{label}</span>
              {locked && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">PRO</Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[rgba(212,175,55,0.1)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)] hover:bg-[rgba(255,255,255,0.04)] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </div>
    </aside>
  )
}
