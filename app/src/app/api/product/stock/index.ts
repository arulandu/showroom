import { db } from "@/lib/db"

export const stock = async (delta: number, price: number, productId: string, employeeId: string, orderItemId?: string | undefined) => {
  let product = await db.product.findUnique({where: {id: productId, stock: {not: null}}})
  if(!product) throw Error(`Can't stock non-inventoried product ${productId}`)

  const event = await db.stockEvent.create({
    data: {
      delta,
      price,
      productId,
      orderItemId,
      employeeId
    }
  })

  product = await db.product.update({where: {id: productId}, data: {
    stock: {
      increment: delta
    }
  }})

  return event
}
