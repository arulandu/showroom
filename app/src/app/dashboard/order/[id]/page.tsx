import { db } from "@/lib/db"

export default async function Order({params}: {params: {id: string}}) {
  const order = await db.order.findUnique({where: {id: params.id}})

  return (
    <>
      <div className='min-h-screen flex-grow flex flex-col items-center justify-start'>
        <p>{JSON.stringify(order)}</p>
      </div>
    </>
  )
}
