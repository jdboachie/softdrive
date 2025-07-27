"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { FileIcon } from "../file-icon"
import { useTeam } from "@/hooks/use-team"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FileActions } from "../file-actions"
import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { formatBytes, formatRelativeDate } from "@/lib/utils"
import { DataTableColumnHeader } from "./data-table-column-header"
import { StarIcon, FolderSimpleIcon } from "@phosphor-icons/react"

const commonColumns: ColumnDef<Doc<"files">>[] = [
  // select
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
          className="!shadow-none data-[state=checked]:shadow-xs"
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
  // name
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
      return <FileLink file={row.original} />
    },
  },
  // favorite
  {
    accessorKey: "favorite",
    header: undefined,
    cell: ({ row }) => {
      return (
        <FavoriteButton
          fileId={row.original._id}
          favorite={row.original.isStarred ?? false}
        />
      )
    },
  },
  // size
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      if (row.original.isFolder)
        return null
      if (!row.original.size)
        return null
      return <>{formatBytes(row.getValue("size"))}</>
    },
  },
]

export const columns: ColumnDef<Doc<"files">>[] = [
  ...commonColumns,
  // created at
  {
    accessorKey: "_createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatRelativeDate(row.original._creationTime)}
        </div>
      )
    },
  },
  // actions
  {
    id: "actions",
    cell: ({ row }) => {
      return <FileActions file={row.original} />
    },
  },
]

export const trashColumns: ColumnDef<Doc<"files">>[] = [
  ...commonColumns,
  // trashed at
  {
    accessorKey: "trashedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trashed At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatRelativeDate(row.original.trashedAt!)}
        </div>
      )
    },
  },
  // actions
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
  const toggleFileIsStarred = useMutation(api.files.toggleFileIsStarred)

  return (
    <Button
      disabled={loading || pending}
      variant={"ghost"}
      size={"icon"}
      className="size-7"
      onClick={async () => {
        if (!team) return
        setPending(true)
        await toggleFileIsStarred({ teamId: team._id, fileId: fileId })
        setPending(false)
      }}
    >
      <StarIcon weight={favorite ? "fill" : "regular"} />
    </Button>
  )
}

function FileLink({ file }: { file: Doc<"files"> }) {
  const { team } = useTeam()

  return (
    <Link
      target={file.isFolder ? "_self" : "_blank"}
      href={
        file.isFolder && team
          ? `/t/${team._id}/f/${file._id}`
          : !file.isFolder && file.url
            ? file.url
            : "#"
      }
      className="flex gap-2 items-center w-fit lg:max-w-[65ch] md:max-w-[35ch] hover:underline hover:underline-offset-3 decoration-dotted"
    >
      {file.isFolder ? (
        <FolderSimpleIcon
          size={32}
          weight="fill"
          className="size-6 text-primary"
        />
      ) : (
        <FileIcon type={file.type} size="sm" />
      )}
      <span className="truncate">{file.name}</span>
    </Link>
  )
}
