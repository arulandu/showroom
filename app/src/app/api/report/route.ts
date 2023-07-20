import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const from = new Date(req.nextUrl.searchParams.get("from") as string)
  const to = new Date(req.nextUrl.searchParams.get("to") as string)
  const filter = req.nextUrl.searchParams.get("filter")!

  let orders: any[] = [], stockEvents: any[] = [];

  if (filter === "profit" || filter === "revenue") {
    orders = (await db.order.findMany({
      where: {
        createdAt: {
          lte: to,
          gte: from
        }
      },
      include: {
        invoice: true
      }
    })).map(a => { return { ...a, type: "order" } })

    if (filter === "revenue") return NextResponse.json({ events: orders })
  }

  if (filter === "profit" || filter === "expenses") {
    stockEvents = (await db.stockEvent.findMany({
      where: {
        createdAt: {
          lte: to,
          gte: from
        },
        delta: {
          gte: 0 // buy actions only
        }
      },
      include: { product: true }
    })).map(a => { return { ...a, type: "buy" } })

    if (filter === "expenses") return NextResponse.json({ events: stockEvents })
  }


  const events = [...(orders as any[]), ...(stockEvents as any[])].sort((a, b) => {
    return b.createdAt - a.createdAt
  })

  return NextResponse.json({ events })
}