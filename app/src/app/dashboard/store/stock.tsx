"use client"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { handleChange } from "@/lib/handleChange"
import { CheckedState } from "@radix-ui/react-checkbox"

import { atom, useAtom } from "jotai"
import { Product, Tag } from "@prisma/client"
import { useHydrateAtoms } from "jotai/utils"
import { useState } from "react"
import { Dialog, DialogTrigger, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { CopyPlusIcon, PlusCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { tagsAtom } from "./store"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { sessionAtom } from "@/app/session"

const priceAtom = atom("")
const stockAtom = atom("")

export function StockProduct({ product, onClose }: { product: Product, onClose: () => any }) {
  const { toast } = useToast()
  const [session] = useAtom(sessionAtom)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [price, setPrice] = useAtom(priceAtom)
  const [stock, setStock] = useAtom(stockAtom)

  const register = async () => {
    try {
      setProcessing(true)
      const stockEvent = (await (await fetch('/api/product/stock', {
        method: "PUT", 
        body: JSON.stringify({
          productId: product.id,
          price: parseFloat(price),
          delta: +stock
        })
      })).json()).stockEvent

      setProcessing(false)

      toast({
        title: "Added stock",
      })

      setOpen(false)
      onClose()
      router.refresh()
    } catch {
      toast({
        title: "Error"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* TODO: better solution to nesting dialog in dropdown */}
        <div role="menuitem" className={"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"}>
        <CopyPlusIcon className="w-4 mr-2"/>Add stock
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Stock event: {product.name}</DialogTitle>
          <DialogDescription>Record a purchase of stock for a particular product</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" placeholder="# of units bought" value={stock} onChange={handleChange(setStock)} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="price">Unit Price</Label>
            <Input id="price" placeholder="Price per unit bought" value={price} onChange={handleChange(setPrice)} />
          </div>
        </div>
        <DialogFooter className="">
          <Button disabled={processing} onClick={(e) => register()} type="submit">Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}