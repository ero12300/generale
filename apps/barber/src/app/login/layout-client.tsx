import { AuthProvider } from '@/hooks/useAuth'

export default function LoginClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
