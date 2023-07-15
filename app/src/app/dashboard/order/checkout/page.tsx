"use client"
import { atom, useAtom } from "jotai"
import { OrderItem, cartAtom } from "../store"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { handleChange } from "@/lib/handleChange";

const amountAtom = atom<number|undefined>(undefined)
const Payment = ({total}: {total: number}) => {
  const [amount, setAmount] = useAtom(amountAtom)

  return (
    <Card >
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Choose preferred payment method.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          <Label
            htmlFor="cash"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="cash" id="cash" className="sr-only" />
            <Icons.cash className="mb-3 h-6 w-6" />
            Cash
          </Label>
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Card
          </Label>
          <Label
            htmlFor="gpay"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="gpay" id="gpay" className="sr-only" />
            <Icons.google className="mb-3 h-6 w-6" />
            Google Pay
          </Label>
        </RadioGroup>
        <div className="flex flex-col space-y-1.5">
        <Label htmlFor="amount">Payment Amount</Label>
        <Input id="amount" placeholder={`How much did the buyer pay?`} value={amount} onChange={handleChange(setAmount)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  )
}

export default function Checkout() {
  const [cart, setCart] = useAtom(cartAtom);
  const items = Object
    .entries(cart)
    .map(([id, item]: [id: string, item: any]) => {
      return {
        ...item.product,
        cgst: item.product.cgst ? item.product.cgst : 0,
        sgst: item.product.sgst ? item.product.sgst : 0,
        quantity: item.quantity
      }
    })
    .map(p => { return { ...p, total: p.quantity * p.basePrice * (1 + p.cgst + p.sgst) } })
  
  const total = items.map(a => a.total).reduce((a, b) => a + b, 0).toFixed(2)
  
  return (
    <>
      <div className='min-h-screen flex-grow flex flex-col items-center justify-start'>
        <Table className="mx-auto max-w-3xl text-muted-foreground">
          <TableCaption>A summary of the items in your cart.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Quantity</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Unit Price (₹)</TableHead>
              <TableHead>CGST</TableHead>
              <TableHead>SGST</TableHead>
              <TableHead className="text-right">Total (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(p =>
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.quantity}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.basePrice.toFixed(2)}</TableCell>
                <TableCell>{p.cgst * 100}%</TableCell>
                <TableCell>{p.sgst * 100}%</TableCell>
                <TableCell className="text-right">{p.total.toFixed(2)}</TableCell>
              </TableRow>
            )}
            <TableRow className="bg-secondary">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right font-bold">₹{}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Payment total={total}/>
      </div>
    </>
  )
}
