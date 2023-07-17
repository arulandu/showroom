import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const stock = async (delta: number, price: number, productId: string, orderItemId?: string) => {
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
  const product = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      cgstTaxRate: body.cgstTaxRate,
      sgstTaxRate: body.sgstTaxRate,
      stock: body.stock,
      tags: {
        connect: body.tagIds.map((id: string) => {return {id}})
      }
    }
  })
  
  return NextResponse.json({product})
}