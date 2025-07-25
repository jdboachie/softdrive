"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  VisibilityState,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"
import { ColumnVisibilityButton } from "./column-visibility-button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
  })
  const getColumnClass = (key: string) => {
    switch (key) {
      case "select":
        return "w-10 flex items-center justify-center"
      case "actions":
        return "w-10 flex items-center justify-center"
      case "favorite":
        return "w-10 flex items-center justify-center"
      case "name":
        return "flex-1 flex px-2 text-left items-center justify-start"
      case "size":
        return "w-40 px-2 flex items-center justify-start"
      case "_createdAt":
        return "w-40 px-2 flex items-center justify-start"
      default:
        return "px-4 py-2"
    }
  }

  return (
    <>
      {/* <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="overflow-hidden rounded-sm ">
        <div className="flex flex-col divide-y text-sm rounded-sm">
          {/* Header */}
          <div className="flex h-10 text-muted-foreground font-medium">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const key = header.column.id
                  const className = getColumnClass(key)
                  return (
                    <div key={header.id} className={className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {key === "actions" && (
                        <ColumnVisibilityButton table={table} />
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Body */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="flex hover:bg-muted/50 min-w-0 h-10"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const key = cell.column.id
                  const className = getColumnClass(key)
                  return (
                    <div key={cell.id} className={className}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm">No results.</div>
          )}
        </div>
      </div>
    </>
  )
}

export function DataTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm">
      <div className="flex flex-col divide-y text-sm rounded-sm">
        {/* Header Skeleton */}
        <div className="flex h-10 text-muted-foreground font-medium">
          <div className="w-10 flex items-center justify-center">
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="flex-1 flex px-2 items-center justify-start">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="w-40 px-2 flex items-center justify-start">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="w-40 px-2 flex items-center justify-start">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="w-10 flex items-center justify-center">
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        {/* Skeleton Rows */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="flex h-10 hover:bg-muted/50">
            <div className="w-10 flex items-center justify-center">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex-1 flex px-2 items-center justify-start">
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="w-40 px-2 flex items-center justify-start">
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="w-40 px-2 flex items-center justify-start">
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="w-10 flex items-center justify-center">
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}