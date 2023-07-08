import { getSession } from "@/lib/session"

export default async function Home() {
  return (
    <>
      <div className='max-h-screen flex-grow flex flex-col items-center justify-center'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Customer Management
        </h1>
      </div>
    </>
  )
}
