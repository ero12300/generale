import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'BarberOS — Il Gestionale Premium per Barbieri',
  description: 'Prenotazioni, incassi, clienti e campagne marketing: tutto in un unico strumento professionale.',
  keywords: ['barbiere', 'gestionale', 'prenotazioni', 'barber shop', 'software'],
  openGraph: {
    title: 'BarberOS — Il Gestionale Premium per Barbieri',
    description: 'Gestisci il tuo salone come un professionista.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
