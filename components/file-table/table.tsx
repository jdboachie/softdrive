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
import FileFilters from "@/components/file-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Doc } from "@/convex/_generated/dataModel"
import { useFileView } from "@/hooks/use-file-view"
import { FileViewSelector } from "@/components/file-view-selector"
import { ColumnVisibilityButton } from "./column-visibility-button"
import FileCard from "../file-card"
import { useIsMobile } from "@/hooks/use-mobile"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends Doc<"files">, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const { view } = useFileView()
  const mobile = useIsMobile()

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
      case "actions":
      case "favorite":
        return "w-10 flex items-center justify-center"
      case "name":
        return "flex-1 flex px-2 text-left items-center justify-start"
      case "size":
      case "_createdAt":
      case "trashedAt":
        return "w-40 px-2 flex items-center justify-start"
      default:
        return "px-4 py-2"
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between gap-2 max-sm:mt-2 max-sm:mb-1">
        <div className="flex items-center gap-4">
          <FileFilters />
          {table.getFilteredSelectedRowModel().rows.length !== 0 && (
            <span className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row{table.getFilteredRowModel().rows.length > 1 && 's'} selected.
            </span>
          )}
        </div>
        <FileViewSelector />
      </div>

      <div className="overflow-x-scroll rounded-sm">
        <div
          data-view={view}
          className="data-[view=list]:divide-y data-[view=list]:flex data-[view=list]:flex-col text-sm rounded-sm"
        >
          {/* Header */}
          <div
            data-view={view}
            className="data-[view=grid]:border-b flex h-10 text-muted-foreground font-medium"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const key = header.column.id
                  if (
                    (view === "grid" || mobile) &&
                    key !== "name" &&
                    key !== "select" // columnvisibilityview single select
                  )
                    return
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
            view === "list" ? (
              table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  onClick={() => {
                    row.toggleSelected()
                  }}
                  className="group flex hover:bg-muted/50 min-w-0 h-10 data-[state=selected]:bg-muted"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const key = cell.column.id
                    if (
                      mobile &&
                      key !== "name" &&
                      key !== "select" &&
                      key !== "actions"
                    )
                      return
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
              <div className="w-full mt-4 lg:mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-7 space-y-8">
                {table.getRowModel().rows.map((row) => (
                  <FileCard
                    key={row.id}
                    file={row.original}
                    toggleChecked={row.toggleSelected}
                    state={row.getIsSelected() ? "selected" : undefined}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="px-4 py-6 text-center text-sm">No files.</div> // work on this
          )}
        </div>
      </div>
    </div>
  )
}

export function DataTableSkeleton() {
  const { view } = useFileView()

  return (
    <div className="overflow-hidden flex flex-col gap-6 rounded-sm">
      {/* Topbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-33 rounded-md" /> {/* File type filter */}
        <Skeleton className="h-9 w-18.5 rounded-md" />
      </div>
      <div className="flex flex-col divide-y text-sm rounded-sm">
        {/* Header Skeleton */}
        <div className="flex h-10 text-muted-foreground font-medium">
          <div className="w-10 flex items-center justify-center">
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="flex-1 flex px-2 items-center justify-start">
            <Skeleton className="h-4 w-1/3" />
          </div>
          {view === "list" && (
            <>
              <div className="w-40 px-2 flex items-center justify-start">
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="w-40 px-2 flex items-center justify-start">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="w-10 flex items-center justify-center">
                <Skeleton className="h-4 w-4" />
              </div>
            </>
          )}
        </div>

        {view === "list" ? (
          <>
            {/* Skeleton Rows */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="flex h-10">
                <div className="w-10 flex items-center justify-center">
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="flex-1 flex px-2 items-center justify-start">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="w-10 flex items-center justify-center">
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="w-40 px-2 flex items-center justify-start">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="w-40 px-2 flex items-center justify-start">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="w-10 flex items-center justify-center">
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <GridViewSkeleton />
        )}
      </div>
    </div>
  )
}

function GridViewSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-4 lg:mt-7 gap-4 lg:gap-7 space-y-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md text-center">
          <Skeleton className="h-44 sm:h-52" />
          <div className="flex flex-col w-full">
            <div className="flex gap-2 items-center text-sm min-w-0 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="text-xs text-left flex justify-between text-muted-foreground">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
