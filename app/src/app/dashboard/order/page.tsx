import { db } from "@/lib/db"
import Store from "./store"
import { atomWithStorage } from "jotai/utils"
import { Product } from "@prisma/client"

export default async function Home() {
  const products = await db.product.findMany({ include: { tags: { select: { id: true, name: true } } } })
  const tags = await db.tag.findMany({})

  return (
    <>
      <div className='min-h-screen flex-grow flex flex-col items-center justify-start'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Order Terminal
        </h1>
        <Store products={products} tags={tags}/>
      </div>
    </>
  )
}
