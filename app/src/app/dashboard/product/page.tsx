import { CreateProduct } from "./create";

export default async function Home() {
  return (
    <>
      <div className=' max-h-screen flex-grow flex flex-col items-center justify-center'>
        <CreateProduct/>
      </div>
    </>
  )
}
