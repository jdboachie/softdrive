"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Icon } from "@phosphor-icons/react"
import { usePathname } from "next/navigation"
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
      {links.map((link: NavLink) => {
        const teamId = pathname.split("/")[2]
        const linkPath = link.url.replace(":teamId", teamId)
        const isActive = pathname === linkPath

        return (
          <Link
            prefetch
            key={link.url}
            href={linkPath}
            className={cn(
              buttonVariants({
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
