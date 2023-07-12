import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  const token = await getToken({ req })
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
