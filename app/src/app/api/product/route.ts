import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  const body = await req.json()
  const product = await db.product.update({
    where: { id: body.productId },
    data: {
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      cgstTaxRate: body.cgstTaxRate,
      sgstTaxRate: body.sgstTaxRate,
      stock: session.user.admin ? body.stock : undefined,
      tags: {
        set: body.tagIds.map((id: string) => { return { id } })
      }
    }
  })
  return NextResponse.json({ product })
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
        connect: body.tagIds.map((id: string) => { return { id } })
      }
    }
  })

  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const id = params.get('id')

  try {
    if(!id) throw Error("param {id} not given")

    const res = await db.product.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            orderItems: true,
            stockEvents: true
          }
        }
      }
    })

    if (!res) throw Error("product not found")
    if (res._count.orderItems > 0 || res._count.stockEvents > 0) throw Error("Product has already been used in an order / stock event.")

    // disconnect many-to-many relation
    const product = await db.product.update({
      where: { id },
      data: {
        tags: {
          set: []
        }
      }
    })

    const deleteProduct = await db.product.delete({ where: { id } })

    return NextResponse.json({
      product,
      deleteProduct
    })
  } catch {
    return NextResponse.json({}, { status: 400 })
  }
}