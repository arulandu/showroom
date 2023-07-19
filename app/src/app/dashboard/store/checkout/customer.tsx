import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { handleChange } from "@/lib/handleChange"
import { atom, useAtom } from "jotai"
import { CheckCheckIcon } from "lucide-react"

export const customerAtom = atom<any>(null)
const nameAtom = atom("")
const emailAtom = atom("")
const phoneAtom = atom("")
const addressAtom = atom("")

export const Customer = () => {
  const { toast } = useToast()
  const [name, setName] = useAtom(nameAtom)
  const [email, setEmail] = useAtom(emailAtom)
  const [phone, setPhone] = useAtom(phoneAtom)
  const [address, setAddress] = useAtom(addressAtom)
  const [customer, setCustomer] = useAtom(customerAtom)

  const fCustomer = {
    name, email, phone, address
  }
  const search = async () => {
    // search database for user with current field values
    try {
      const customer = (await (await fetch("/api/customer?=" + new URLSearchParams(fCustomer))).json()).customer
      if (!customer) throw Error()
      setCustomer(customer)
      setName(customer.name)
      setEmail(customer.email)
      setPhone(customer.phone)
      setAddress(customer.address)
      toast({ title: "Found customer." })
    } catch {
      toast({ title: "Not found.", description: "This customer's details was not found in our system. please update and try again. If this is the customer's first recorded entry, create a new customer." })
    }
  }

  const create = async () => {
    // create new customer with current field values
    try {
      const customer = (await (await fetch("/api/customer", { method: "POST", body: JSON.stringify(fCustomer) })).json()).customer
      setCustomer(customer)
      toast({ title: "Created." })
    } catch {
      toast({ title: "Could not create." })
    }
  }

  return (
    <Card className="my-2 w-full">
      <CardHeader>
        <CardTitle>Customer <CheckCheckIcon className={`${customer ? "inline" : "hidden"} text-green-400`} /></CardTitle>
        <CardDescription>Link this order to the customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="employee@gmail.com" value={email} onChange={handleChange(setEmail)} />
            </div>
            <Button variant="secondary" disabled={customer ? true : false} onClick={(e) => {e.preventDefault(); search()}} className="flex-grow">Search</Button>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of the employee" value={name} onChange={handleChange(setName)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1-(123)-456-7890" value={phone} onChange={handleChange(setPhone)} />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Wallaby Way, Shelby, Australia" value={address} onChange={handleChange(setAddress)} />
          </div>
        </form>
      </CardContent >
      <CardFooter>
        <div className="flex w-full">
          <Button variant="secondary" onClick={create} disabled={customer ? true : false} className="flex-grow">Create</Button>
        </div>
      </CardFooter>
    </Card >
  );
}

