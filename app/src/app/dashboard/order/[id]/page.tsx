import { db } from "@/lib/db"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { Payment } from "../../store/checkout/payment"
import { PayInvoice } from "./payment"

// TODO: is this really needed cuz of the use client stuff? get some weird errors in the console if i dont have this
const Receipt = dynamic(async () => {
  const { Receipt } = await import("./receipt")
  return { default: Receipt }
}, { ssr: false })

export default async function Order({ params }: { params: { id: string } }) {
  const order:any = await db.order.findUnique({
    where: { id: params.id }, include: {
      customer: true,
      employee: true,
      items: {
        include: {
          product: true
        }
      },
      invoice: {
        include: {
          payments: true
        }
      }
    }
  })

  if (!order) redirect("/404")

  order.amountOwed = order.invoice!.amount - order.invoice!.amountPaid

  return (
    <>
      <div className='flex-grow flex flex-col items-center justify-start'>
        {order.amountOwed > 0 ? 
        <PayInvoice order={order}/>
        : null}
        <Receipt order={order} />
      </div>
    </>
  )
}
