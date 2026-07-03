'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Scissors, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/useToast'
import { Toaster } from '@/components/ui/toaster'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { signIn, signUp, signInGoogle, user } = useAuth()

  const [mode, setMode] = useState<'login' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Errore durante l\'autenticazione'
      toast({ title: 'Errore', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await signInGoogle()
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Errore Google Sign-In'
      toast({ title: 'Errore', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(212,175,55,0.03)] blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <Scissors className="w-5 h-5 text-[rgb(10,10,10)]" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gold-text">Barber</span>OS
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            {mode === 'login' ? 'Bentornato' : 'Crea il tuo account'}
          </h1>
          <p className="text-[rgb(140,130,110)] text-sm">
            {mode === 'login'
              ? 'Accedi al tuo gestionale barbershop'
              : 'Inizia gratis, nessuna carta richiesta'}
          </p>
        </div>

        <div className="card-glass card-glow rounded-2xl p-8">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(255,255,255,0.03)] text-sm font-medium hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(212,175,55,0.4)] transition-all mb-6 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continua con Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(212,175,55,0.1)]" />
            <span className="text-xs text-[rgb(80,75,65)]">oppure con email</span>
            <div className="flex-1 h-px bg-[rgba(212,175,55,0.1)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Nome del salone</label>
                <Input
                  placeholder="es. Gold Barber Shop"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={mode === 'signup'}
                />
              </div>
            )}
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="tu@esempio.it"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[rgb(140,130,110)] mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimo 6 caratteri"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(80,75,65)] hover:text-[rgb(140,130,110)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Attendere...' : mode === 'login' ? 'Accedi' : 'Crea Account Gratis'}
            </Button>
          </form>

          <p className="text-center text-sm text-[rgb(80,75,65)] mt-6">
            {mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[rgb(212,175,55)] hover:underline font-medium"
            >
              {mode === 'login' ? 'Registrati gratis' : 'Accedi'}
            </button>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
