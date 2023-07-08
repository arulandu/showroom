"use client"

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

const nameAtom = atom("")
const descAtom = atom(undefined)
const priceAtom = atom("")
const cgstAtom = atom(undefined)
const sgstAtom = atom(undefined)
const inventoryAtom = atom<CheckedState>(false)
const stockAtom = atom(undefined)

export function CreateProduct() {
  const { toast } = useToast()

  const [name, setName] = useAtom(nameAtom)
  const [description, setDescription] = useAtom(descAtom)
  const [basePrice, setPrice] = useAtom(priceAtom)
  const [cgstTaxRate, setCGST] = useAtom(cgstAtom)
  const [sgstTaxRate, setSGST] = useAtom(sgstAtom)
  const [inventory, setInventory] = useAtom(inventoryAtom)
  const [stock, setStock] = useAtom(stockAtom)

  const register = async () => {
    try {
      const product = (await (await fetch('/api/product', {method: "POST", body: JSON.stringify({
        name,
        description,
        basePrice: basePrice ? parseFloat(basePrice) : undefined,
        cgstTaxRate: cgstTaxRate ? parseFloat(cgstTaxRate) : undefined,
        sgstTaxRate: sgstTaxRate ? parseFloat(sgstTaxRate) : undefined,
        stock: stock && inventory ? parseInt(stock): undefined
      })})).json()).product

      toast({
        title: "Created",
        description: JSON.stringify(product),
      })
    } catch {
      toast({
        title: "Error"
      })
    }    
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
        <CardDescription>Adds a new service, tool, motorcycle, etc. to the showroom database.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of the product" value={name} onChange={handleChange(setName)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Add relevant details here" value={description} onChange={handleChange(setDescription)} />
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="">
        <Button onClick={(e) => register()}>Register</Button>
      </CardFooter>
    </Card>
  )
}
