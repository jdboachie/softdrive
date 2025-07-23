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
        className="text-right"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {renderFileIcon(row.original.type)}
          {row.original.name}
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
    header: "Size",
    cell: ({ row }) => {
      return <div>{formatBytes(row.getValue("size"))}</div>
    },
  },
  {
    accessorKey: "_createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="w-full justify-end -mr-2"
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
  const toggleFileFavorite = useMutation(api.files.toggleFileFavorite)

  return (
    <Button
      disabled={loading}
      variant={"ghost"}
      size={"icon"}
      className="size-7"
      onClick={() => {
        if (!team) return
        toggleFileFavorite({ teamId: team._id, fileId: fileId })
      }}
    >
      <StarIcon weight={favorite ? "fill" : "regular"} />
    </Button>
  )
}
