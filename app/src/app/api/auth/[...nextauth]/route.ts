import { db } from "@/lib/db"
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const dbUser = await db.employee.create({
          data: {
            name: user.name as string,
            email: user.email as string,
            pfp: user.image
          }
        })

        // TODO: new employee onboarding
      } catch {
        // user already exists
      }

      return true
    },
    async session({ session, token, user }) {
      if (!session.user || !session.user.email) return session

      const dbUser = await db.employee.findUnique({
        where: {
          email: session.user?.email as string
        }
      })

      session.user = { ...session.user, ...dbUser }

      return session
    }
  },
  secret: process.env.SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }