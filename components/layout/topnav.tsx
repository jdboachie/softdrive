"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

const links = [
  { label: "Files", url: "" },
  { label: "Trash", url: "/trash" },
  { label: "Favorites", url: "/favorites" },
  { label: "Settings", url: "/settings" },
]

export default function TopNav() {
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)

  const pathname = usePathname()
  const basePath = pathname.split("/").slice(0, 3).join("/") // /t/teamId

  const isActive = (url: string) => {
    const target = url === "" ? basePath : `${basePath}${url}`
    return pathname.startsWith(target)
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

  return (
    <div className="containor mx-auto">
      <nav
        ref={containerRef}
        className="relative flex p-2 overflow-x-scroll hidden-scrollbar"
      >
        <span
          ref={underlineRef}
          className="z-10 absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-150 ease-out"
        />
        {links.map((link) => (
          <Link
            prefetch
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
