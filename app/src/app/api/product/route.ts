import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const product = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      cgstTaxRate: body.cgstTaxRate,
      sgstTaxRate: body.sgstTaxRate,
      stock: body.stock
    }
  })
  
  return NextResponse.json({product})
}