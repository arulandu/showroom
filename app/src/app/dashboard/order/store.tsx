"use client"
import { PrimitiveAtom, atom, useAtom } from "jotai"
import Product from "./product"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { handleChange } from "@/lib/handleChange"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCartIcon } from "lucide-react"
import Link from "next/link"
import {Product as ProductType } from "@prisma/client"
import { atomWithStorage } from "jotai/utils"

export type OrderItem = {
  product: ProductType
  quantity: number
}

export const cartAtom = atomWithStorage<any>("cart", {})

const searchAtom = atom("")
export default function Store({ products }: { products: [ProductType] }) {
  const [cart] = useAtom(cartAtom)
  const [search, setSearch] = useAtom(searchAtom)

  const fuse = useMemo(() => {
    const fuse = new Fuse(products, {
      includeScore: true,
      keys: [{ name: 'name', weight: 1 }, { name: 'description', weight: 1 }, { name: 'tags.name', weight: 1 }],
      ignoreFieldNorm: true,
    });
    return fuse;
  }, [products])

  
  const searchProducts = search.length > 0 ? fuse.search(search).map(res => res.item) : [...products.filter(p => p.id in cart), ...products.filter(p => !(p.id in cart))]
  
  return (
    <div className="mt-8 w-full">
      <div className="flex">
        <Input id="search" placeholder="Search for products..." onChange={handleChange(setSearch)} />
        <Button variant="default" className="ml-2" asChild>
          <Link href="/dashboard/order/checkout">Checkout <ShoppingCartIcon className="ml-1 w-4 h-4"/></Link>
        </Button>
      </div>

      <div className="mt-4 w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {searchProducts.map((prod: any) => <Product key={prod.id} product={prod}/>)}
      </div>
    </div>
  );

}