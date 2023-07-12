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
      stock: body.stock,
      tags: {
        connect: body.tagIds.map((id: string) => {return {id}})
      }
    }
  })
  
  return NextResponse.json({product})
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const id = params.get('id')
  
  if(id){
    // disconnect many-to-many relation
    const product = await db.product.update({
      where: {id},
      data: {
        tags: {
          set: []
        }
      }
    })

    const deleteProduct = await db.product.delete({where: {id}})
    
    return NextResponse.json({
      product,
      deleteProduct
    })
  } else {
    return NextResponse.json({}, {status: 400})
  }
}