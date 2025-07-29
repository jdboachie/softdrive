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
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, LayoutGridIcon, LogsIcon } from "lucide-react"
import { useFileView } from "@/hooks/use-file-view"

const VIEWS = ["list", "grid"] as const

export function FileViewSelector() {
  const { view, changeView } = useFileView()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {view === "list" ? <LogsIcon /> : <LayoutGridIcon />}
          <ChevronDownIcon className="ml-2" />
          <span className="sr-only">Toggle view</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File view</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {VIEWS.map((v) => (
            <DropdownMenuItem key={v} onSelect={() => changeView(v)}>
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
