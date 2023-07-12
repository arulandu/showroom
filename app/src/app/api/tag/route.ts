import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const tag = await db.tag.create({
    data: {
      name: body.name,
    }
  })
  
  return NextResponse.json({tag})
}