import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { stock } from '.'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const stockEvent = await stock(body.delta, body.price, body.productId, body.orderItemId)
  
  return NextResponse.json({stockEvent})
}