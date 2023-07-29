"use client"

import { Button } from "@/components/ui/button";
import { Payment, paymentAtom } from "../../store/checkout/payment";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export const PayInvoice = ({ order }: { order: any }) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [payment] = useAtom(paymentAtom)
  const router = useRouter()

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

      setOpen(false);
      router.refresh()

      toast({ title: `Paid Rs.${payment.amount}` })
    } catch {
      toast({ title: "Error" })
    }
  }

  return (
    <>
      {order.amountOwed > 0 ?
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Pay invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <Payment total={order.amountOwed} className="max-w-3xl" />
            <Button className="w-full" onClick={pay}>Pay invoice</Button>
          </DialogContent>
        </Dialog>
        : null
      }
    </>
  );
}