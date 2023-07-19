"use client"

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { handleChange } from "@/lib/handleChange"
import { CheckedState } from "@radix-ui/react-checkbox"

import { atom, useAtom } from "jotai"

const employeeNameAtom = atom("")
const employeeEmailAtom = atom("")
const employeeAdminAtom = atom<CheckedState>(false)

export function RegisterEmployee() {
  const { toast } = useToast()

  const [employeeName, setEmployeeName] = useAtom(employeeNameAtom)
  const [employeeEmail, setEmployeeEmail] = useAtom(employeeEmailAtom)
  const [employeeAdmin, setEmployeeAdmin] = useAtom(employeeAdminAtom)

  const register = async () => {
    const employee = (await (await fetch('/api/employee', {method: "POST", body: JSON.stringify({
      name: employeeName,
      email: employeeEmail,
      admin: employeeAdmin
    })})).json()).employee

    toast({
      title: "Registered",
      description: `Created ${employee.admin ? "" : "non-"}admin employee ${employee.name} (${employee.email})`,
    })
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Register employee</CardTitle>
        <CardDescription>Gives employee access to inventory, order, and customer data.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of the employee" value={employeeName} onChange={handleChange(setEmployeeName)}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="employee@gmail.com" value={employeeEmail} onChange={handleChange(setEmployeeEmail)} />
            </div>
            <div className="flex items-center space-y-1.5">
              <div className="flex items-center">
                <Checkbox id="terms" checked={employeeAdmin} onCheckedChange={setEmployeeAdmin} />
                <label
                  htmlFor="terms"
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Grant admin privileges
                </label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="">
      <Button onClick={(e) => register()}>Register</Button>
      </CardFooter>
    </Card>
  )
}
