import { getSession } from "@/lib/session"
import { CustomerSearch } from "./search"

export default async function Home() {
  return (
    <>
      <div className='max-h-screen flex-grow flex flex-col items-center justify-center'>
        <CustomerSearch/>
      </div>
    </>
  )
}
