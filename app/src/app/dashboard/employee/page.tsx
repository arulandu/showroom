import { getSession } from "@/lib/session";
import { RegisterEmployee } from "./register";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession()
  if(!session.user.admin) redirect('/404')
  
  return (
    <>
      <div className='max-h-screen flex-grow flex flex-col items-center justify-center'>
        <RegisterEmployee />
      </div>
    </>
  )
}
