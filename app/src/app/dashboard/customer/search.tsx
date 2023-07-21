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
  const [email, setEmail] = useState("")
  const [processing, setProcessing] = useState(false)

  const search = async () => {
    // search database for user with current field values
    try {
      setProcessing(true)
      
      const customer = (await (await fetch("/api/customer?" + new URLSearchParams({email}))).json()).customer
      if (!customer) throw Error()

      setProcessing(false)

      toast({ title: "Found customer." })
      router.push(`/dashboard/customer/${customer.id}`)
    } catch {
      toast({ title: "Not found.", description: "This customer's details was not found in our system. please update and try again. If this is the customer's first recorded entry, create a new customer." })
    }
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="employee@gmail.com" value={email} onChange={handleChange(setEmail)} />
            </div>
            <Button variant="secondary" disabled={processing ? true : false} onClick={(e) => {e.preventDefault(); search()}} className="flex-grow">Search</Button>
          </div>
        </form>
      </CardContent >
    </Card >
  );
}

