"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { handleChange } from "@/lib/handleChange"
import { atom, useAtom } from "jotai"
import { CheckCheckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const CustomerSearch = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [processing, setProcessing] = useState(false)

  const search = async () => {
    // search database for user with current field values
    try {
      setProcessing(true)
      
      const {customers} = (await (await fetch("/api/customer?" + new URLSearchParams({phone}))).json())
      if (!customers || customers.length == 0) throw Error()

      if(customers.length > 1) {
        // TODO: step through the customers with arrows?
        toast({title: "Error", description: "Multiple customers with this search have been found. Please specify."})
        return
      }

      const customer = customers[0]

      toast({ title: "Found customer." })
      router.push(`/dashboard/customer/${customer.id}`)
    } catch {
      toast({ title: "Not found.", description: "This customer's details was not found in our system. please update and try again. If this is the customer's first recorded entry, create a new customer." })
    }

    setProcessing(false)
  }

  return (
    <Card className="my-2 max-w-3xl">
      <CardHeader>
        <CardTitle>Customer</CardTitle>
        <CardDescription>View details for a returning customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1-(123)-456-7890" value={phone} onChange={handleChange(setPhone)} />
            </div>
            <Button variant="secondary" disabled={processing ? true : false} onClick={(e) => {e.preventDefault(); search()}} className="flex-grow">Search</Button>
          </div>
        </form>
      </CardContent >
    </Card >
  );
}

