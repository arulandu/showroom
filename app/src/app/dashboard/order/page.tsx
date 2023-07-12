import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function Home() {
  const products = await db.product.findMany({ include: { tags: { select: { id: true, name: true } } } })

  return (
    <>
      <div className=' max-h-screen flex-grow flex flex-col items-center justify-center'>
        <div className="w-full grid md:grid-cols-3">
          {products.map(prod =>
            <Card key={prod.id} className=" max-w-md">
              <CardHeader>
                <CardTitle>
                  {prod.name} {prod.stock ? `(Qt. ${prod.stock})` : ""}
                </CardTitle>
                <CardDescription>
                  {prod.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                Price: {prod.basePrice} CGST: {prod.cgstTaxRate} SGST: {prod.sgstTaxRate}
              </CardContent>
              <CardFooter>
                {prod.tags.map(tag =>
                  <Badge className="mr-1">
                    {tag.name}
                  </Badge>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
