"use client"
import { atom, useAtom } from "jotai"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { handleChange } from "@/lib/handleChange";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const fullAtom = atom<CheckedState>(false)
const amountAtom = atom<number | undefined>(undefined)
const methodAtom = atom("CASH")
export const paymentAtom = atom((get) => { return {amount: get(amountAtom), method: get(methodAtom)}})

export const Payment = ({ total, className }: { total: number, className?: string }) => {
  const [full, setFull] = useAtom(fullAtom)
  const [amount, setAmount] = useAtom(amountAtom)
  const [method, setMethod] = useAtom(methodAtom)

  const onCheck = (c: CheckedState) => {
    if(c == true) setAmount(total)
    setFull(c)
  }

  return (
    <Card className={cn("my-2 w-full", className)}>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Choose preferred payment method.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup value={method} className="grid grid-cols-3 gap-4" onValueChange={setMethod}>
          <Label
            htmlFor="cash"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="CASH" id="cash" className="sr-only" />
            <Icons.cash className="mb-3 h-6 w-6" />
            Cash
          </Label>
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="CARD" id="card" className="sr-only" />
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
            <RadioGroupItem value="GPAY" id="gpay" className="sr-only" />
            <Icons.google className="mb-3 h-6 w-6" />
            Google Pay
          </Label>
        </RadioGroup>
        <div className="flex items-center space-y-1.5">
          <div className="flex items-center justify-center ">
            <Checkbox id="full" checked={full} onCheckedChange={onCheck}/>
            <label
              htmlFor="full"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is the customer paying the full amount?
            </label>
          </div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="amount">Payment Amount (Rs.)</Label>
          <Input id="amount" placeholder={`How much did the buyer pay?`} value={amount} onChange={handleChange(setAmount)} />
        </div>
      </CardContent>
    </Card>
  )
}
