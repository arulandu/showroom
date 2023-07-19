import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { Customer, Order } from "@prisma/client"
import { redirect } from "next/navigation";
import { OrderCard } from "./order";


const CustomerCard = ({ customer }: { customer: Customer }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-4 items-start">
          <Avatar>
            <AvatarFallback>{customer.name.split(" ").map(s => s[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="">
            <p className="text-md font-medium leading-none">
              {customer.name}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>{customer.address}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default async function Home({ params }: { params: { id: string } }) {
  const customer = await db.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        include: {
          invoice: true
        }
      }
    }
  })
  if (!customer) redirect("/404")

  const sortedOrders = customer.orders.sort((a, b) => {
    const unpaidA = a.invoice!.amountPaid < a.invoice!.amount
    const unpaidB = b.invoice!.amountPaid < b.invoice!.amount

    if (unpaidA && !unpaidB) return -1;
    if (!unpaidA && unpaidB) return 1;

    return +new Date(b.createdAt) - +new Date(a.createdAt)
  })

  return (
    <>
      <div className='min-h-screen space-y-8 flex-grow flex flex-col items-center justify-center'>
        <CustomerCard customer={customer} />
        <div className="w-full flex-grow flex-col space-y-4">
          <h3 className="text-center scroll-m-20 text-2xl font-semibold tracking-tight">Order History</h3>
          <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 ">
            {sortedOrders.map(order =>
              <OrderCard order={order} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

