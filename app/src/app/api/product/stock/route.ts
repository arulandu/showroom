import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  const body = await req.json()

  const stockEvent = await stock(body.delta, body.price, body.productId, body.orderItemId)
  
  return NextResponse.json({stockEvent})
}