"use client"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { formatBytes, formatRelativeDate } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { FileActions, renderFileIcon } from "../file-item"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { StarIcon } from "@phosphor-icons/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"
import { DataTableColumnHeader } from "./data-table-column-header"
import { useState } from "react"

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="grid place-items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="grid place-items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="self-center"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="text-right w-full"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center max-w-[45ch] w-full">
          {renderFileIcon(row.original.type)}
          <span className="truncate">{row.original.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "favorite",
    header: undefined,
    cell: ({ row }) => {
      return (
        <FavoriteButton
          fileId={row.original._id}
          favorite={row.original.favorite ?? false}
        />
      )
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Size"
      />
    ),
    cell: ({ row }) => {
      return <>{formatBytes(row.getValue("size"))}</>
    },
  },
  {
    accessorKey: "_createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatRelativeDate(row.original._creationTime)}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <FileActions file={row.original} />
    },
  },
]

function FavoriteButton({
  fileId,
  favorite = false,
}: {
  fileId: Id<"files">
  favorite: boolean
}) {
  const { team, loading } = useTeam()
  const [pending, setPending] = useState<boolean>()
  const toggleFileFavorite = useMutation(api.files.toggleFileFavorite)

  return (
    <Button
      disabled={loading || pending}
      variant={"ghost"}
      size={"icon"}
      className="size-7"
      onClick={async () => {
        if (!team) return
        setPending(true)
        await toggleFileFavorite({ teamId: team._id, fileId: fileId })
        setPending(false)
      }}
    >
      <StarIcon weight={favorite ? "fill" : "regular"} />
    </Button>
  )
}
