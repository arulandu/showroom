import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
 
export async function GET(req: NextApiRequest) {
  const session = await getServerSession()
  const token = await getToken({req})

  return NextResponse.json({ session, token })
}