import { db } from "@/lib/db"

export const stock = async (delta: number, price: number, productId: string, orderItemId?: string | undefined) => {
  const event = await db.stockEvent.create({
    data: {
      delta,
      price,
      productId,
      orderItemId
    }
  })

  const product = await db.product.update({where: {id: productId}, data: {
    stock: {
      increment: delta
    }
  }})

  return event
}
