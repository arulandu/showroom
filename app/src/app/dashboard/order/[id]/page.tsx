import { db } from "@/lib/db"
import dynamic from "next/dynamic"

// TODO: is this really needed cuz of the use client stuff? get some weird errors in the console if i dont have this
const Receipt = dynamic(async () => {
  const { Receipt } = await import("./receipt")
  return { default: Receipt }
}, {ssr: false})

export default async function Order({params}: {params: {id: string}}) {
  const order = await db.order.findUnique({where: {id: params.id}, include: {
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
  }})

  return (
    <>
      <div className='flex-grow flex flex-col items-center justify-start'>
        {/* <p>{JSON.stringify(order)}</p> */}
        <Receipt order={order}/>
      </div>
    </>
  )
}
