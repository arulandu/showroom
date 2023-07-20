import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { stock } from '../product/stock'
import { payInvoice } from '../invoice'

const toMap = (arr: any[], key: string) => {
  return Object.fromEntries(arr.map(a => [a[key], a]))
}

export async function POST(req: NextRequest) {
  const session = await getSession()

  try {
    const body = await req.json()

    const cartMap = toMap(body.cart, 'id')

    const products = await db.product.findMany({
      where: {
        id: { in: Object.keys(cartMap) }
      }
    })

    const productMap = toMap(products, 'id')

    products.forEach(p => {
      if (p.stock && cartMap[p.id].quantity > p.stock) throw new Error(`Product {${p.id}} doesn't have enough stock for this order.`)
    })

    const orderTotal = products.map(p => {
      const c = cartMap[p.id]
      return c.quantity * c.price * (1 + p.cgstTaxRate + p.sgstTaxRate)
    }).reduce((a, b) => a + b, 0)

    const order = await db.order.create({
      data: {
        notes: body.notes,
        customerId: body.customerId,
        employeeId: session.user.id,
        items: {
          create: products.map(p => {
            return {
              productId: p.id,
              quantity: cartMap[p.id].quantity,
              price: cartMap[p.id].price,
              cgstTaxRate: p.cgstTaxRate,
              sgstTaxRate: p.sgstTaxRate
            }
          })
        },
        invoice: {
          create: {
            amount: orderTotal
          }
        }
      },
      select: {
        id: true,
        invoice: {
          select: { id: true }
        },
        items: true
      }
    })

    const stockEvents = await Promise.all(
      order.items.filter(item => productMap[item.productId as string].stock ? true : false).map(async (item) => {
        const event = await stock(-item.quantity, item.price, item.productId as string, session.user.id, item.id)

        const orderItem = await db.orderItem.update({
          where: { id: item.id },
          data: { stockEventId: event.id }
        })
        return event
      })
    )

    const { invoice, payment } = await payInvoice(order.invoice!.id, parseFloat(body.payment.amount), body.payment.method)

    return NextResponse.json({ order, stockEvents, invoice, payment })
  } catch (e: any) {

    return NextResponse.json({ error: e.toString() }, { status: 400 })
  }
}