"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, LayoutGridIcon, LogsIcon } from "lucide-react"

const VIEWS = ["list", "grid"] as const
type ViewType = (typeof VIEWS)[number]

const LOCAL_STORAGE_KEY = "file_view"

export function FileViewSelector() {
  const router = useRouter()
  const [view, setView] = React.useState<ViewType>("list")

  React.useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved && VIEWS.includes(saved as ViewType)) {
      setView(saved as ViewType)
    }
  }, [])

  const handleChange = (value: ViewType) => {
    setView(value)
    localStorage.setItem(LOCAL_STORAGE_KEY, value)
    router.push(`?view=${value}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {view === "list" ? (
            <LogsIcon />
          ) : (
            <LayoutGridIcon />
          )}
          <ChevronDownIcon className="ml-2" />
          <span className="sr-only">Toggle view</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
        <DropdownMenuLabel>File view</DropdownMenuLabel>
        <DropdownMenuSeparator/>
          {VIEWS.map((v) => (
            <DropdownMenuItem key={v} onSelect={() => handleChange(v)}>
              {v === "list" ? (
                <>
                  <LogsIcon />
                  List
                </>
              ) : (
                <>
                  <LayoutGridIcon />
                  Grid
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useFileView() {
  const [view, setView] = React.useState<ViewType>("list")

  React.useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved && VIEWS.includes(saved as ViewType)) {
      setView(saved as ViewType)
    }
  }, [])

  const changeView = (value: ViewType) => {
    setView(value)
    localStorage.setItem(LOCAL_STORAGE_KEY, value)
  }

  return { view, changeView }
}
