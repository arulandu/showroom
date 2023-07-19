"use client"

import { Button } from "@/components/ui/button";
import { Payment, paymentAtom } from "../../store/checkout/payment";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAtom } from "jotai";

export const PayInvoice = ({ order }: { order: any }) => {
  const { toast } = useToast()
  const [payment] = useAtom(paymentAtom)

  const pay = async () => {
    try {
      const res = await (await fetch("/api/invoice", {
        method: "POST",
        body: JSON.stringify({
          invoiceId: order.invoice.id,
          amount: payment.amount,
          method: payment.method,
        })
      })).json()

      toast({ title: `Paid ₹${payment.amount}` })
    } catch {
      toast({ title: "Error"})
    }
  }

  return (
    <Card className="p-6">
      <Payment total={order.amountOwed} className="max-w-3xl" />
      <Button className="w-full" onClick={pay}>Pay invoice</Button>
    </Card>
  );
}