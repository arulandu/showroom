import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Session } from "@/app/session"
import { getServerSession } from "next-auth"

export const getSession = async () => {
  const session =  await getServerSession(authOptions)
  return (session as unknown) as Session
}