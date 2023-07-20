"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Table, TableRow, TableCaption, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { addDays } from "date-fns";
import { atom, useAtom } from "jotai";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { DateRange } from "react-day-picker";

const dateAtom = atom<DateRange>({
  from: addDays(new Date(), -7),
  to: new Date(),
})
const filterAtom = atom("profit")
const eventsAtom = atom<any[]>([])

export const ProfitReport = () => {
  const [date] = useAtom(dateAtom)
  const [filter, setFilter] = useAtom(filterAtom)
  const [events, setEvents] = useAtom(eventsAtom)

  const search = async () => {
    let { events } = await (await fetch("/api/report?" + new URLSearchParams({
      from: date.from!.toISOString(),
      to: date.to!.toISOString(),
      filter
    }))).json()

    setEvents(events)
  }

  const total = events.map(event => event.type === "order" ? +event.invoice.amountPaid : -event.price * event.delta).reduce((a, b) => a + b, 0)

  return (
    <div className="mt-4 flex-grow flex flex-col items-center space-y-4">
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Profit Report</CardTitle>
          <CardDescription>View recent sources of revenue and expenses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="dates">Date Range</Label>
            <DatePickerWithRange atom={dateAtom} id="dates" />
          </div>
          <div className="flex flex-col space-y-1.5 w-full">
            {/* <Label htmlFor="filter">Filter</Label> */}
            <RadioGroup id="filter" value={filter} onValueChange={setFilter} className="flex justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profit" id="r1" />
                <Label htmlFor="r1">Profit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revenue" id="r2" />
                <Label htmlFor="r2">Revenue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expenses" id="r3" />
                <Label htmlFor="r3">Expenses</Label>
              </div>
            </RadioGroup>
          </div>
          <Button variant="secondary" onClick={search} className="w-full">Search</Button>
        </CardContent>
      </Card>
      {events.length > 0 ?
        <>
          <Separator />
          <p className="text-center text-xl text-muted-foreground">Total: {total >= 0 ? "+" : "-"}₹{Math.abs(total).toFixed(2)}</p>
          <Separator />
        </>
        : null}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map(event =>
            <TableRow>
              <TableHead>{new Date(event.createdAt).toLocaleString()}</TableHead>
              {
                event.type === "order" ?
                  <>
                    <TableHead className=" text-green-400">+₹{event.invoice.amountPaid}</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="flex items-center"><Link href={`/dashboard/order/${event.id}`}><ExternalLinkIcon className="ml-2 w-4" /></Link></TableHead>
                  </>
                  :
                  <>
                    <TableHead className=" text-destructive">-₹{event.price * event.delta}</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>+{event.delta} {event.product.name} for ₹ {event.price} e.a.  </TableHead>
                  </>
              }

            </TableRow>
          )}
        </TableBody>
      </Table>

    </div >
  );
}