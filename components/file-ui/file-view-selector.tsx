"use client"

import * as React from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { LayoutGridIcon, LogsIcon } from "lucide-react"
import { useFileExplorer } from "@/hooks/use-file-explorer"

// const VIEWS = ["list", "grid"] as const

export function FileViewSelector() {
  const { view, changeView } = useFileExplorer()

  return (
    <ToggleGroup
      type="single"
      value={view}
      size={'sm'}
      onValueChange={(v) => {
        if (v) changeView(v as "list" | "grid")
      }}
      className="!shadow-inner rounded-md p-px bg-accent border dark:bg-background"
    >
      <ToggleGroupItem value="list" aria-label="List view" className="dark:data-[state=on]:bg-accent data-[state=on]:bg-background !rounded-sm data-[state=on]:shadow-md">
        <LogsIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" className="dark:data-[state=on]:bg-accent data-[state=on]:bg-background !rounded-sm data-[state=on]:shadow-md">
        <LayoutGridIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
