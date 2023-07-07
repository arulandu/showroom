import './globals.css'
import { atom, useAtom } from "jotai"
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navigation } from './nav'
import { getSession } from '@/lib/session'
import { SessionComponent } from './session'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Joven Motors',
  description: 'A platform to manage a showroom in Tamil Nadu, India.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionComponent session={session}>
            <main className="p-4 min-h-screen flex flex-col justify-start">
              <Navigation />
              {children}
            </main>
            <Toaster/>
          </SessionComponent>
        </Providers>
      </body>
    </html>
  )
}
