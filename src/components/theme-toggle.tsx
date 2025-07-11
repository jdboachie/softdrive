"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { CircleHalfIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"

export default function ThemeToggle({lg} : { lg?: boolean }) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="flex gap-0 border bg-ground rounded-full">
      <Button
        variant={"ghost"}
        size="icon"
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full`}
      >
        <span className="sr-only">system</span>
        <CircleHalfIcon />
      </Button>

      <Button
        variant={"ghost"}
        size="icon"
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full`}
      >
        <span className="sr-only">light</span>
        <SunIcon />
      </Button>

      <Button
        variant={"ghost"}
        size="icon"
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full`}
      >
        <span className="sr-only">dark</span>
        <MoonIcon />
      </Button>
    </div>
  )

  return (
    <div className="flex gap-0 outline outline-border bg-ground rounded-full">
      <Button
        variant={theme === "system" ? "outline" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full ${theme === "system" && "text-foreground dark:bg-secondary"}`}
      >
        <span className="sr-only">system</span>
        <CircleHalfIcon weight="bold" size={32} />
      </Button>

      <Button
        variant={theme === "light" ? "outline" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full ${theme === "light" && "text-foreground dark:bg-secondary"}`}
      >
        <span className="sr-only">light</span>
        <SunIcon weight="bold" size={32} />
      </Button>

      <Button
        variant={theme === "dark" ? "outline" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className={`${lg ? 'size-8': 'size-6'} text-muted-foreground rounded-full ${theme === "dark" && "text-foreground dark:bg-secondary"}`}
      >
        <span className="sr-only">dark</span>
        <MoonIcon weight="bold" size={32} />
      </Button>
    </div>
  )
}