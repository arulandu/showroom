import { db } from "@/lib/db"
import { PaymentMethod } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

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