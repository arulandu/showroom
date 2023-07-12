import { db } from "@/lib/db";
import { CreateProduct } from "./create";

export default async function Home() {
  const tags = await db.tag.findMany({})

  return (
    <>
      <div className=' max-h-screen flex-grow flex flex-col items-center justify-center'>
        <CreateProduct serverTags={tags}/>
      </div>
    </>
  )
}
