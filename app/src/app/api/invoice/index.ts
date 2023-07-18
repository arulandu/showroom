import { db } from "@/lib/db"
import { PaymentMethod } from "@prisma/client"

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