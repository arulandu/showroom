"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useAtom } from "jotai"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Cog, Cog as CogIcon } from "lucide-react"
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useEffect } from "react"
import { Session } from "inspector"
import { sessionAtom } from "@/app/session"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navigation() {
  const [session] = useAtom(sessionAtom)

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Store",
      href: "/dashboard/store",
      description:
        "Process orders. Manage product details and inventory.",
    },
    {
      title: "Customer",
      href: "/dashboard/customer",
      description:
        "Customer search. View customer order history and pending invoices.",
    },
    ... (session?.user.admin ? [{
      title: "Admin",
      href: "/dashboard/admin",
      description: "Manage employees. View order history."
    }] : [])
  ]

  return (
    <div className="flex z-10 bg-opacity-25">
      <Button variant="link" className="pl-0" asChild>
        <Link href="/">
          Joven Motors
          {/* <CogIcon /> */}
        </Link>
      </Button>
      <NavigationMenu className="ml-2">
        <NavigationMenuList>
          {session ?
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-3 p-4 md:w-72 grid-cols-1 lg:w-96 ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            : null
          }
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex ml-auto mr-0">
        {session ?
          <>
            <Button variant="default" onClick={() => signOut({ callbackUrl: "/" })}>
              Log Out
            </Button>
            <Avatar className="ml-2">
              <AvatarImage src={session.user.pfp ? session.user.pfp : undefined} referrerPolicy="no-referrer" alt={session.user.name} />
              <AvatarFallback>ACA</AvatarFallback>
            </Avatar>
          </>
          :
          <Button variant="default" onClick={() => signIn("google", { callbackUrl: window.location.pathname === "/404" ? "/" : window.location.pathname })}>
            Login {"->"}
          </Button>
        }
      </div>
    </div>
  )
}

const ListItem = forwardRef<
  ElementRef<"a">,
  ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
