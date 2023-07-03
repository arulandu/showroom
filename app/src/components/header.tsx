import Image from 'next/image';
import OutlineButton from "./OutlineButton";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ToastAction, useToasts } from './ToastProvider';

const NavLink = ({ index, href, name, onClick = () => { } }) => {
  return (
    <Link href={href} passHref>
      <a className='mb-2 md:mx-4 md:mb-0 text-white hover:text-blue text-md transition-all' onClick={onClick}><span className='text-blue'>#{index}. </span>{name}</a>
    </Link>
  );
}

const HamburgerButton = ({ open, onClick = () => { } }) => {
  return (
    <button className='relative md:hidden' onClick={onClick}>
      <div className={`w-8 h-[2px] bg-blue ${open ? 'translate-y-[10px] rotate-45' : ''} transition-all`}></div>
      <div className={`my-2 w-8 h-[2px] ${open ? 'bg-transparent' : 'bg-blue'} transition-all`}></div>
      <div className={`w-8 h-[2px] bg-blue ${open ? ' -translate-y-[10px] -rotate-45' : ''} transition-all`}></div>
    </button>
  );
}

const CloseButton = ({ open, className = '', onClick = () => { } }) => {
  return (
    <button className={`${className}`} onClick={onClick}>
      <div className={`w-2 h-[2px] bg-blue ${open ? 'translate-y-[10px] rotate-45' : ''} transition-all`}></div>
      <div className={`w-2 h-[2px] my-2 ${open ? 'bg-transparent' : 'bg-blue'} transition-all`}></div>
      <div className={`w-2 h-[2px] bg-blue ${open ? ' -translate-y-[10px] -rotate-45' : ''} transition-all`}></div>
    </button>
  );
}

const NavBar = () => {
  const [isOpen, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { data: session } = useSession()
  const router = useRouter()
  const { toastDispatch } = useToasts()
  const [path, setPath] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') setPath(window.location.href)
  }, [path])

  useEffect(() => {
    const atTopCallback = () => {
      if (window.scrollY >= 80) setAtTop(false);
      else setAtTop(true)
    }

    window.addEventListener('scroll', atTopCallback)
    return () => window.removeEventListener('scroll', atTopCallback)
  })

  return (
    <nav className={`relative h-full ${atTop ? 'bg-transparent' : 'bg-navy'} flex items-center justify-between z-10 py-6 px-4 sm:px-12 lg:px-24 transition-all ease-in-out duration-500`}>
      <div className='flex relative z-20'>
        <HamburgerButton open={isOpen} onClick={() => setOpen(!isOpen)} />
        <Link href="/" passHref>
          <a className="relative ml-4 w-12 md:w-20 aspect-[5/3] opacity-90 hover:opacity-100 transition-all ease-in-out">
            <Image src="/images/logo.svg" alt="Logo" layout="fill" />
          </a>
        </Link>
      </div>
      <div className={`block w-full md:w-fit h-screen md:h-full z-10 absolute md:relative top-0 ${isOpen ? 'left-0' : 'left-[-200%] md:left-0'} px-4 sm:px-12 md:px-0 flex flex-col md:flex-row items-start md:items-center justify-center bg-navy bg-opacity-90 md:bg-transparent transition-all`}>

        {
          session ?
            <>
              <img className={`mr-2 h-4 md:h-full aspect-square rounded-full border-solid border-[3px] ${(session.user as any).admin ? " border-amber-400" : "border-blue"}`} src={session.user.image}></img>
              <OutlineButton className='mt-4 md:ml-4 md:mt-0' name="Log Out" onClick={signOut} />
            </>
            :
            <OutlineButton className='mt-4 md:ml-4 md:mt-0' name="Log In" onClick={() => signIn("google", { callbackUrl: path })} />
        }
      </div>
    </nav>
  );
}

export enum ToastType {
  SUCCESS,
  DANGER,
  DEFAULT
}

export const DefaultToast = ({ title, description, type = ToastType.DEFAULT }) => {
  let color = 'text-white'
  switch (type) {
    case ToastType.SUCCESS:
      color = 'text-green-300';
      break;
    case ToastType.DANGER:
      color = 'text-pink'
      break;
  }

  return (
    <>
      <h5 className={`${color} text-xl font-bold`}>{title}</h5>
      <p className={`${color} text-sm`}>{description}</p>
    </>
  );
}

export const notify = (toastDispatch, title, description, type = ToastType.SUCCESS) => {
  toastDispatch({
    type: ToastAction.ADD, payload: {
      content: <DefaultToast title={title} description={description} type={type} />,
    }
  })
}

const Toast = ({ toast }) => {
  const { toastDispatch } = useToasts()
  const close = () => {
    toastDispatch({ type: ToastAction.REMOVE, payload: { id: toast.id } })
  }

  useEffect(() => {
    const t = setTimeout(() => close(), 1e3 * toast.duration)
    return () => clearTimeout(t)
  })

  return (
    <div key={toast.id} className='relative m-2 p-2 w-64 bg-navy-light rounded-md'>
      <CloseButton open={true} onClick={close} className='absolute top-0 right-2' />
      {toast.content}
    </div>
  );
}

const Toaster = () => {
  const { toasts } = useToasts();

  return (
    <div className='absolute top-0 right-0 z-20'>
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>

  );
}

const Header = () => {
  return (
    <header className='fixed z-50 w-full h-16 sm:h-24'>
      <Toaster />
      <NavBar />
    </header>
  );
}

export default Header