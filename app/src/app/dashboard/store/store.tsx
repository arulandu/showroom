"use client"
import { PrimitiveAtom, atom, useAtom } from "jotai"
import Product from "./product"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { handleChange } from "@/lib/handleChange"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, ShoppingCartIcon } from "lucide-react"
import Link from "next/link"
import { Product as ProductType, Tag } from "@prisma/client"
import { atomWithStorage, useHydrateAtoms } from "jotai/utils"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { CreateProduct } from "./create"

export type OrderItem = {
  product: ProductType
  quantity: number
}

export const cartAtom = atomWithStorage<any>("cart", {})

export const tagsAtom = atom<Tag[]>([])
const searchAtom = atom("")
export default function Store({ products, tags }: { products: ProductType[], tags: Tag[] }) {
  useHydrateAtoms([[tagsAtom, tags]])

  const [cart] = useAtom(cartAtom)
  const canCheckout = Object.keys(cart).length > 0
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

        <Link href="/dashboard/store/checkout" className={`${canCheckout ? "" : "pointer-events-none"}`} aria-disabled={!canCheckout}>
          <Button variant="default" disabled={!canCheckout} className="ml-2">
            Checkout <ShoppingCartIcon className="ml-1 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-4 w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CreateProduct serverTags={tags}/>
        {searchProducts.map((prod: any) => <Product key={prod.id} product={prod} />)}
      </div>
    </div>
  );

}