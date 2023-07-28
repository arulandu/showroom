import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, FileTextIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export const OrderCard = ({ order }: { order: any }) => {
  order.amountOwed = order.invoice.amount - order.invoice.amountPaid

  return (
    <Card className="" key={order.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="scroll-m-20 text-lg font-semibold tracking-tight">Order for ₹{order.invoice.amount} </CardTitle>
          <Link href={`/dashboard/order/${order.id}`} className="text-muted-foreground"><ExternalLinkIcon className="w-4"/></Link>
        </div>
        <CardDescription>{new Date(order.createdAt).toLocaleString()}</CardDescription>
        <CardDescription className={`${order.amountOwed > 0 ? "text-destructive" : ""}`}>₹{order.amountOwed} Owed</CardDescription>
      </CardHeader>
    </Card>
  );
}