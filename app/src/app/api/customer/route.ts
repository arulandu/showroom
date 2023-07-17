import { db } from '@/lib/db'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const clean = (x: string|null) => {
  if(x == null || x.length == 0) return undefined
  return x
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const customer = await db.customer.findFirst({where: {
    name: clean(params.get("name")),
    phone: clean(params.get("phone")),
    address: clean(params.get("address")),
    email: {
      contains: clean(params.get("email")),
      mode: "insensitive"
    }
  }})

  if(customer) return NextResponse.json({customer})
  return NextResponse.json({}, {status: 404})
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const customer = await db.customer.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address
    }
  })

  return NextResponse.json({customer})
}