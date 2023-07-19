import { db } from "@/lib/db"
import { PaymentMethod } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { payInvoice } from "."

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  const {invoice, payment} = await payInvoice(body.invoiceId, parseFloat(body.amount), body.method)

  return NextResponse.json({invoice, payment})
}