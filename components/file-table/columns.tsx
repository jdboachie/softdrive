"use client"

import Link from "next/link"
import { toast } from "sonner"
import * as React from "react"
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
import { StarIcon, PencilSimpleLineIcon } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

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
    cell: ({ row }) => <EditableFileName file={row.original} />,
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
      if (row.original.isFolder) return null
      if (!row.original.size) return null
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
  const [pending, setPending] = React.useState<boolean>()
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
      className="flex gap-2 items-center w-fit lg:max-w-[65ch] max-lg:max-w-[35ch] max-sm:max-w-[20ch] hover:underline hover:underline-offset-3 decoration-dotted"
    >
      <FileIcon type={file.isFolder ? "folder" : file.type} size="sm" />
      <span className="truncate">{file.name}</span>
    </Link>
  )
}

export function EditableFileName({ file }: { file: Doc<"files"> }) {
  const { team } = useTeam()
  const renameFile = useMutation(api.files.renameFile)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState(file.name)

  const handleRename = () => {
    if (!team || name === file.name) {
      setEditing(false)
      return
    }
    toast.promise(
      renameFile({ teamId: team._id, fileId: file._id, newName: name }).then(
        () => setEditing(false),
      ),
      {
        loading: "Renaming...",
        success: "Renamed successfully",
        error: "Rename failed",
      },
    )
  }
  React.useEffect(() => {
    if (editing && inputRef.current) {
      const dotIndex = name.lastIndexOf(".")
      const end = dotIndex > 0 ? dotIndex : name.length
      inputRef.current.setSelectionRange(0, end)
    }
  }, [editing, name])

  return (
    <div className="group relative flex items-center gap-1 w-full">
      {editing ? (
        <div className="size-full flex items-center gap-2">
          <FileIcon type={file.isFolder ? "folder" : file.type} size="sm" />
          <Input
            value={name}
            ref={inputRef}
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => {
              e.stopPropagation()
              handleRename()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
            autoFocus
            className="bg-transparent -ml-[5px] px-1 text-sm"
          />
        </div>
      ) : (
        <>
          <FileLink file={file} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  setEditing(true)
                  e.stopPropagation()
                }}
                className="!size-7 opacity-0 group-hover:opacity-100 text-muted-foreground text-sm ml-4"
              >
                <PencilSimpleLineIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Rename
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}
