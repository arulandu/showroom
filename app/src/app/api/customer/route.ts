import { db } from '@/lib/db'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const parsePhone = (phone: string) => {
  phone = phone.replace(/-|\+|\(|\)/g, "")
  if (phone.length > 11 || phone.length < 10) throw Error(`Invalid phone number ${phone}`)

  return phone
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams

    const customers = await db.customer.findMany({
      where: {
        name: params.get("name") ? {
          contains: params.get("name")!,
          mode: "insensitive"
        } : undefined,
        phone: params.get("phone") ? parsePhone(params.get("phone")!) : undefined,
        address: params.get("address") ? params.get("address")! : undefined,
        email: params.get("email") ? {
          contains: params.get("email")!,
          mode: "insensitive"
        } : undefined
      }
    })

    return NextResponse.json({ customers })
  } catch {
    return NextResponse.json({}, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const customer = await db.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: parsePhone(body.phone),
        address: body.address
      }
    })

    return NextResponse.json({ customer })
  } catch {
    return NextResponse.json({}, { status: 400 })
  }
}