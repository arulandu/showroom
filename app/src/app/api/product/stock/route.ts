import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { stock } from "."
import { getSession } from "@/lib/session"

export async function PUT(req: NextRequest) {
  const session = await getSession()
  const body = await req.json()
  
  const stockEvent = await stock(body.delta, body.price, body.productId, session.user.id)

  return NextResponse.json({stockEvent})
}