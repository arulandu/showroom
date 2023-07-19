"use client"
import { atom, useAtom } from "jotai"
import { OrderItem, cartAtom } from "../store"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CheckCheck, MinusIcon, PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Customer, customerAtom } from "./customer";
import { Payment, paymentAtom } from "./payment";
import { useRouter } from "next/navigation";
import { Finish, notesAtom } from "./finish";

const OrderItemRow = ({ product }: { product: any }) => {
  let [cart, setCart] = useAtom(cartAtom)
  const bag = cart[product.id]?.quantity
  const price = cart[product.id]?.product.basePrice

  const setBag = (quantity: number) => {
    const c = { ...cart }
    if (quantity == 0) delete c[product.id]
    else c[product.id] = { quantity, product }
    setCart(c)
  }

  const setPrice = (price: string) => {
    let p = parseFloat(price)
    const c = { ...cart }
    c[product.id].product.basePrice = isNaN(p) ? 0 : p
    setCart(c)
  }

  return (
    <TableRow key={product.id}>
      <TableCell className="flex items-center font-medium">
        <Button variant="secondary" className="" disabled={bag > 0 ? false : true} onClick={() => setBag(bag - 1)}>
          <MinusIcon className="w-4 h-4" />
        </Button>
        <p className="mx-4 text-muted-foreground">{product.quantity}</p>
        <Button variant="secondary" className="w-fit" disabled={product.stock > bag ? false : true} onClick={() => setBag(bag + 1)}>
          <PlusIcon className="w-4 h-4" />
        </Button>
      </TableCell>

      <TableCell>{product.name}</TableCell>
      <TableCell><Input value={price} onChange={(e) => setPrice(e.target.value)} /></TableCell>
      <TableCell>{product.cgst * 100}%</TableCell>
      <TableCell>{product.sgst * 100}%</TableCell>
      <TableCell className="text-right">{product.total.toFixed(2)}</TableCell>
    </TableRow>
  );
}

export default function Checkout() {
  const {toast} = useToast()
  const router = useRouter()
  const [cart, setCart] = useAtom(cartAtom);
  const [customer] = useAtom(customerAtom)
  const [payment] = useAtom(paymentAtom)
  const [notes] = useAtom(notesAtom)

  const items = Object
    .entries(cart)
    .map(([id, item]: [id: string, item: any]) => {
      return {
        ...item.product,
        price: item.product.basePrice,
        cgst: item.product.cgstTaxRate ? item.product.cgstTaxRate : 0,
        sgst: item.product.sgstTaxRate ? item.product.sgstTaxRate : 0,
        quantity: item.quantity
      }
    })
    .map(p => { return { ...p, total: p.quantity * p.basePrice * (1 + p.cgst + p.sgst) } })

  const total = items.map(a => a.total).reduce((a, b) => a + b, 0)

  const order = async () => {
    try {
      const res = await (await fetch("/api/order", {method: "POST", body: JSON.stringify({
        cart: items,
        customerId: customer.id,
        payment,
        notes
      })})).json()
      if(!res.order.id) throw Error()
      
      setCart({}) // clear cart
      router.push(`/dashboard/order/${res.order.id}`)
      toast({title: "Created order."})
    } catch (e) {
      toast({title: "Error"})
    }
  }

  return (
    <>
      <div className='min-h-screen flex-grow flex flex-col items-center justify-start'>
        <div className="w-full my-4">
          <Button variant="secondary" asChild><Link href="/dashboard/store">{"<-"} Store</Link></Button>
          <Table className="mt-2 mx-auto max-w-3xl text-muted-foreground">
            {/* <TableCaption>A summary of the items in your cart.</TableCaption> */}
            <TableHeader className=" bg-primary-foreground">
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
                <OrderItemRow product={p} key={p.id} />
              )}

              <TableRow className="bg-primary-foreground">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">₹{total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className=" max-w-3xl">
          <Customer />
          <Payment total={total} />
          <Finish onComplete={order}/>
        </div>
      </div>
    </>
  )
}
