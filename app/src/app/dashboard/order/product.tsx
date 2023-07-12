import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Product } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import { useState } from "react";

export default function Product({ product }: { product: any }) {
  const [bag, setBag] = useState<number|undefined>(undefined) // TODO: make this do acc bag stuff

  return (
    <Card key={product.id} className="max-w-md">
      <CardHeader className="relative">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {product.name} {product.stock ? `(Qt. ${product.stock})` : ""}
        </h4>
        <CardDescription>
          {product.id}
        </CardDescription>
        <div className="w-full flex">
          {product.tags.map((tag: any) =>
            <Badge variant="outline" className="mr-1" key={tag.id}>
              {tag.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{product.description}</p>
        <p>Price: {product.basePrice} CGST: {product.cgstTaxRate} SGST: {product.sgstTaxRate}</p>
        <div className="mt-4 w-fit flex items-center">
          {bag === undefined ?
            <Button variant="secondary" className="" onClick={() => setBag(1)}>
              {"Buy "}<ShoppingBagIcon className="ml-1 w-4 h-4" />
            </Button>
            :
            <>
              <Button variant="secondary" className="" disabled={bag > 0 ? false : true} onClick={() => setBag(bag-1)}>
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Input id="quantity" placeholder="#" value={bag} onChange={(e) => setBag(parseInt(e.target.value))} className="mx-2"/>
              <Button variant="secondary" className="w-fit" disabled={product.stock > bag ? false : true} onClick={() => setBag(bag+1)}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </>
          }
        </div>
      </CardContent>
    </Card>
  );

}