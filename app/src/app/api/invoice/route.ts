import { db } from "@/lib/db"
import { PaymentMethod } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export const payInvoice = async (id:string, amount: number, method: PaymentMethod) => {
  const payment = await db.payment.create({
    data: {
      amount,
      method,
      invoiceId: id
    }
  })

  const invoice = await db.invoice.update({where: {id}, data: {
    amountPaid: {
      increment: payment.amount
    }
  }})

  return {payment, invoice}
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