import { db } from '@/lib/db'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const token = await getToken({req})

  return NextResponse.json({ session, token })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const employee = await db.employee.create({
    data: {
      name: body.name,
      email: body.email,
      admin: body.admin
    }
  })
  
  return NextResponse.json({employee})
}