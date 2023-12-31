import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Product } from "@prisma/client";
import { PrimitiveAtom, atom, useAtom } from "jotai";
import { ClipboardCopyIcon, MinusIcon, MoreHorizontalIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { OrderItem, cartAtom } from "./store";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { sessionAtom } from "@/app/session";
import { useToast } from "@/components/ui/use-toast";
import { EditProduct } from "./edit";
import { StockProduct } from "./stock";
import { useRouter } from "next/navigation";

const ActionsMenu = ({ product }: { product: any }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [session] = useAtom(sessionAtom)

  const deleteItem = async () => {
    try {
      const res = await fetch("/api/product?" + new URLSearchParams({id: product.id}), {method: "DELETE"})
      if(!res.ok) throw Error("delete failed")

      toast({title: "Deleted."})
      router.refresh()
    } catch {
      toast({title: "Delete failed.", description: "Product has already been used in orders / stock events. Only unused products are delete-able."})
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => { navigator.clipboard.writeText(product.id); toast({ title: "Copied" }) }}
        >
          <ClipboardCopyIcon className="w-4 mr-2" /> Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <EditProduct product={product} onClose={() => setOpen(false)} />
        {product.stock == null ? null : <StockProduct product={product} onClose={() => setOpen(false)} />}
        <DropdownMenuItem onClick={deleteItem} className="text-destructive focus:text-destructive"><TrashIcon className=" w-4 mr-2"/>Delete Item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

}

export default function Product({ product }: { product: any }) {
  let [cart, setCart] = useAtom(cartAtom)
  const bag = cart[product.id]?.quantity

  const setBag = (quantity: number) => {
    const c = { ...cart }
    if (quantity == 0) delete c[product.id]
    else c[product.id] = { quantity, product }
    setCart(c)
  }

  return (
    <Card key={product.id} className={`w-full ${bag > 0 ? " border-foreground" : ""}`}>
      <CardHeader className="relative">
        <div className="flex justify-between">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {product.name}
          </h4>
          <ActionsMenu product={product} />
        </div>

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
        <p>Price: {product.basePrice} CGST: {product.cgstTaxRate} SGST: {product.sgstTaxRate} {product.stock == null ? "" : `Qt: ${product.stock}`}</p>
        <div className="mt-4 w-fit flex items-center">
          {bag === undefined ?
            <Button variant="secondary" className="" onClick={() => setBag(1)}>
              Add to cart<ShoppingBagIcon className="ml-2 w-4 h-4" />
            </Button>
            :
            <>
              <Button variant="secondary" className="" disabled={bag > 0 ? false : true} onClick={() => setBag(bag - 1)}>
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Input id="quantity" placeholder="#" value={bag} onChange={(e) => setBag(parseInt(e.target.value))} className="mx-2" />
              <Button variant="secondary" className="w-fit" disabled={(product.stock == null || product.stock > bag) ? false : true} onClick={() => setBag(bag + 1)}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </>
          }
        </div>
      </CardContent>
    </Card>
  );

}