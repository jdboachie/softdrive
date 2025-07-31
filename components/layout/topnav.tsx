// topnav.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "../ui/skeleton"

export default function TopNav() {
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  const isTeamPath = pathname.startsWith("/t/")
  const isAppPath = pathname.startsWith("/account")

  const basePath = isTeamPath
    ? pathname.split("/").slice(0, 3).join("/") // /t/[teamId]
    : "/account"

  const links = isTeamPath
    ? [
        { label: "Drive", url: "" },
        { label: "Trash", url: "/trash" },
        { label: "Team", url: "/team" },
      ]
    : isAppPath
      ? [
          { label: "Account", url: "" },
          { label: "Settings", url: "/settings" },
        ]
      : []

  const isActive = (url: string) => {
    if (url === "") {
      return (
        pathname === basePath ||
        (isTeamPath && /^\/t\/[^/]+\/f\/[^/]+$/.test(pathname))
      )
    }
    return pathname.startsWith(`${basePath}${url}`)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const underline = underlineRef.current
    if (!container || !underline) return

    const activeLink = container.querySelector(".active-link") as HTMLElement
    if (activeLink) {
      underline.style.width = `${activeLink.offsetWidth}px`
      underline.style.left = `${activeLink.offsetLeft}px`
    }
  }, [pathname])

  if (links.length === 0) return <TopNavSkeleton />

  return (
    <div className="containor mx-auto">
      <nav
        ref={containerRef}
        className="relative flex p-2 overflow-x-auto hidden-scrollbar"
      >
        <span
          ref={underlineRef}
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-primary rounded-t-full transition-all duration-300 ease-out z-50"
        />
        {links.map((link) => (
          <Link
            prefetch={true}
            key={link.label}
            href={`${basePath}${link.url}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              !isActive(link.url) && "text-muted-foreground",
              isActive(link.url) && "active-link",
              "relative duration-500",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function TopNavSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 mt-1.5">
      <Skeleton className="h-2.5 w-10" />
      <Skeleton className="h-2.5 w-24" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  )
}
