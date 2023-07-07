import { RegisterEmployee } from "./register";

export default async function Home() {

  return (
    <>
      <div className='max-h-screen flex-grow flex flex-col items-center justify-center'>
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Employee Management
        </h1>
        <RegisterEmployee />
      </div>
    </>
  )
}
