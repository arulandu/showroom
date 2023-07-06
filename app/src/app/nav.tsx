"use client"

import * as React from "react"
import Link from "next/link"

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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Customer",
    href: "/customer",
    description:
      "Customer search. View customer order history and pending invoices.",
  },
  {
    title: "Order",
    href: "/order",
    description:
      "Create orders and print reciepts. Automatically compute cGST+sGST taxes.",
  },
  {
    title: "Product",
    href: "/product",
    description:
      "View products. Set prices. Stock inventory.",
  },
]


export function Navigation() {
  return (
    <div className="mt-2 mx-4 flex">
      <Button variant="link" asChild>
        <Link href="/">
          Joven Motors
          {/* <CogIcon /> */}
        </Link>
      </Button>
      <NavigationMenu className="ml-2">
        <NavigationMenuList>
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
        </NavigationMenuList>
      </NavigationMenu>
      <Button variant="default" asChild className="ml-auto mr-0">
        <Link href="/login">Login {"->"}</Link>
      </Button>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
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
