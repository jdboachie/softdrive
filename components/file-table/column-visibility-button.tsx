"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Table } from "@tanstack/react-table"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColumnVisibilityButtonProps<TData> {
  table: Table<TData>
}

export function ColumnVisibilityButton<TData>({
  table,
}: ColumnVisibilityButtonProps<TData>) {
  return (
    <DropdownMenu>
      <Tooltip delayDuration={250}>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronDownIcon />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent side="left">
          <p>Toggle columns</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id === "_createdAt" ? "Created at" : column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
