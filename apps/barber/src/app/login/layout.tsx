export const dynamic = 'force-dynamic'

import LoginClientLayout from './layout-client'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <LoginClientLayout>{children}</LoginClientLayout>
}
