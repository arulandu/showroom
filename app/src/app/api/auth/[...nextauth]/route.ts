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
      const dbUser = await db.employee.findFirst({
        where: {
          email: user.email as string
        }
      })
      
      // TODO: Verification flow? For now, create admin functionality that let's them add employees. db object must exist before sign in.
      // TODO: fix current can't log in error ui to be better but tbh who cares.
      if(dbUser) {
        if(dbUser.name != user.name || dbUser.pfp == null) {
          await db.employee.update({
            where: {
              id: dbUser.id
            },
            data: {
              name: user.name as string,
              pfp: user.image
            }
          })
        }
        return true;
      }
      return false;
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