import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if(!session) redirect("/404")

  return (
    <>
      {children}
    </>
  )
}