import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const token = await getToken({ req })
  const gh = await (await fetch("https://api.github.com/repos/Claeb101/showroom/commits/main")).json()
  const status = `✅ Last commit: ${gh.commit.tree.sha} by ${gh.commit.committer.name} on ${gh.commit.committer.date}`
  const res = `${status}\n\nSession: ${JSON.stringify(session, null, 4)}\n\nToken: ${JSON.stringify(token, null, 4)}`
  return new NextResponse(res)

}
