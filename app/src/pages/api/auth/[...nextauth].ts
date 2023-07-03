import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, user, token }) {
      // console.log('get session in next auth')
      const data = await (await fetch(process.env.NEXT_PUBLIC_API_URL+'/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          session: session,
          user: user
        })
      })).json()
      // console.log('recieved login data', data)
      // console.log(session.token, "->", token)
      session.token = token
      session.user = {...session.user, ...data.user}
      // console.log("got session:", session)
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  },
  secret: process.env.SECRET
}
export default NextAuth(authOptions)