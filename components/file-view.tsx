"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { ListDashesIcon, SquaresFourIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

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
          {view === "list" ? <ListDashesIcon /> : <SquaresFourIcon />}
          <ChevronDownIcon className="ml-2" />
          <span className="sr-only">Toggle view</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {VIEWS.map((v) => (
          <DropdownMenuItem key={v} onSelect={() => handleChange(v)}>
            {v === "list" ? (
              <>
                <ListDashesIcon />
                List
              </>
            ) : (
              <>
                <SquaresFourIcon />
                Grid
              </>
            )}
          </DropdownMenuItem>
        ))}
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
