"use client"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { Table } from "@tanstack/react-table"

interface ColumnVisibilityButtonProps<TData> {
  table: Table<TData>
}

export function ColumnVisibilityButton<TData>({
  table,
}: ColumnVisibilityButtonProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {column.id === "_creationTime" ? "Created at" : column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
