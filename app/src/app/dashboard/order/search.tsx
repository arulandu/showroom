"use client"
import { atom, useAtom } from "jotai"
import Product from "./product"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { handleChange } from "@/lib/handleChange"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCartIcon } from "lucide-react"

const searchAtom = atom("")
export default function Search({ products }: { products: any }) {
  const [search, setSearch] = useAtom(searchAtom)

  const fuse = useMemo(() => {
    const fuse = new Fuse(products, {
      includeScore: true,
      keys: [{ name: 'name', weight: 1 }, { name: 'description', weight: 1 }, { name: 'tags.name', weight: 1 }],
      ignoreFieldNorm: true,
    });
    return fuse;
  }, [products])

  const searchProducts = search.length > 0 ? fuse.search(search).map(res => res.item) : products
  
  const checkout = async () => {

  }
  
  return (
    <div className="mt-8 w-full">
      <div className="flex">
        <Input id="search" placeholder="Search for products..." onChange={handleChange(setSearch)} />
        <Button variant="default" onClick={checkout} className="ml-2">
          Checkout <ShoppingCartIcon className="ml-1 w-4 h-4"/>
        </Button>
      </div>

      <div className="mt-4 w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {searchProducts.map((prod: any) => <Product key={prod.id} product={prod} />)}
      </div>
    </div>
  );

}