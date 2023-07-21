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
import { FileEditIcon, PlusCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { tagsAtom } from "./store"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { sessionAtom } from "@/app/session"

const nameAtom = atom("")
const descAtom = atom("")
const priceAtom = atom("")
const cgstAtom = atom("")
const sgstAtom = atom("")
const inventoryAtom = atom<CheckedState>(false)
const stockAtom = atom("")
const selectedTagsAtom = atom<Tag[]>([])

export function EditProduct({ product, onClose }: { product: Product, onClose: () => any }) {
  const [tags, setTags] = useAtom(tagsAtom)

  const hydrate = () => {
    setSelectedTags(product.tagIds.map(id => tags.find((v) => v.id == id)!))
  }

  const { toast } = useToast()
  const [session] = useAtom(sessionAtom)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [basePrice, setPrice] = useState(product.basePrice.toString())
  const [cgstTaxRate, setCGST] = useState(product.cgstTaxRate.toString())
  const [sgstTaxRate, setSGST] = useState(product.sgstTaxRate.toString())
  const [inventory, setInventory] = useState(product.stock == null ? false : true)
  const [stock, setStock] = useState(product.stock == null ? "" : product.stock.toString())
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom)
  const [processing, setProcessing] = useState(false)

  const register = async () => {
    try {
      setProcessing(true)
      const prod = (await (await fetch('/api/product', {
        method: "PUT", 
        body: JSON.stringify({
          productId: product.id,
          name,
          description,
          basePrice: basePrice ? parseFloat(basePrice) : undefined,
          cgstTaxRate: cgstTaxRate ? parseFloat(cgstTaxRate) : undefined,
          sgstTaxRate: sgstTaxRate ? parseFloat(sgstTaxRate) : undefined,
          stock: stock && inventory ? parseInt(stock ? stock : "0") : undefined,
          tagIds: selectedTags.map(t => t.id)
        })
      })).json()).product

      setProcessing(false)

      toast({
        title: "Updated product",
        description: JSON.stringify(product),
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
    <Dialog open={open} onOpenChange={(o) => {if(o) hydrate(); setOpen(o);}}>
      <DialogTrigger asChild>
        {/* TODO: better solution to nesting dialog in dropdown */}
        <div role="menuitem" className={"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"}>
          <FileEditIcon className="w-4 mr-2"/>Edit details
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>Edits the details of an already registered product.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of the product" value={name} onChange={handleChange(setName)} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Add relevant details here" value={description} onChange={handleChange(setDescription)} />
          </div>
          <div className="space-y-1.5">
            <TagFilter title="Tag" options={tags.map(t => { return { label: t.name, value: t }; })} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="price">Base Price</Label>
            <Input id="price" placeholder="MSRP / On Road Price in ₹" value={basePrice} onChange={handleChange(setPrice)} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <div className="flex flex-col mr-1">
                <Label htmlFor="cgst">CGST Tax</Label>
                <Input id="cgst" placeholder="ex. 9% -> 0.09" value={cgstTaxRate} onChange={handleChange(setCGST)} />
              </div>
              <div className="ml-1 flex flex-col">
                <Label htmlFor="SGST">SGST Tax</Label>
                <Input id="SGST" placeholder="ex. 9% -> 0.09" value={sgstTaxRate} onChange={handleChange(setSGST)} />
              </div>
            </div>
          </div>
          {
            session!.user.admin ?
              <>
                <div className="flex items-center space-y-1.5">
                  <div className="flex items-center justify-center ">
                    <Checkbox id="stock" checked={inventory} onCheckedChange={setInventory} />
                    <label
                      htmlFor="stock"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Does the item have inventory?
                    </label>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" disabled={inventory === true ? false : true} placeholder="Current inventory count" value={stock} onChange={handleChange(setStock)} />
                </div>
              </>
              : null
          }
        </div>
        <DialogFooter className="">
          <Button disabled={processing} onClick={(e) => register()} type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

interface TagFilter {
  title?: string
  options: {
    label: string
    value: Tag
    icon?: React.ComponentType<{ className?: string }>
  }[]
}


const tagSearchAtom = atom("")
export function TagFilter({
  title,

}: TagFilter) {
  const { toast } = useToast()
  const [tags, setTags] = useAtom(tagsAtom)
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom)
  const [tagSearch, setTagSearch] = useAtom(tagSearchAtom)
  const selectedSet = new Set(selectedTags)

  const createTag = async () => {
    try {
      const tag = (await (await fetch('/api/tag', {
        method: "POST", body: JSON.stringify({
          name: tagSearch,
        })
      })).json()).tag

      setTags([...tags, tag])
      selectTag(tag)

      toast({
        title: "Created",
        description: `"${tag.name}" is now a valid tag!`,
      })
    } catch {
      toast({
        title: "Error"
      })
    }
  }

  const selectTag = (tag: Tag) => {
    console.log("selected", tag.name, tag.id)
    if (selectedSet.has(tag)) {
      selectedSet.delete(tag)
    } else {
      selectedSet.add(tag)
    }

    setSelectedTags(Array.from(selectedSet))
  }

  const clearTags = () => {
    setSelectedTags([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedSet?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedSet.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedSet.size} selected
                  </Badge>
                ) : (
                  tags
                    .filter((tag) => selectedSet.has(tag))
                    .map((tag) => (
                      <Badge
                        variant="secondary"
                        key={tag.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {tag.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} onValueChange={(s) => setTagSearch(s)} />
          <CommandList>
            <CommandEmpty>
              <Button onClick={() => createTag()}>Create tag</Button>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => {
                const isSelected = selectedSet.has(tag)
                return (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => selectTag(tag)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{tag.name}</span>
                    {/*
                    TODO: counts for the filters
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                    */}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => clearTags()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}