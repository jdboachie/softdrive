"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { Icon } from "@phosphor-icons/react"
import { buttonVariants } from "@/components/ui/button"

type NavLink = {
  url: string
  label: string
  icon?: Icon | LucideIcon
}

type SidenavProps = {
  links: NavLink[]
}

export function Sidenav({ links }: SidenavProps) {
  const pathname = usePathname()

  return (
    <nav className="md:w-full md:max-w-52 gap-px h-fit flex md:flex-col md:sticky md:top-38">
      {links.map((link) => {
        const segments = pathname.split("/") // ['', 't', 'team_abc', 'settings'...]
        const teamId = segments[2] // team_abc

        const actualUrl = link.url.replace(":teamId", teamId)
        const isActive =
          pathname === actualUrl || pathname.startsWith(actualUrl + "/")

        return (
          <Link
            prefetch
            key={link.url}
            href={actualUrl}
            className={cn(
              buttonVariants({
                size: "default",
                variant: isActive ? "secondary" : "ghost",
              }),
              "justify-start shadow-none",
              !isActive
                ? "text-muted-foreground"
                : "bg-neutral-200/80 hover:bg-neutral-200/50 dark:hover:bg-secondary/80 dark:bg-secondary",
            )}
          >
            {link.icon && <link.icon className="size-4.5" />}
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
