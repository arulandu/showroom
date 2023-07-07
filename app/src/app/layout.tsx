import './globals.css'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { Navigation } from './nav'

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
  const serverSession = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <main className="p-4 min-h-screen flex flex-col justify-start">
            <Navigation session={serverSession}/>
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  )
}
