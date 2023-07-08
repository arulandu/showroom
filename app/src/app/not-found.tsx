export default async function NotFound(){
  return (
    <div className=' max-h-screen flex-grow flex flex-col items-center justify-center'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Looks like this page doesn't exist. If you think it should, try logging in?
        </p>
      </div>
  );
}