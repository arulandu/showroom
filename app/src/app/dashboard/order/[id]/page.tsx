import { db } from "@/lib/db"
import { Receipt } from "./receipt";

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
