import './globals.css'
import { atom, useAtom } from "jotai"
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { Navigation } from './nav'
import { SessionComponent } from './session'

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
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionComponent session={session}>
            <main className="p-4 min-h-screen flex flex-col justify-start">
              <Navigation />
              {children}
            </main>
          </SessionComponent>
        </Providers>
      </body>
    </html>
  )
}
